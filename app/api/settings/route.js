import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";

// GANTI IMPORT INI: Ambil authOptions, bukan handler
import { authOptions } from "../auth/[...nextauth]/route";

import dbConnect from '../../../lib/mongodb';
import GlobalSettings from '../../../models/GlobalSettings';

export async function POST(req) {
    // PASS authOptions KEDALAM SINI
    const session = await getServerSession(authOptions);

    // ... Logic di bawah ini sama persis ...

    // 2. Kalau GUEST (Gak login), Return 401 Unauthorized
    if (!session) {
        return NextResponse.json(
            { message: "SHOWCASE MODE: Changes are visually reverted. Login to save permanently." },
            { status: 401 }
        );
    }

    try {
        await dbConnect();
        const body = await req.json();

        const settings = await GlobalSettings.findOneAndUpdate(
            {},
            body,
            { upsert: true, new: true }
        );

        return NextResponse.json({ message: "Settings Saved Successfully", data: settings });
    } catch (error) {
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}

export async function GET() {
    await dbConnect();
    const settings = await GlobalSettings.findOne({});
    return NextResponse.json(settings || { siteName: "HIZKIA.WZ", navbarLinks: [] });
}