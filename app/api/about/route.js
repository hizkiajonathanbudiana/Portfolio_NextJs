import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from '../../../lib/mongodb';
import About from '../../../models/About';

export async function GET() {
    await dbConnect();
    const about = await About.findOne({});
    return NextResponse.json(about || {});
}

export async function POST(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "SHOWCASE MODE: Updates are simulated." }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await req.json();

        // Mongoose $set akan otomatis hanya mengupdate field yang dikirim di 'body'.
        // Jadi kalau body cuma { heroHeading: "Baru" }, field lain tidak akan terhapus.
        const about = await About.findOneAndUpdate(
            {},
            { $set: body },
            { upsert: true, new: true }
        );

        return NextResponse.json({ message: "About Page Updated", data: about });
    } catch (error) {
        console.error("SAVE ERROR:", error);
        return NextResponse.json({ message: "Error updating About page", error: error.message }, { status: 500 });
    }
}