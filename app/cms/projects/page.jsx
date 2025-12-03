'use client';

import { useState, useEffect } from 'react';

export default function CMSProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false); // Tambahan state uploading

    // State untuk Metadata Halaman (Header/Nav)
    const [pageContent, setPageContent] = useState({
        heading: '', subHeading: '', metaText: '',
        navPrevLabel: '', navPrevText: '',
        navNextLabel: '', navNextText: ''
    });

    // State untuk Project Form
    const [formData, setFormData] = useState({
        title: '', category: '', year: '', image: '', description: ''
    });

    // --- LOAD DATA (FIX: CUMA 1 API CALL KE /api/projects) ---
    useEffect(() => {
        fetchProjectsData();
    }, []);

    const fetchProjectsData = async () => {
        try {
            // INI KUNCINYA: HANYA NEMBAK ROOT API
            const res = await fetch('/api/projects');

            if (!res.ok) throw new Error("Failed to fetch");

            const data = await res.json();

            // Backend mengembalikan { meta: {...}, items: [...] }
            setProjects(data.items || []);

            const meta = data.meta || {};
            setPageContent({
                heading: meta.heading || '',
                subHeading: meta.subHeading || '',
                metaText: meta.metaText || '',
                navPrevLabel: meta.navPrevLabel || '',
                navPrevText: meta.navPrevText || '',
                navNextLabel: meta.navNextLabel || '',
                navNextText: meta.navNextText || ''
            });

            setFetching(false);
        } catch (err) {
            console.error("LOAD ERROR:", err);
            setFetching(false);
        }
    };

    // --- SAVE HEADER & FOOTER (Metadata) ---
    const handleSaveMeta = async () => {
        setLoading(true); setMessage(null);
        try {
            // Kita kirim type: 'meta' ke endpoint UTAMA
            const payload = { ...pageContent, type: 'meta' };

            const res = await fetch('/api/projects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: "PAGE CONFIG SAVED" });
            } else {
                setMessage({ type: 'error', text: "SAVE FAILED" });
            }
        } catch (err) { setMessage({ type: 'error', text: "NETWORK ERROR" }); }
        setLoading(false);
        setTimeout(() => setMessage(null), 2000);
    };

    // --- SAVE PROJECT ITEM (Create/Update) ---
    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setMessage(null);

        const method = editingId ? 'PUT' : 'POST';
        // Kalau editing, masukin ID. Kalau new, type otomatis 'item' di backend.
        const payload = editingId ? { ...formData, id: editingId, type: 'item' } : formData;

        try {
            const res = await fetch('/api/projects', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: editingId ? "PROJECT UPDATED" : "PROJECT ADDED" });
                fetchProjectsData(); // Refresh data
                handleCancel();
            } else {
                const errData = await res.json();
                setMessage({ type: 'error', text: errData.message || "ERROR SAVING PROJECT" });
            }
        } catch (err) { setMessage({ type: 'error', text: "NETWORK ERROR" }); }
        setLoading(false);
        setTimeout(() => setMessage(null), 2000);
    };

    // --- DELETE PROJECT ---
    const handleDelete = async (id) => {
        if (!confirm("DELETE PROJECT?")) return;
        const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            setMessage({ type: 'success', text: "PROJECT DELETED" }); // Fix message type
            fetchProjectsData();
            setTimeout(() => setMessage(null), 2000);
        }
    };

    // --- UTILS (Upload Image, Edit, Cancel) ---
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const form = new FormData();
        form.append('file', file);
        form.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: form });
            const data = await res.json();
            if (data.secure_url) setFormData(prev => ({ ...prev, image: data.secure_url }));
        } catch (err) { alert("Upload Failed"); }
        setUploading(false);
    };

    const handleEdit = (p) => {
        setEditingId(p._id);
        setFormData({ title: p.title, category: p.category, year: p.year, image: p.image, description: p.description });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({ title: '', category: '', year: '', image: '', description: '' });
    };

    if (fetching) return <div className="p-12 text-center animate-pulse font-mono">LOADING SYSTEM...</div>;

    return (
        <div className="max-w-7xl pb-20">
            {/* STICKY HEADER */}
            <div className="flex justify-between items-end mb-8 border-b border-[#333] pb-4 sticky top-0 bg-[#0a0a0a] z-10 pt-4 shadow-lg shadow-black/50">
                <h1 className="text-3xl font-bold">PROJECTS_EDITOR</h1>
                {message && <span className={`text-xs font-mono animate-pulse ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>{message.text}</span>}
                <div className="text-xs text-gray-500 font-mono">ENTRIES: {projects.length}</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT: SETTINGS & FORM */}
                <div className="lg:col-span-5 space-y-8">

                    {/* 1. PAGE METADATA EDITOR */}
                    <div className="bg-[#111] p-6 border border-[#333]">
                        <div className="flex justify-between items-center mb-4 border-b border-[#333] pb-2">
                            <h2 className="text-gray-400 font-bold uppercase text-xs">01. Page Configuration</h2>
                            <button onClick={handleSaveMeta} disabled={loading} className="text-[10px] font-bold text-green-500 border border-green-900 bg-green-900/10 px-2 hover:bg-green-900/30">SAVE CONFIG</button>
                        </div>
                        <div className="space-y-3">
                            <input value={pageContent.heading} onChange={e => setPageContent({ ...pageContent, heading: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white font-mono text-lg" placeholder="Main Heading" />
                            <input value={pageContent.subHeading} onChange={e => setPageContent({ ...pageContent, subHeading: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-xs text-white" placeholder="Sub Heading" />
                            <input value={pageContent.metaText} onChange={e => setPageContent({ ...pageContent, metaText: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-xs text-white" placeholder="Meta Text" />

                            <div className="pt-2 border-t border-[#333/50]">
                                <label className="text-[10px] text-gray-500 block mb-2">FOOTER NAV</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input value={pageContent.navPrevLabel} onChange={e => setPageContent({ ...pageContent, navPrevLabel: e.target.value })} className="bg-black border border-[#333] p-2 text-[10px] text-white" placeholder="Prev Label" />
                                    <input value={pageContent.navPrevText} onChange={e => setPageContent({ ...pageContent, navPrevText: e.target.value })} className="bg-black border border-[#333] p-2 text-[10px] text-white" placeholder="Prev Link" />
                                    <input value={pageContent.navNextLabel} onChange={e => setPageContent({ ...pageContent, navNextLabel: e.target.value })} className="bg-black border border-[#333] p-2 text-[10px] text-white" placeholder="Next Label" />
                                    <input value={pageContent.navNextText} onChange={e => setPageContent({ ...pageContent, navNextText: e.target.value })} className="bg-black border border-[#333] p-2 text-[10px] text-white" placeholder="Next Link" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. PROJECT FORM */}
                    <div className="bg-[#111] p-6 border border-[#333] sticky top-24">
                        <h2 className="text-xs font-bold mb-4 text-gray-400 border-b border-[#333] pb-2 uppercase">
                            {editingId ? '>> EDIT ENTRY' : '02. NEW ENTRY'}
                        </h2>
                        <form onSubmit={handleProjectSubmit} className="space-y-4">
                            <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white font-mono text-sm" placeholder="Title" />
                            <div className="grid grid-cols-2 gap-2">
                                <input required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="bg-black border border-[#333] p-2 text-white text-xs" placeholder="Category" />
                                <input required value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className="bg-black border border-[#333] p-2 text-white text-xs" placeholder="Year" />
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-500 block mb-1">IMAGE</label>
                                <input type="file" onChange={handleImageUpload} disabled={uploading} className="w-full text-[10px] text-gray-500" />
                                {uploading && <p className="text-[10px] text-yellow-500 animate-pulse">UPLOADING...</p>}
                                {formData.image && <img src={formData.image} className="h-20 w-auto object-cover border border-[#333] mt-2" />}
                            </div>

                            <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white text-xs resize-none" placeholder="Description" />

                            <div className="flex gap-2">
                                {editingId && <button type="button" onClick={handleCancel} className="flex-1 py-2 border border-[#333] text-gray-500 text-xs">CANCEL</button>}
                                <button type="submit" disabled={loading || uploading} className="flex-1 py-2 bg-white text-black text-xs font-bold hover:bg-gray-200">
                                    {loading ? 'SAVING...' : (editingId ? 'UPDATE' : 'PUBLISH')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT: LIST */}
                <div className="lg:col-span-7">
                    <h2 className="text-xs font-bold mb-4 text-gray-400 border-b border-[#333] pb-2 uppercase">DATABASE ENTRIES</h2>
                    <div className="space-y-2">
                        {projects.map((p) => (
                            <div key={p._id} className={`p-4 bg-[#111] border ${editingId === p._id ? 'border-green-500' : 'border-[#333] hover:border-white'} flex justify-between`}>
                                <div>
                                    <h3 className="font-bold text-sm">{p.title}</h3>
                                    <p className="text-[10px] text-gray-500">{p.category} // {p.year}</p>
                                </div>
                                <div className="flex gap-2 items-start">
                                    <button onClick={() => handleEdit(p)} className="text-[10px] text-blue-500 px-2 border border-blue-900 bg-blue-900/10">EDIT</button>
                                    <button onClick={() => handleDelete(p._id)} className="text-[10px] text-red-500 px-2 border border-red-900 bg-red-900/10">DEL</button>
                                </div>
                            </div>
                        ))}
                        {projects.length === 0 && <div className="text-center py-12 text-gray-600 text-xs font-mono">NO PROJECTS FOUND. ADD ONE ON THE LEFT.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}