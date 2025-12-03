import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
    // --- Header ---
    heading: String, // "LET'S START A PROJECT"

    // --- Section 1: Email ---
    section1Title: String,   // "[01] Drop a line"
    email: String,           // "email@example.com"
    availability: String,    // "Available for freelance..."

    // --- Section 2: Socials ---
    section2Title: String,   // "[02] On the web"
    socials: [{              // Array Sosmed khusus Contact page
        platform: String,    // "Instagram"
        url: String          // "https://..."
    }],

    // --- Section 3: Location ---
    section3Title: String,   // "[03] Local Time"
    timezone: String,        // "GMT+8"
    location: String,        // "TAIPEI, TAIWAN"

    // --- Footer Nav ---
    navPrevLabel: String,
    navPrevText: String,
    navNextLabel: String,
    navNextText: String,

}, { timestamps: true });

// Delete model cache untuk mencegah error overwrite saat dev
if (mongoose.models.Contact) {
    delete mongoose.models.Contact;
}

export default mongoose.model('Contact', ContactSchema);