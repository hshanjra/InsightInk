const mongoose = require('mongoose');

// Connection 
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(() => console.error("Connection Failed", err));

module.exports = { mongoose };