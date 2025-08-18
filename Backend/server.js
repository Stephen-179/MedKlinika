// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('MedKlinika API is running');
});

// Get PORT from .env or fallback
const PORT = process.env.PORT || 5000;

// Debug check if MONGO_URI is loading correctly
if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not defined in .env');
    process.exit(1); // Stop the server if missing
}

// Connect to MongoDB, then start the server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
    });
