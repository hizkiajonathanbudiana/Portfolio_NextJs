import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
// Import semua model
import Home from '../../../models/Home';
import About from '../../../models/About';
import Contact from '../../../models/Contact';
import Resume from '../../../models/Resume';
import Project from '../../../models/Project';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();

        // Ambil semua data
        const [home, about, contact, resume, projects] = await Promise.all([
            Home.findOne({}).lean(),
            About.findOne({}).lean(),
            Contact.findOne({}).lean(),
            Resume.findOne({}).lean(),
            Project.find({}).sort({ createdAt: -1 }).lean()
        ]);

        // Bungkus jadi satu object backup
        const backupData = {
            timestamp: new Date().toISOString(),
            data: {
                home: home || {},
                about: about || {},
                contact: contact || {},
                resume: resume || {},
                projects: projects || []
            }
        };

        return NextResponse.json(backupData);
    } catch (error) {
        return NextResponse.json({ message: "Backup Failed", error: error.message }, { status: 500 });
    }
}