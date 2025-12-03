const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' }); // Baca .env.local

const MONGODB_URI = process.env.MONGODB_URI;

// --- SCHEMA DEFINITIONS (Copy ringkas biar script standalone) ---
const pageContentSchema = new mongoose.Schema({
    page: { type: String, unique: true },
    heading: String, subHeading: String,
    cornerTopLeft: String, cornerTopRight: String,
    cornerBottomLeft: String, cornerBottomRight: String,
    scrollText: String, metaText: String, lastUpdated: String
}, { strict: false });

const projectSchema = new mongoose.Schema({
    title: String, slug: { type: String, unique: true },
    category: String, year: String, image: String, description: String
}, { strict: false });

const resumeSchema = new mongoose.Schema({
    bio: String, email: String, phone: String, socials: Array, sections: Array
}, { strict: false });

const PageContent = mongoose.models.PageContent || mongoose.model('PageContent', pageContentSchema);
const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
const Resume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);

async function seedHybrid() {
    if (!MONGODB_URI) {
        console.error("❌ MONGODB_URI missing in .env.local");
        process.exit(1);
    }

    try {
        console.log("🔌 Connecting to MongoDB Atlas...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected!");

        // 1. Baca File JSON
        const jsonPath = path.join(__dirname, '../data/seed.json'); // Relative path ke folder data
        const rawData = fs.readFileSync(jsonPath, 'utf8');
        const data = JSON.parse(rawData);
        console.log("📂 Loaded data/seed.json");

        // 2. Sync Page Content
        console.log("🔄 Syncing Page Content...");
        for (const page of data.pages) {
            await PageContent.updateOne(
                { page: page.page }, // Cari berdasarkan nama page
                { $set: page },      // Update fieldnya
                { upsert: true }     // Buat baru kalau belum ada
            );
        }

        // 3. Sync Resume (Cuma ada 1 resume global)
        console.log("🔄 Syncing Resume...");
        await Resume.updateOne({}, { $set: data.resume }, { upsert: true });

        // 4. Sync Projects
        console.log("🔄 Syncing Projects...");
        for (const project of data.projects) {
            await Project.updateOne(
                { slug: project.slug },
                { $set: project },
                { upsert: true }
            );
        }

        console.log("✨ HYBRID SYNC COMPLETE! Database is now identical to JSON.");
        process.exit(0);

    } catch (error) {
        console.error("❌ SEED ERROR:", error);
        process.exit(1);
    }
}

seedHybrid();