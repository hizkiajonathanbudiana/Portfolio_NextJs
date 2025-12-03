import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from '../../../lib/mongodb';
import Project from '../../../models/Project';

// GET: Ambil List Project + Metadata Halaman
export async function GET() {
    await dbConnect();

    // Ambil semua data di collection 'projects'
    const allDocs = await Project.find({}).sort({ createdAt: -1 });

    // Pisahkan: Dokumen Metadata vs Dokumen Project Biasa
    // Metadata ditandai dengan field type: 'meta'
    const meta = allDocs.find(doc => doc.type === 'meta') || {};
    // Item project adalah sisanya (atau yang explisit type: 'item')
    const items = allDocs.filter(doc => doc.type === 'item' || !doc.type);

    return NextResponse.json({
        meta: meta,
        items: items
    });
}

// POST: Create New Project Item Only
export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Auth Required" }, { status: 401 });

    try {
        await dbConnect();
        const body = await req.json();

        // Paksa tipe jadi item
        body.type = 'item';

        // Auto Slug Logic
        if (!body.slug) {
            body.slug = body.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();
        }

        const newProject = await Project.create(body);
        return NextResponse.json({ message: "Project Created", data: newProject });
    } catch (error) {
        console.error("CREATE ERROR:", error);
        return NextResponse.json({ message: "Error Creating Project", error: error.message }, { status: 500 });
    }
}

// PUT: Handle Update Project ATAU Update Metadata Page
export async function PUT(req) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Auth Required" }, { status: 401 });

    try {
        await dbConnect();
        const body = await req.json();

        // LOGIC 1: Jika yang mau disave adalah METADATA (Header/Footer)
        if (body.type === 'meta') {
            const updatedMeta = await Project.findOneAndUpdate(
                { type: 'meta' }, // Cari dokumen tipe meta
                { $set: body },   // Update isinya
                { upsert: true, new: true } // Kalo gak ada, buat baru
            );
            return NextResponse.json({ message: "Page Config Saved", data: updatedMeta });
        }

        // LOGIC 2: Jika yang mau disave adalah PROJECT BIASA
        const { id, ...updateData } = body;
        if (!id) return NextResponse.json({ message: "Project ID Required" }, { status: 400 });

        const updatedProject = await Project.findByIdAndUpdate(id, { $set: updateData }, { new: true });
        return NextResponse.json({ message: "Project Updated", data: updatedProject });

    } catch (error) {
        console.error("UPDATE ERROR:", error);
        return NextResponse.json({ message: "Update Error", error: error.message }, { status: 500 });
    }
}

// DELETE: Hapus Project
export async function DELETE(req) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Auth Required" }, { status: 401 });

    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        await Project.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Delete Error" }, { status: 500 });
    }
}