# Real-Time Chat App - Backend (MERN + Socket.IO)

This is the **backend API** for a real-time chat application built with **MongoDB, Express, React, Node.js (MERN)** and **Socket.IO**. It enables users to see all available online users and chat in real-time, similar to Instagram DMs.

---

## Features

- Real-time messaging using **Socket.IO**
- Online users list visible to all users
- Private one-to-one chat between users
- Message history stored in **MongoDB**
- User authentication with **JWT**
- CORS enabled for seamless frontend integration

---

## Tech Stack

- **Backend:** Node.js + Express
- **Realtime:** Socket.IO
- **Database:** MongoDB
- **Authentication:** JWT
- **Environment:** dotenv for configuration

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```
git clone https://github.com/shabistasaalam/real-time-chat-app.git
npm install
```

### Create a .env file with the following content

```
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
```

### Run locally
```
npm start
```
* Server runs on http://localhost:5000

### API Endpoints

#### Public Routes

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| POST   | /api/auth/signup | Register a new user |
| POST   | /api/auth/login  | Login existing user |


#### Protected Routes (require JWT)

| Method | Endpoint                 | Description                         |
| ------ | ------------------------ | ----------------------------------- |
| GET    | /api/auth/check          | Verify user authentication          |
| PUT    | /api/auth/update-profile | Update logged-in user's profile     |
| GET    | /api/messages/users      | Get all users for sidebar           |
| GET    | /api/messages/\:id       | Get all messages with selected user |
| PATCH  | /api/messages/mark/\:id  | Mark a single message as seen       |
| POST   | /api/messages/send/\:id  | Send message to a specific user     |
