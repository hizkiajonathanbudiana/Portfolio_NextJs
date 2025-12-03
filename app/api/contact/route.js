import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from '../../../lib/mongodb';
import Contact from '../../../models/Contact';

export async function GET() {
    await dbConnect();
    const contact = await Contact.findOne({});
    // Return object kosong jika belum ada data biar frontend gak error
    return NextResponse.json(contact || {});
}

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Auth Required" }, { status: 401 });

    try {
        await dbConnect();
        const body = await req.json();

        // Singleton Pattern: Selalu update dokumen pertama, atau buat jika belum ada
        const updatedContact = await Contact.findOneAndUpdate(
            {},
            { $set: body },
            { upsert: true, new: true }
        );

        return NextResponse.json({ message: "Contact Page Saved", data: updatedContact });
    } catch (error) {
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    }
}