import mongoose from 'mongoose';

const HomeSchema = new mongoose.Schema({
    // --- TOP BAR ---
    cornerTopLeft: String,
    subHeading: String,
    cornerTopRight: String,

    // --- CENTER ---
    heading: String,
    scrollText: String,

    // --- BOTTOM BAR ---
    cornerBottomLeft: String,
    cornerBottomRight: String,

}, { timestamps: true });

// --- FIX UTAMA: SINGLETON PATTERN ---
// Cek dulu apakah model 'Home' sudah ada di cache mongoose?
// Kalau ada, PAKAI ITU. Kalau belum, BARU BUAT.
const Home = mongoose.models.Home || mongoose.model('Home', HomeSchema);

export default Home;