import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from '../../../lib/mongodb';
import Resume from '../../../models/Resume';

// Ensure dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        const resume = await Resume.findOne({});
        // Return empty object if null to prevent frontend errors
        return NextResponse.json(resume || {});
    } catch (error) {
        return NextResponse.json({ message: "DB Error", error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();

        // Parse body. Since we might send Base64 files, check size first.
        const text = await req.text();
        const payloadSizeMB = text.length / 1024 / 1024;

        console.log(`📥 Resume Payload: ${payloadSizeMB.toFixed(2)} MB`);

        if (payloadSizeMB > 9) {
            return NextResponse.json({ message: "FILE TOO LARGE. Max 9MB payload." }, { status: 413 });
        }

        const body = JSON.parse(text);

        // Update the single resume document
        const updatedResume = await Resume.findOneAndUpdate(
            {},
            { $set: body },
            { upsert: true, new: true }
        );

        return NextResponse.json({ message: "Resume Updated", data: updatedResume });

    } catch (error) {
        console.error("RESUME SAVE ERROR:", error);
        return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
    }
}