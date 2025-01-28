// config/minioConfig.js
const Minio = require('minio');
require('dotenv').config();  // Ensure .env variables are loaded

// Console log to verify values
console.log("MinIO Endpoint:", process.env.MINIO_ENDPOINT);
console.log("MinIO Port:", process.env.MINIO_PORT);
console.log("bucket:", process.env.MINIO_BUCKET);


const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,   // Use localhost or MinIO server IP
    port: parseInt(process.env.MINIO_PORT, 10),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
});

module.exports = minioClient;
