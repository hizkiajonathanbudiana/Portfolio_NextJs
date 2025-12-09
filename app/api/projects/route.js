import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "../../../lib/mongodb";
import Project from "../../../models/Project";

export async function GET() {
  await dbConnect();
  // Sort by order ASC, then createdAt DESC
  const allDocs = await Project.find({}).sort({ order: 1, createdAt: -1 });
  const meta = allDocs.find((doc) => doc.type === "meta") || {};
  const items = allDocs.filter((doc) => doc.type === "item" || !doc.type);
  return NextResponse.json({ meta, items });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "Auth Required" }, { status: 401 });

  try {
    await dbConnect();
    const body = await req.json();
    body.type = "item";
    if (body.order === undefined) body.order = 0;

    // Auto Slug
    if (!body.slug) {
      body.slug =
        body.title
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "") +
        "-" +
        Date.now();
    }

    console.log("CREATING PROJECT:", body); // Debug log

    const newProject = await Project.create(body);
    return NextResponse.json({ message: "Project Created", data: newProject });
  } catch (error) {
    console.error("CREATE ERROR:", error);
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "Auth Required" }, { status: 401 });

  try {
    await dbConnect();
    const body = await req.json();

    if (body.type === "meta") {
      const updatedMeta = await Project.findOneAndUpdate(
        { type: "meta" },
        { $set: body },
        { upsert: true, new: true }
      );
      return NextResponse.json({
        message: "Page Config Saved",
        data: updatedMeta,
      });
    }

    const { id, ...updateData } = body;
    if (!id)
      return NextResponse.json({ message: "ID Required" }, { status: 400 });

    console.log("UPDATING PROJECT:", id, updateData); // Debug log: Cek apakah 'media' dan 'links' ada isinya disini

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    return NextResponse.json({
      message: "Project Updated",
      data: updatedProject,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json(
      { message: "Update Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "Auth Required" }, { status: 401 });
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    await Project.findByIdAndDelete(searchParams.get("id"));
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
