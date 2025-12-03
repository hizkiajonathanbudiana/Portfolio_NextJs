import mongoose from 'mongoose';

// Schema untuk List Services
const ServiceItemSchema = new mongoose.Schema({
    title: String,      // "Art Direction"
    description: String // "Defining visual languages..."
});

const AboutSchema = new mongoose.Schema({
    // HERO SECTION
    heroHeading: { type: String },       // "HELLO, I'M<br/>HIZKIA WEIZE."
    heroBio: { type: String },           // "I am an Interaction Designer..."

    // PROFILE IMAGE
    profileImage: { type: String },      // URL dari Cloudinary
    imageCaption: { type: String },      // "Taipei, 2025"

    // STATUS
    statusLabel: { type: String },       // "CURRENT STATUS"
    statusText: { type: String },        // "OPEN FOR COLLABORATION"

    // SERVICES SECTION
    servicesTitle: { type: String },     // "[01] What I Do"
    servicesDescription: { type: String }, // "I help brands..."
    services: [ServiceItemSchema],       // Array of services

    // FOOTER NAVIGATION
    navPrevLabel: { type: String },
    navPrevText: { type: String },
    navNextLabel: { type: String },
    navNextText: { type: String },

}, { timestamps: true });

export default mongoose.models.About || mongoose.model('About', AboutSchema);