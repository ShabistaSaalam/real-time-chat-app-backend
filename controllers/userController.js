import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import generateToken from '../lib/utils.js'
import cloudinary from "../lib/cloudinary.js";
// --- Signup ---
export const signup = async (req, res) => {
    try {
        const { email, fullName:fullname, password, bio } = req.body;
        if (!email || !fullname || !password || !bio) {
            return res.status(400).json({ success:false,error: 'All fields are required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success:false, error: 'User already exists with this email.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email,
            fullname,
            password: hashedPassword,
            bio
        });

        const token = generateToken(newUser._id);

        res.status(200).json({
            success:true,
            message: "Signup successful",
            user: {
                _id: newUser._id,
                email: newUser.email,
                fullname: newUser.fullname,
                bio: newUser.bio
            },
            token
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// --- Login ---
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ error: 'Email and password are required.' });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(401).json({ error: 'Invalid credentials.' });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success:true,
            message: "Login successful",
            user: {
                _id: user._id,
                email: user.email,
                fullname: user.fullname,
                bio: user.bio
            },
            token       
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//controller to check if user is authenticated
export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user })
}
//controller to update user profile details
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id; // From JWT (auth middleware)
        console.log(req.body)
        const { fullname, bio, profilePic } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Update fields if provided
        if (fullname) user.fullname = fullname;
        if (bio) user.bio = bio;
        if (profilePic) {
            const upload = await cloudinary.uploader.upload(profilePic)
            user.profilePic = upload.secure_url;
        }

        const updatedUser = await user.save();

        res.json({
            success:true,
            message: 'Profile updated successfully',
            user: {
                _id: updatedUser._id,
                email: updatedUser.email,
                fullname: updatedUser.fullname,
                profilePic: updatedUser.profilePic,
                bio: updatedUser.bio
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};