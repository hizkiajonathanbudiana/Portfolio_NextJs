import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from '../../../lib/mongodb';
import Home from '../../../models/Home';

export async function GET() {
    await dbConnect();
    const home = await Home.findOne({});
    return NextResponse.json(home || {});
}

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Auth Required" }, { status: 401 });

    try {
        await dbConnect();
        const body = await req.json();

        // Singleton: Selalu update dokumen pertama
        const updatedHome = await Home.findOneAndUpdate(
            {},
            { $set: body },
            { upsert: true, new: true }
        );

        return NextResponse.json({ message: "Home Config Saved", data: updatedHome });
    } catch (error) {
        return NextResponse.json({ message: "Save Error", error: error.message }, { status: 500 });
    }
}