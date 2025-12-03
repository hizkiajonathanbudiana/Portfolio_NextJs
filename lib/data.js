import dbConnect from './mongodb';
import GlobalSettings from '../models/GlobalSettings';
import Project from '../models/Project';
import Resume from '../models/Resume';
import About from '../models/About';
import Contact from '../models/Contact';
import Home from '../models/Home';

import { cache } from 'react';


export async function getHomeData() {
    try {
        await dbConnect();

        // Debugging: Cek apakah model terload dengan benar
        if (!Home || typeof Home.findOne !== 'function') {
            throw new Error("MODEL_LOAD_ERROR: Home model failed to load.");
        }

        const home = await Home.findOne({}).lean();

        if (!home) return {};

        return {
            ...home,
            _id: home._id.toString()
        };
    } catch (error) {
        console.error("Fetch Home Error:", error);
        return {};
    }
}

export async function getContact() {
    try {
        await dbConnect();
        const contact = await Contact.findOne({}).lean();
        if (!contact) return {};
        // Serialisasi ID & Socials ID
        return {
            ...contact,
            _id: contact._id.toString(),
            socials: contact.socials ? contact.socials.map(s => ({ ...s, _id: s._id ? s._id.toString() : null })) : []
        };
    } catch (error) {
        console.error("Fetch Contact Error:", error);
        return {};
    }
}

export const getSettings = cache(async () => {
    await dbConnect();
    const settings = await GlobalSettings.findOne({}).lean();
    if (!settings) return { siteName: 'HIZKIA.WZ', navbarLinks: [] };
    return JSON.parse(JSON.stringify(settings));
});

export async function getResume() {
    try {
        await dbConnect();
        const resume = await Resume.findOne({}).lean();
        if (!resume) return {};

        // Serialize IDs deeply
        return {
            ...resume,
            _id: resume._id.toString(),
            downloads: resume.downloads?.map(d => ({ ...d, _id: d._id?.toString() })) || [],
            sections: resume.sections?.map(s => ({
                ...s,
                _id: s._id?.toString(),
                items: s.items?.map(i => ({ ...i, _id: i._id?.toString() })) || []
            })) || []
        };
    } catch (error) {
        console.error("Fetch Resume Error:", error);
        return {};
    }
}

export const getAbout = cache(async () => {
    await dbConnect();
    const about = await About.findOne({}).lean();

    if (!about) return {
        heroHeading: "HELLO, I'M<br/>HIZKIA WEIZE.",
        heroBio: "Bio not set.",
        profileImage: "https://placehold.co/800x1200",
        services: []
    };

    return JSON.parse(JSON.stringify(about));
});

export async function getProjectsData() {
    try {
        await dbConnect();
        const allDocs = await Project.find({}).sort({ createdAt: -1 }).lean();

        // Serialisasi ID biar Next.js gak rewel
        const sanitizedDocs = allDocs.map(doc => ({ ...doc, _id: doc._id.toString() }));

        const meta = sanitizedDocs.find(d => d.type === 'meta') || {};
        const items = sanitizedDocs.filter(d => d.type === 'item' || !d.type);

        return { meta, items };
    } catch (error) {
        console.error("Fetch Error:", error);
        return { meta: {}, items: [] };
    }
}