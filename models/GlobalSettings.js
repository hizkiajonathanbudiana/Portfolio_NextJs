import mongoose from 'mongoose';

const GlobalSettingsSchema = new mongoose.Schema({
    siteName: {
        type: String,
        default: 'HIZKIA.WZ',
    },
    navbarLinks: [{
        label: String,
        path: String,
        isActive: { type: Boolean, default: true }
    }],
    maintenanceMode: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

export default mongoose.models.GlobalSettings || mongoose.model('GlobalSettings', GlobalSettingsSchema);