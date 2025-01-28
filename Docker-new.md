# README for Microservices with Docker and Docker Compose

This repository contains three microservices built with Node.js and Express: `auth-service`, `post-service`, and `notification-service`. These services are orchestrated using Docker Compose and connected to MongoDB and MinIO for data storage.

---

## Services Overview

### 1. **Auth Service**
- **Description:** Handles user authentication and authorization.
- **Routes:**
  - `POST /auth/signup`: Sign up a new user.
  - `POST /auth/signin`: Sign in an existing user.

#### File Structure
- **server.js**: Main entry point for the service.
- **routes/authRoutes.js**: Defines authentication routes.
- **controllers/authController.js**: Handles business logic for authentication.
- **models/User.js**: Defines the `User` model for MongoDB.

---

### 2. **Post Service**
- **Description:** Manages posts and file uploads.
- **Routes:**
  - `POST /post`: Create a new post (with file upload).
  - `GET /post`: Fetch all posts.

#### File Structure
- **server.js**: Main entry point for the service.
- **routes/postRoutes.js**: Defines post-related routes.
- **controllers/postController.js**: Handles business logic for posts.
- **models/Post.js**: Defines the `Post` model for MongoDB.
- **config/minioConfig.js**: Configures MinIO client for file uploads.

---

### 3. **Notification Service**
- **Description:** Handles user notifications and background jobs for cleaning old notifications.
- **Routes:**
  - `GET /notification`: Fetch all notifications.
  - `DELETE /notification/clear`: Clear all notifications.

#### File Structure
- **server.js**: Main entry point for the service.
- **routes/notificationRoutes.js**: Defines notification routes.
- **controllers/notificationController.js**: Handles business logic for notifications.
- **models/Notification.js**: Defines the `Notification` model for MongoDB.
- **jobs/notificationCleaner.js**: Defines a job to clean old notifications.

---

## Docker Setup

### **Docker Compose File**
The `docker-compose.yml` file defines the setup for the three services, along with a MongoDB container:

```yaml
version: '3.8'

services:
  auth-service:
    build:
      context: ./auth-service
    ports:
      - "5001:5000"
    environment:
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}

  post-service:
    build:
      context: ./post-service
    ports:
      - "5002:5000"
    environment:
      - MONGO_URI=${MONGO_URI}
      - MINIO_ENDPOINT=${MINIO_ENDPOINT}
      - MINIO_PORT=${MINIO_PORT}
      - MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
      - MINIO_SECRET_KEY=${MINIO_SECRET_KEY}

  notification-service:
    build:
      context: ./notification-service
    ports:
      - "5003:5000"
    environment:
      - MONGO_URI=${MONGO_URI}

  mongo:
    image: mongo:5.0
    container_name: mongo
    ports:
      - "27017:27017"

volumes:
  mongo-data:
```

---

## Running the Services

### **1. Prerequisites**
- Install Docker and Docker Compose.
- Ensure ports `5001`, `5002`, `5003`, and `27017` are available on your machine.

### **2. Start the Services**
1. Clone the repository.
2. Navigate to the root directory containing `docker-compose.yml`.
3. Run the following command to build and start the services:
   ```bash
   docker-compose up --build
   ```

### **3. Access the Services**
- **Auth Service:** `http://localhost:5001`
- **Post Service:** `http://localhost:5002`
- **Notification Service:** `http://localhost:5003`

---

## Environment Variables

Create a `.env` file in the root directory with the following content:

```env
# MongoDB
MONGO_URI=mongodb://mongo:27017/microservices

# JWT Secret
JWT_SECRET=yourjwtsecretkey

# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=user-files
MINIO_USE_SSL=false
```

---

## Testing the Services

Use tools like Postman or `curl` to test the services:

### **Auth Service**
1. **Sign Up**
   ```bash
   curl -X POST http://localhost:5001/auth/signup \
   -H "Content-Type: application/json" \
   -d '{"email": "test@example.com", "password": "password123"}'
   ```

2. **Sign In**
   ```bash
   curl -X POST http://localhost:5001/auth/signin \
   -H "Content-Type: application/json" \
   -d '{"email": "test@example.com", "password": "password123"}'
   ```

### **Post Service**
1. **Create Post**
   ```bash
   curl -X POST http://localhost:5002/post \
   -H "Authorization: Bearer <JWT_TOKEN>" \
   -F "title=My First Post" \
   -F "codeSnippet=console.log('Hello World');" \
   -F "file=@/path/to/file.txt"
   ```

2. **Get Posts**
   ```bash
   curl -X GET http://localhost:5002/post
   ```

### **Notification Service**
1. **Get Notifications**
   ```bash
   curl -X GET http://localhost:5003/notification
   ```

2. **Clear Notifications**
   ```bash
   curl -X DELETE http://localhost:5003/notification/clear
   ```

---

## Additional Notes
- Ensure MinIO is running if you're using it for file storage.
- If you encounter issues, check the logs for each service using:
  ```bash
  docker logs <container_name>
  ```

---

This README provides a complete overview of the microservices and how to set them up. Let me know if you have any questions or need further assistance!
