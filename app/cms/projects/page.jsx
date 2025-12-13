"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function CMSProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  // State untuk Metadata Halaman
  const [pageContent, setPageContent] = useState({
    heading: "",
    subHeading: "",
    metaText: "",
    navPrevLabel: "",
    navPrevText: "",
    navNextLabel: "",
    navNextText: "",
  });

  // State Form Project
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    year: "",
    description: "",
  });

  // New States for Multiple Items
  const [mediaItems, setMediaItems] = useState([]); // Array of { url, type }
  const [linkItems, setLinkItems] = useState([]); // Array of { text, url }

  // State untuk Input URL Manual
  const [urlInput, setUrlInput] = useState("");
  const [urlType, setUrlType] = useState("image"); // 'image' or 'video'

  // Drag & Drop State
  const dragItem = useRef();
  const dragOverItem = useRef();
  const fileInputRef = useRef(null);

  // --- LOAD DATA ---
  useEffect(() => {
    fetchProjectsData();
  }, []);

  const fetchProjectsData = async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const sortedProjects = (data.items || []).sort(
        (a, b) => (a.order ?? 999) - (b.order ?? 999)
      );
      setProjects(sortedProjects);
      const meta = data.meta || {};
      setPageContent({
        heading: meta.heading || "",
        subHeading: meta.subHeading || "",
        metaText: meta.metaText || "",
        navPrevLabel: meta.navPrevLabel || "",
        navPrevText: meta.navPrevText || "",
        navNextLabel: meta.navNextLabel || "",
        navNextText: meta.navNextText || "",
      });
      setFetching(false);
    } catch (err) {
      console.error(err);
      setFetching(false);
    }
  };

  // --- SAVE HANDLERS ---
  const handleSaveMeta = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const payload = { ...pageContent, type: "meta" };
      const res = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) setMessage({ type: "success", text: "PAGE CONFIG SAVED" });
      else setMessage({ type: "error", text: "SAVE FAILED" });
    } catch (err) {
      setMessage({ type: "error", text: "NETWORK ERROR" });
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 2000);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const cleanMedia = mediaItems.map(({ _id, ...rest }) => rest);
    const cleanLinks = linkItems.map(({ _id, ...rest }) => rest);

    const payloadData = {
      ...formData,
      media: cleanMedia,
      links: cleanLinks,
      order: editingId
        ? projects.find((p) => p._id === editingId)?.order ?? 0
        : 0,
    };

    const method = editingId ? "PUT" : "POST";
    const payload = editingId
      ? { ...payloadData, id: editingId, type: "item" }
      : { ...payloadData, type: "item" };

    try {
      const res = await fetch("/api/projects", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage({
          type: "success",
          text: editingId ? "PROJECT UPDATED" : "PROJECT ADDED",
        });
        fetchProjectsData();
        handleCancel();
      } else {
        setMessage({ type: "error", text: "ERROR SAVING PROJECT" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "NETWORK ERROR" });
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 2000);
  };

  // --- MEDIA HANDLERS ---
  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    const newMedia = [];
    for (const file of files) {
      const form = new FormData();
      form.append("file", file);
      form.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );
      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
          { method: "POST", body: form }
        );
        const data = await res.json();
        if (data.secure_url) {
          newMedia.push({
            url: data.secure_url,
            type: data.resource_type,
          });
        }
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
    setMediaItems((prev) => [...prev, ...newMedia]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ADD MEDIA BY URL (NEW FUNCTION)
  const addMediaByUrl = () => {
    if (!urlInput.trim()) return;

    // Simple Google Drive ID Extractor (Optional helper)
    let finalUrl = urlInput;
    // Auto-convert GDrive link jadi preview link
    const gdriveRegex = /\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = finalUrl.match(gdriveRegex);
    if (match && match[1]) {
       // Convert view link to preview link (best for video embedding)
       finalUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
    }

    setMediaItems((prev) => [...prev, { url: finalUrl, type: urlType }]);
    setUrlInput(""); // Reset input
  };

  const moveMedia = (index, direction) => {
    const newItems = [...mediaItems];
    if (direction === "up" && index > 0) {
      [newItems[index], newItems[index - 1]] = [
        newItems[index - 1],
        newItems[index],
      ];
    } else if (direction === "down" && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [
        newItems[index + 1],
        newItems[index],
      ];
    }
    setMediaItems(newItems);
  };

  const removeMedia = (index) => {
    setMediaItems((prev) => prev.filter((_, i) => i !== index));
  };

  // --- LINK & DRAG HANDLERS ---
  const addLink = () => {
    setLinkItems([...linkItems, { text: "View Project", url: "" }]);
  };
  const updateLink = (index, field, value) => {
    const newLinks = [...linkItems];
    newLinks[index][field] = value;
    setLinkItems(newLinks);
  };
  const moveLink = (index, direction) => {
    const newLinks = [...linkItems];
    if (direction === "up" && index > 0) {
      [newLinks[index], newLinks[index - 1]] = [
        newLinks[index - 1],
        newLinks[index],
      ];
    } else if (direction === "down" && index < newLinks.length - 1) {
      [newLinks[index], newLinks[index + 1]] = [
        newLinks[index + 1],
        newLinks[index],
      ];
    }
    setLinkItems(newLinks);
  };
  const removeLink = (index) => {
    setLinkItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };
  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };
  const handleDragEnd = async () => {
    const copyList = [...projects];
    const dragItemContent = copyList[dragItem.current];
    copyList.splice(dragItem.current, 1);
    copyList.splice(dragOverItem.current, 0, dragItemContent);
    const updatedList = copyList.map((item, index) => ({
      ...item,
      order: index,
    }));
    setProjects(updatedList);
    dragItem.current = null;
    dragOverItem.current = null;
    await saveReorder(updatedList);
  };
  const saveReorder = async (newList) => {
    setMessage({ type: "success", text: "SAVING ORDER..." });
    try {
      const updates = newList.map((p) => ({
        id: p._id,
        order: p.order,
        type: "reorder_field_only",
      }));
    } catch (e) {
      console.log(e);
    }
    setTimeout(() => setMessage(null), 1000);
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setFormData({
      title: p.title,
      category: p.category,
      year: p.year,
      description: p.description,
    });
    if (p.media && p.media.length > 0) setMediaItems(p.media);
    else if (p.image) setMediaItems([{ url: p.image, type: "image" }]);
    else setMediaItems([]);
    setLinkItems(p.links || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleDelete = async (id) => {
    if (!confirm("DELETE PROJECT?")) return;
    const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setMessage({ type: "success", text: "PROJECT DELETED" });
      fetchProjectsData();
    }
  };
  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: "", category: "", year: "", description: "" });
    setMediaItems([]);
    setLinkItems([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (fetching)
    return (
      <div className="p-12 text-center animate-pulse font-mono text-xs">
        INITIALIZING SYSTEM...
      </div>
    );

  return (
    <div className="max-w-7xl pb-40">
      {/* HEADER */}
      <div className="flex justify-between items-end mb-8 border-b border-[#333] pb-4 sticky top-0 bg-[#0a0a0a] z-50 pt-4 shadow-2xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">
            PROJECTS_MANAGER_V2
          </h1>
          <p className="text-[10px] text-gray-500 font-mono mt-1">
            DRAG PROJECTS TO REORDER • MULTI MEDIA SUPPORT
          </p>
        </div>
        <div className="text-right">
          {message && (
            <span
              className={`block text-xs font-mono font-bold mb-1 ${
                message.type === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {message.text}
            </span>
          )}
          <div className="text-xs text-gray-500 font-mono">
            ENTRIES: {projects.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: EDITORS */}
        <div className="lg:col-span-5 space-y-8">
          {/* 1. PAGE CONFIG */}
          <div className="bg-[#111] p-5 border border-[#333]">
            <div className="flex justify-between items-center mb-4 border-b border-[#333] pb-2">
              <h2 className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                01. Page Meta
              </h2>
              <button
                onClick={handleSaveMeta}
                disabled={loading}
                className="text-[10px] font-bold text-green-400 hover:text-green-300"
              >
                SAVE CONFIG
              </button>
            </div>
            <div className="space-y-3">
              <input
                value={pageContent.heading}
                onChange={(e) =>
                  setPageContent({ ...pageContent, heading: e.target.value })
                }
                className="w-full bg-black border border-[#333] p-2 text-white font-mono text-sm"
                placeholder="Main Heading (HTML allowed)"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={pageContent.subHeading}
                  onChange={(e) =>
                    setPageContent({
                      ...pageContent,
                      subHeading: e.target.value,
                    })
                  }
                  className="bg-black border border-[#333] p-2 text-[10px] text-white"
                  placeholder="Sub Heading"
                />
                <input
                  value={pageContent.metaText}
                  onChange={(e) =>
                    setPageContent({ ...pageContent, metaText: e.target.value })
                  }
                  className="bg-black border border-[#333] p-2 text-[10px] text-white"
                  placeholder="Meta Text"
                />
              </div>
            </div>
          </div>

          {/* 2. PROJECT EDITOR */}
          <div className="bg-[#111] p-5 border border-[#333] sticky top-24 ring-1 ring-white/5">
            <h2 className="text-[10px] font-bold mb-4 text-green-500 border-b border-[#333] pb-2 uppercase tracking-widest flex justify-between">
              <span>
                {editingId
                  ? `>> EDITING ID: ${editingId.slice(-4)}`
                  : "02. NEW ENTRY"}
              </span>
              {editingId && (
                <button
                  onClick={handleCancel}
                  className="text-red-500 hover:text-red-400"
                >
                  CANCEL
                </button>
              )}
            </h2>

            <form onSubmit={handleProjectSubmit} className="space-y-5">
              {/* Basic Info */}
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase">
                  Basic Info
                </label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-black border border-[#333] p-2 text-white font-bold text-sm"
                  placeholder="Project Title"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="bg-black border border-[#333] p-2 text-white text-xs"
                    placeholder="Category"
                  />
                  <input
                    required
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    className="bg-black border border-[#333] p-2 text-white text-xs"
                    placeholder="Year"
                  />
                </div>
              </div>

              {/* Media Manager (UPDATED: URL + UPLOAD) */}
              <div className="space-y-2 border-t border-[#333] pt-4">
                <label className="text-[10px] text-gray-500 uppercase flex justify-between">
                  <span>Media Manager</span>
                  <span className="text-[9px] text-gray-600">
                    Supports: Images & Videos
                  </span>
                </label>

                {/* A. ADD BY URL */}
                <div className="flex gap-2 mb-2 bg-[#1a1a1a] p-2 border border-[#333]">
                  <select
                    value={urlType}
                    onChange={(e) => setUrlType(e.target.value)}
                    className="bg-black text-white text-[10px] border border-[#333] p-1 w-16"
                  >
                    <option value="image">IMG</option>
                    <option value="video">VID</option>
                  </select>
                  <input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste URL (Google Drive / Direct Link)"
                    className="flex-1 bg-black border border-[#333] p-1 text-[10px] text-white"
                  />
                  <button
                    type="button"
                    onClick={addMediaByUrl}
                    className="bg-blue-900/30 border border-blue-900 text-blue-400 text-[10px] px-2 hover:bg-blue-900/50"
                  >
                    ADD
                  </button>
                </div>

                {/* B. UPLOAD BUTTON */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] text-gray-600">
                    OR UPLOAD FILES:
                  </span>
                  <label className="cursor-pointer text-[10px] bg-[#222] hover:bg-[#333] px-2 py-1 border border-[#444] text-white transition-colors">
                    + UPLOAD LOCAL FILES
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleMediaUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploading && (
                  <div className="text-[10px] text-yellow-500 animate-pulse">
                    UPLOADING MEDIA... (Please Wait)
                  </div>
                )}

                {/* C. MEDIA LIST (DRAGGABLE/ORDERABLE) */}
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                  {mediaItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-2 bg-black p-2 border border-[#333] items-center group"
                    >
                      <div className="w-12 h-12 bg-[#222] shrink-0 relative overflow-hidden border border-white/10">
                        {item.type === "video" ? (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-500 bg-black">
                            VID
                          </div>
                        ) : (
                          <Image
                            src={item.url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://placehold.co/50x50?text=Err";
                            }} // Fallback visual
                          />
                        )}
                        <span className="absolute bottom-0 right-0 bg-blue-600 text-[8px] px-1 text-white uppercase">
                          {item.type === "video" ? "VID" : "IMG"}
                        </span>
                      </div>
                      <div className="flex-1 truncate text-[10px] text-gray-600 font-mono">
                        {item.url.slice(0, 30)}...
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => moveMedia(idx, "up")}
                          disabled={idx === 0}
                          className="text-[8px] px-1 bg-[#222] hover:bg-[#444] disabled:opacity-20"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveMedia(idx, "down")}
                          disabled={idx === mediaItems.length - 1}
                          className="text-[8px] px-1 bg-[#222] hover:bg-[#444] disabled:opacity-20"
                        >
                          ▼
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedia(idx)}
                        className="text-[10px] text-red-500 px-2 hover:bg-red-900/20"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {mediaItems.length === 0 && (
                    <div className="text-[10px] text-gray-700 italic text-center py-2 border border-dashed border-[#333]">
                      No media added.
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-black border border-[#333] p-2 text-white text-xs font-mono"
                placeholder="Project Description..."
              />

              {/* Links Manager */}
              <div className="space-y-2 border-t border-[#333] pt-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-gray-500 uppercase">
                    External Links
                  </label>
                  <button
                    type="button"
                    onClick={addLink}
                    className="text-[10px] bg-[#222] hover:bg-[#333] px-2 py-1 border border-[#444] text-white"
                  >
                    + ADD LINK
                  </button>
                </div>
                <div className="space-y-2">
                  {linkItems.map((link, idx) => (
                    <div
                      key={idx}
                      className="flex gap-2 items-center bg-black p-1 border border-[#333]"
                    >
                      <div className="flex flex-col gap-px">
                        <button
                          type="button"
                          onClick={() => moveLink(idx, "up")}
                          disabled={idx === 0}
                          className="text-[8px] leading-3 px-1 bg-[#222] hover:bg-[#444] disabled:opacity-20"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveLink(idx, "down")}
                          disabled={idx === linkItems.length - 1}
                          className="text-[8px] leading-3 px-1 bg-[#222] hover:bg-[#444] disabled:opacity-20"
                        >
                          ▼
                        </button>
                      </div>
                      <input
                        value={link.text}
                        onChange={(e) =>
                          updateLink(idx, "text", e.target.value)
                        }
                        className="w-1/3 bg-transparent border-r border-[#333] p-1 text-[10px] text-white"
                        placeholder="Button Text"
                      />
                      <input
                        value={link.url}
                        onChange={(e) => updateLink(idx, "url", e.target.value)}
                        className="flex-1 bg-transparent p-1 text-[10px] text-blue-400"
                        placeholder="https://..."
                      />
                      <button
                        type="button"
                        onClick={() => removeLink(idx)}
                        className="text-red-500 text-xs px-2 hover:bg-red-900/20"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || uploading}
                className="w-full py-3 bg-white text-black text-xs font-bold hover:bg-gray-200 tracking-widest mt-4"
              >
                {loading
                  ? "SAVING..."
                  : editingId
                  ? "UPDATE PROJECT"
                  : "PUBLISH PROJECT"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: DRAGGABLE LIST */}
        <div className="lg:col-span-7">
          <h2 className="text-[10px] font-bold mb-4 text-gray-400 border-b border-[#333] pb-2 uppercase tracking-widest">
            DATABASE ENTRIES (DRAG TO REORDER)
          </h2>
          <div className="space-y-1">
            {projects.map((p, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={`group relative p-4 bg-[#111] border transition-all cursor-move flex justify-between items-start select-none ${
                  editingId === p._id
                    ? "border-green-500 bg-green-900/5"
                    : "border-[#333] hover:border-gray-500"
                }`}
              >
                <div className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-700 opacity-0 group-hover:opacity-100">
                  ⋮⋮
                </div>
                <div className="pl-4">
                  <h3 className="font-bold text-sm text-white">{p.title}</h3>
                  <div className="flex gap-2 text-[10px] text-gray-500 font-mono mt-1">
                    <span>{p.category}</span>
                    <span>{`//`}</span>
                    <span>{p.year}</span>
                    <span>{`//`}</span>
                    <span>{(p.media || []).length} Media</span>
                  </div>
                </div>
                <div className="flex gap-2 items-start z-10 pl-4">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-[10px] text-blue-400 hover:text-white px-3 py-1 border border-blue-900/50 bg-blue-900/10"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-[10px] text-red-500 hover:text-white px-3 py-1 border border-red-900/50 bg-red-900/10"
                  >
                    DEL
                  </button>
                </div>
              </div>
            ))}
          </div>
          {projects.length === 0 && (
            <div className="text-center py-20 text-gray-700 text-xs font-mono border border-dashed border-[#333]">
              DATABASE EMPTY
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
