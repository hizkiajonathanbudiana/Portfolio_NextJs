import mongoose from 'mongoose';

const ResumeItemSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    date: String,
    description: String,
});

const ResumeSectionSchema = new mongoose.Schema({
    type: { type: String, required: true },
    title: { type: String },
    items: [ResumeItemSchema],
    order: { type: Number, default: 0 },
});

const ResumeDownloadSchema = new mongoose.Schema({
    label: String,
    url: String,
    fileName: String
});

const ResumeSchema = new mongoose.Schema({
    // --- Header ---
    heading: String,      // "CURRICULUM VITAE"
    subHeading: String,   // "Hizkia Weize — Interaction Designer"

    // --- Content ---
    downloads: [ResumeDownloadSchema],
    sections: [ResumeSectionSchema],

    // --- Footer CTA ---
    footerTitle: { type: String }, // "LOOKING FOR FULL DETAILS?"
    footerText: { type: String },  // "Download the PDF version..."

    // --- Footer Nav ---
    navPrevLabel: String,
    navPrevText: String,
    navNextLabel: String,
    navNextText: String,

}, { timestamps: true });

// Prevent model overwrite error
if (mongoose.models.Resume) {
    delete mongoose.models.Resume;
}

export default mongoose.model('Resume', ResumeSchema);