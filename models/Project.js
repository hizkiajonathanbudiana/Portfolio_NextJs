// models/Project.js
import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    // --- FIELD PENTING (INI YANG HILANG SEBELUMNYA) ---
    type: { type: String, default: 'item' },

    // --- Project Fields ---
    title: { type: String },
    slug: { type: String },
    category: { type: String },
    year: { type: String },
    image: { type: String },
    description: { type: String },
    order: { type: Number, default: 0 },

    // --- Meta/Page Fields ---
    heading: String,
    subHeading: String,
    metaText: String,
    navPrevLabel: String,
    navPrevText: String,
    navNextLabel: String,
    navNextText: String,

}, { timestamps: true });

// Delete model lama dari cache biar Next.js reload schema baru
if (mongoose.models.Project) {
    delete mongoose.models.Project;
}

export default mongoose.model('Project', ProjectSchema);