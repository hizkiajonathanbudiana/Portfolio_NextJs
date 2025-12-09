import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    type: { type: String, default: "item" },

    title: { type: String },
    slug: { type: String },
    category: { type: String },
    year: { type: String },
    description: { type: String },
    image: { type: String }, // Legacy

    order: { type: Number, default: 0 },

    // FIX: Field 'type' di dalam array harus didefinisikan dengan hati-hati
    media: [
      {
        _id: false,
        url: { type: String },
        type: { type: String }, // 'image' or 'video'
      },
    ],

    links: [
      {
        _id: false,
        text: { type: String },
        url: { type: String },
      },
    ],

    // Meta Fields
    heading: String,
    subHeading: String,
    metaText: String,
    navPrevLabel: String,
    navPrevText: String,
    navNextLabel: String,
    navNextText: String,
  },
  {
    timestamps: true,
    strict: false, // Penting biar data masuk walaupun schema belum sempurna
  }
);

// HACK UNTUK NEXT.JS:
// Delete model lama dari cache Mongoose biar schema baru terbaca
if (mongoose.models && mongoose.models.Project) {
  delete mongoose.models.Project;
}

const Project = mongoose.model("Project", ProjectSchema);

export default Project;
