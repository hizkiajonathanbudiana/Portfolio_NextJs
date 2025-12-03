'use client';

import { useState, useEffect } from 'react';

export default function CMSResume() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState(null);

    // Consolidated State
    const [data, setData] = useState({
        // Header
        heading: '', subHeading: '',
        // Content
        downloads: [],
        sections: [],
        // Footer CTA
        footerTitle: '', footerText: '',
        // Footer Nav
        navPrevLabel: '', navPrevText: '',
        navNextLabel: '', navNextText: ''
    });

    // LOAD DATA
    useEffect(() => {
        fetch('/api/resume')
            .then(res => res.json())
            .then(resData => {
                // Merge with default structure to avoid undefined errors
                setData({
                    heading: resData.heading || '',
                    subHeading: resData.subHeading || '',
                    downloads: resData.downloads || [],
                    sections: resData.sections || [],
                    footerTitle: resData.footerTitle || '',
                    footerText: resData.footerText || '',
                    navPrevLabel: resData.navPrevLabel || '',
                    navPrevText: resData.navPrevText || '',
                    navNextLabel: resData.navNextLabel || '',
                    navNextText: resData.navNextText || ''
                });
                setFetching(false);
            })
            .catch(err => setFetching(false));
    }, []);

    // --- SAVE HANDLER (Scoped for performance) ---
    // scope: 'header', 'downloads', 'sections', 'footer', 'nav', 'all'
    const handleSave = async (scope) => {
        setLoading(true); setMessage(null);

        let payload = {};

        // Build Payload based on scope
        if (scope === 'all' || scope === 'header') {
            payload = { ...payload, heading: data.heading, subHeading: data.subHeading };
        }
        if (scope === 'all' || scope === 'downloads') {
            payload = { ...payload, downloads: data.downloads };
        }
        if (scope === 'all' || scope === 'sections') {
            payload = { ...payload, sections: data.sections };
        }
        if (scope === 'all' || scope === 'footer') {
            payload = { ...payload, footerTitle: data.footerTitle, footerText: data.footerText };
        }
        if (scope === 'all' || scope === 'nav') {
            payload = {
                ...payload,
                navPrevLabel: data.navPrevLabel, navPrevText: data.navPrevText,
                navNextLabel: data.navNextLabel, navNextText: data.navNextText
            };
        }

        try {
            const res = await fetch('/api/resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: `SAVED: ${scope.toUpperCase()}` });
                setTimeout(() => setMessage(null), 2000);
            } else {
                setMessage({ type: 'error', text: "SAVE FAILED" });
            }
        } catch (err) { setMessage({ type: 'error', text: "NETWORK ERROR" }); }
        setLoading(false);
    };

    // --- HELPERS (Sections, Items, Downloads) ---
    const addItemToType = (type, defaultTitle) => {
        const newSections = [...data.sections];
        let index = newSections.findIndex(s => s.type === type);
        if (index === -1) {
            newSections.push({ type, title: defaultTitle, items: [] });
            index = newSections.length - 1;
        }
        newSections[index].items.push({
            title: type === 'Languages' ? 'Language Name' : 'New Title',
            subtitle: type === 'Languages' ? 'Level' : 'Subtitle',
            date: type === 'Languages' || type === 'Skills' ? '' : '2025',
            description: ''
        });
        setData({ ...data, sections: newSections });
    };

    const updateItemInType = (type, itemIndex, field, value) => {
        const newSections = [...data.sections];
        const sectionIndex = newSections.findIndex(s => s.type === type);
        if (sectionIndex === -1) return;
        newSections[sectionIndex].items[itemIndex][field] = value;
        setData({ ...data, sections: newSections });
    };

    const removeItemInType = (type, itemIndex) => {
        const newSections = [...data.sections];
        const sectionIndex = newSections.findIndex(s => s.type === type);
        if (sectionIndex === -1) return;
        newSections[sectionIndex].items.splice(itemIndex, 1);
        setData({ ...data, sections: newSections });
    };

    const handleFileUpload = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 4 * 1024 * 1024) { alert("Max 4MB"); return; }
        const reader = new FileReader();
        reader.onloadend = () => {
            const newDownloads = [...data.downloads];
            newDownloads[index].url = reader.result;
            setData({ ...data, downloads: newDownloads });
        };
        reader.readAsDataURL(file);
    };
    const addDownload = () => setData(p => ({ ...p, downloads: [...p.downloads, { label: 'Download PDF', url: '' }] }));
    const removeDownload = (i) => {
        const n = [...data.downloads]; n.splice(i, 1);
        setData({ ...data, downloads: n });
    };
    const updateDownload = (i, f, v) => {
        const n = [...data.downloads]; n[i][f] = v;
        setData({ ...data, downloads: n });
    };


    // --- RENDER SECTION EDITOR ---
    const renderSectionEditor = (type, titleLabel) => {
        const section = data.sections.find(s => s.type === type);
        const items = section ? section.items : [];

        return (
            <div className="bg-[#111] p-6 mb-8 border border-[#333]">
                <div className="flex justify-between items-center mb-4 border-b border-[#333] pb-2">
                    <h2 className="text-gray-400 font-bold uppercase text-sm">{titleLabel}</h2>
                    <div className="flex gap-4">
                        <button onClick={() => addItemToType(type, titleLabel)} className="text-xs text-white hover:underline">+ ADD ITEM</button>
                        <button onClick={() => handleSave('sections')} className="text-xs font-bold text-green-500 border border-green-900 bg-green-900/10 px-2 hover:bg-green-900/30">SAVE SECTION</button>
                    </div>
                </div>
                <div className="space-y-4">
                    {items.map((item, idx) => (
                        <div key={idx} className="bg-black/50 p-4 border border-[#333] grid grid-cols-1 gap-2">
                            <div className="flex justify-between gap-4">
                                <input value={item.title} onChange={(e) => updateItemInType(type, idx, 'title', e.target.value)} className="bg-transparent text-white font-bold w-full outline-none placeholder-gray-700" placeholder="Title" />
                                <button onClick={() => removeItemInType(type, idx)} className="text-gray-600 hover:text-red-500">×</button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {type !== 'Skills' && (
                                    <input value={item.subtitle} onChange={(e) => updateItemInType(type, idx, 'subtitle', e.target.value)} className="bg-transparent text-gray-400 text-xs w-full outline-none placeholder-gray-800" placeholder="Subtitle" />
                                )}
                                {(type === 'Education' || type === 'Experience') && (
                                    <input value={item.date} onChange={(e) => updateItemInType(type, idx, 'date', e.target.value)} className="bg-transparent text-gray-400 text-xs w-full outline-none text-right placeholder-gray-800" placeholder="Year" />
                                )}
                            </div>
                            {(type === 'Education' || type === 'Experience') && (
                                <textarea value={item.description} onChange={(e) => updateItemInType(type, idx, 'description', e.target.value)} className="bg-transparent text-gray-500 text-sm w-full outline-none mt-2 h-16 resize-none placeholder-gray-800" placeholder="Description..." />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (fetching) return <div className="p-12 text-center animate-pulse">LOADING SYSTEM...</div>;

    return (
        <div className="max-w-5xl pb-20">
            {/* GLOBAL HEADER */}
            <div className="flex justify-between items-end mb-8 border-b border-[#333] pb-4 sticky top-0 bg-[#0a0a0a] z-10 pt-4 shadow-lg shadow-black/50">
                <h1 className="text-3xl font-bold">RESUME_EDITOR</h1>
                {message && <span className="text-xs font-mono text-green-500 animate-pulse">{message.text}</span>}
                <button onClick={() => handleSave('all')} disabled={loading} className="px-6 py-2 bg-white text-black font-bold text-sm hover:bg-gray-200">
                    {loading ? 'SAVING...' : 'SAVE ALL (HEAVY)'}
                </button>
            </div>

            {/* 1. HEADER */}
            <div className="bg-[#111] p-6 mb-8 border border-[#333]">
                <div className="flex justify-between items-center mb-4 border-b border-[#333] pb-2">
                    <h2 className="text-gray-400 font-bold uppercase text-sm">01. Page Header</h2>
                    <button onClick={() => handleSave('header')} className="text-xs font-bold text-green-500 border border-green-900 bg-green-900/10 px-2 hover:bg-green-900/30">SAVE HEADER</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input value={data.heading} onChange={e => setData({ ...data, heading: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white" placeholder="Heading" />
                    <input value={data.subHeading} onChange={e => setData({ ...data, subHeading: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white" placeholder="Sub Heading" />
                </div>
            </div>

            {/* 2. PDFS */}
            <div className="bg-[#111] p-6 mb-8 border border-[#333]">
                <div className="flex justify-between items-center mb-4 border-b border-[#333] pb-2">
                    <h2 className="text-gray-400 font-bold uppercase text-sm">02. PDF Downloads</h2>
                    <div className="flex gap-4">
                        <button onClick={addDownload} className="text-xs text-white hover:underline">+ ADD PDF</button>
                        <button onClick={() => handleSave('downloads')} className="text-xs font-bold text-green-500 border border-green-900 bg-green-900/10 px-2 hover:bg-green-900/30">SAVE PDFS</button>
                    </div>
                </div>
                {data.downloads.map((dl, i) => (
                    <div key={i} className="flex gap-4 items-end bg-black/50 p-3 mb-2 border border-[#333]">
                        <input value={dl.label} onChange={e => updateDownload(i, 'label', e.target.value)} className="bg-transparent border-b border-[#333] text-sm text-white flex-1" placeholder="Label" />
                        <div className="flex-1">
                            <input type="file" accept="application/pdf" onChange={e => handleFileUpload(e, i)} className="text-xs text-gray-400" />
                            {dl.url && <span className="text-[10px] text-green-500 ml-2">● UPLOADED</span>}
                        </div>
                        <button onClick={() => removeDownload(i)} className="text-red-500 text-xs">DEL</button>
                    </div>
                ))}
            </div>

            {/* 3. SECTIONS */}
            <h1 className="text-xl font-bold mb-4 mt-12 text-white border-t border-[#333] pt-4">CONTENT SECTIONS</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-8">
                    {renderSectionEditor('Education', '01. Education')}
                    {renderSectionEditor('Skills', '02. Technical Stack')}
                    {renderSectionEditor('Languages', '03. Languages')}
                </div>
                <div className="flex flex-col gap-8">
                    {renderSectionEditor('Experience', '04. Experience')}

                    {/* 4. FOOTER & NAV */}
                    <div className="bg-[#111] p-6 border border-[#333]">
                        <div className="flex justify-between items-center mb-4 border-b border-[#333] pb-2">
                            <h2 className="text-gray-400 font-bold uppercase text-sm">05. Footer & CTA</h2>
                            <div className="flex gap-2">
                                <button onClick={() => handleSave('footer')} className="text-xs font-bold text-green-500 border border-green-900 bg-green-900/10 px-2 hover:bg-green-900/30">SAVE CTA</button>
                                <button onClick={() => handleSave('nav')} className="text-xs font-bold text-green-500 border border-green-900 bg-green-900/10 px-2 hover:bg-green-900/30">SAVE NAV</button>
                            </div>
                        </div>

                        {/* CTA Fields */}
                        <div className="space-y-4 mb-6 border-b border-[#333] pb-6">
                            <h3 className="text-xs text-gray-500 mb-2">CALL TO ACTION</h3>
                            <div>
                                <label className="block text-[10px] text-gray-500 mb-1">TITLE</label>
                                <input value={data.footerTitle} onChange={e => setData({ ...data, footerTitle: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white text-sm" />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-500 mb-1">SUBTITLE</label>
                                <textarea value={data.footerText} onChange={e => setData({ ...data, footerText: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white text-sm" />
                            </div>
                        </div>

                        {/* Navigation Fields */}
                        <div className="space-y-2">
                            <h3 className="text-xs text-gray-500 mb-2">NAVIGATION LINKS</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">PREV LABEL</label>
                                    <input value={data.navPrevLabel} onChange={e => setData({ ...data, navPrevLabel: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white text-xs" />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">PREV TEXT</label>
                                    <input value={data.navPrevText} onChange={e => setData({ ...data, navPrevText: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white text-xs" />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">NEXT LABEL</label>
                                    <input value={data.navNextLabel} onChange={e => setData({ ...data, navNextLabel: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white text-xs" />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">NEXT TEXT</label>
                                    <input value={data.navNextText} onChange={e => setData({ ...data, navNextText: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white text-xs" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}