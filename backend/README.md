# Car Review Backend API

A Node.js backend API for the Car Review application built with Express, Mongoose, and MongoDB.

## Features

- RESTful API endpoints for car reviews
- MongoDB database integration with Mongoose
- CORS enabled for frontend integration
- Input validation and error handling
- CRUD operations for reviews

## API Endpoints

- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create a new review
- `DELETE /api/reviews/:id` - Delete a review
- `PUT /api/reviews/:id` - Update a review
- `GET /api/health` - Health check endpoint

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `config.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/car-review-app
```

3. Start MongoDB service (if running locally)

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 5000 (or the port specified in config.env).

## Database Schema

### Review Model
```javascript
{
  userName: String (required),
  carName: String (required),
  carBrand: String (required),
  review: String (optional),
  date: Date (auto-generated)
}
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string

## Project Structure

```
backend/
├── models/
│   └── Review.js
├── routes/
│   └── reviews.js
├── server.js
├── config.env
├── package.json
└── README.md
``` 