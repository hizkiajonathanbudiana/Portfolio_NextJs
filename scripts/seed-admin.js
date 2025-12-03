const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// --- TAMBAHAN PENTING ---
// Load variables from .env.local
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('ERROR: MONGODB_URI is missing in .env.local');
    process.exit(1);
}

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    role: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seed() {
    try {
        console.log('Connecting to MongoDB Atlas (via ENV)...');

        // Connect pakai URI dari env
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        // Cek apakah admin sudah ada
        const existingUser = await User.findOne({ email: 'hizkia.weize@gmail.com' });
        if (existingUser) {
            console.log('Admin already exists. Database connection is PERFECT.');
            process.exit(0);
        }

        // Kalau belum ada, buat baru
        const hashedPassword = await bcrypt.hash('', 10);

        await User.create({
            email: 'hizkia.@gmail.com',
            password: hashedPassword,
            name: 'Hizkia Jonathan Budiana',
            role: 'admin'
        });

        console.log('Admin created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('SEED ERROR:', error);
        process.exit(1);
    }
}

seed();