'use client';

import { useState, useEffect } from 'react';

export default function CMSContact() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState(null);

    const [data, setData] = useState({
        heading: '',
        section1Title: '', email: '', availability: '',
        section2Title: '', socials: [],
        section3Title: '', timezone: '', location: '',
        navPrevLabel: '', navPrevText: '',
        navNextLabel: '', navNextText: ''
    });

    // LOAD DATA
    useEffect(() => {
        fetch('/api/contact')
            .then(res => res.json())
            .then(resData => {
                setData({
                    ...resData,
                    socials: resData.socials || [] // Pastikan array
                });
                setFetching(false);
            })
            .catch(err => setFetching(false));
    }, []);

    // SOCIALS HANDLER
    const addSocial = () => setData(prev => ({ ...prev, socials: [...prev.socials, { platform: 'New', url: '#' }] }));
    const removeSocial = (idx) => {
        const n = [...data.socials]; n.splice(idx, 1);
        setData(prev => ({ ...prev, socials: n }));
    };
    const updateSocial = (idx, field, val) => {
        const n = [...data.socials]; n[idx][field] = val;
        setData(prev => ({ ...prev, socials: n }));
    };

    // SAVE HANDLER
    const handleSave = async () => {
        setLoading(true); setMessage(null);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                setMessage({ type: 'success', text: "SAVED SUCCESSFULLY" });
                setTimeout(() => setMessage(null), 2000);
            } else {
                setMessage({ type: 'error', text: "SAVE FAILED" });
            }
        } catch (err) { setMessage({ type: 'error', text: "NETWORK ERROR" }); }
        setLoading(false);
    };

    if (fetching) return <div className="p-12 text-center animate-pulse font-mono">LOADING CONTACT...</div>;

    return (
        <div className="max-w-5xl pb-20">
            {/* HEADER */}
            <div className="flex justify-between items-end mb-8 border-b border-[#333] pb-4 sticky top-0 bg-[#0a0a0a] z-10 pt-4 shadow-lg shadow-black/50">
                <h1 className="text-3xl font-bold">CONTACT_EDITOR</h1>
                {message && <span className={`text-xs font-mono animate-pulse ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>{message.text}</span>}
                <button onClick={handleSave} disabled={loading} className="px-6 py-2 bg-white text-black font-bold text-xs hover:bg-gray-200">
                    {loading ? 'SAVING...' : 'SAVE ALL'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* LEFT COL */}
                <div className="space-y-8">
                    {/* HEADING */}
                    <div className="bg-[#111] p-6 border border-[#333]">
                        <h2 className="text-gray-400 font-bold uppercase text-xs mb-4 border-b border-[#333] pb-2">01. Main Headline</h2>
                        <textarea value={data.heading} onChange={e => setData({ ...data, heading: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white font-mono text-xl" placeholder="HTML Allowed" />
                    </div>

                    {/* EMAIL */}
                    <div className="bg-[#111] p-6 border border-[#333]">
                        <h2 className="text-gray-400 font-bold uppercase text-xs mb-4 border-b border-[#333] pb-2">02. Email Info</h2>
                        <div className="space-y-3">
                            <input value={data.section1Title} onChange={e => setData({ ...data, section1Title: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white text-xs" placeholder="Section Title" />
                            <input value={data.email} onChange={e => setData({ ...data, email: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white text-sm font-bold" placeholder="Email Address" />
                            <textarea value={data.availability} onChange={e => setData({ ...data, availability: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white text-xs resize-none" placeholder="Availability Text" />
                        </div>
                    </div>

                    {/* LOCATION */}
                    <div className="bg-[#111] p-6 border border-[#333]">
                        <h2 className="text-gray-400 font-bold uppercase text-xs mb-4 border-b border-[#333] pb-2">04. Location</h2>
                        <div className="space-y-3">
                            <input value={data.section3Title} onChange={e => setData({ ...data, section3Title: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white text-xs" placeholder="Section Title" />
                            <div className="grid grid-cols-2 gap-2">
                                <input value={data.timezone} onChange={e => setData({ ...data, timezone: e.target.value })} className="bg-black border border-[#333] p-2 text-white text-xs" placeholder="Timezone (GMT+8)" />
                                <input value={data.location} onChange={e => setData({ ...data, location: e.target.value })} className="bg-black border border-[#333] p-2 text-white text-xs" placeholder="Location Name" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COL */}
                <div className="space-y-8">
                    {/* SOCIALS */}
                    <div className="bg-[#111] p-6 border border-[#333]">
                        <div className="flex justify-between items-center mb-4 border-b border-[#333] pb-2">
                            <h2 className="text-gray-400 font-bold uppercase text-xs">03. Social Links</h2>
                            <button onClick={addSocial} className="text-[10px] text-white hover:underline">+ ADD LINK</button>
                        </div>
                        <input value={data.section2Title} onChange={e => setData({ ...data, section2Title: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white text-xs mb-4" placeholder="Section Title" />

                        <div className="space-y-2">
                            {data.socials.map((soc, i) => (
                                <div key={i} className="flex gap-2">
                                    <input value={soc.platform} onChange={e => updateSocial(i, 'platform', e.target.value)} className="w-1/3 bg-black border border-[#333] p-2 text-white text-xs" placeholder="Platform" />
                                    <input value={soc.url} onChange={e => updateSocial(i, 'url', e.target.value)} className="w-full bg-black border border-[#333] p-2 text-white text-xs" placeholder="URL" />
                                    <button onClick={() => removeSocial(i)} className="text-red-500 px-2 border border-red-900 bg-red-900/10 hover:bg-red-900/30">×</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FOOTER NAV */}
                    <div className="bg-[#111] p-6 border border-[#333]">
                        <h2 className="text-gray-400 font-bold uppercase text-xs mb-4 border-b border-[#333] pb-2">05. Footer Nav</h2>
                        <div className="grid grid-cols-2 gap-2">
                            <input value={data.navPrevLabel} onChange={e => setData({ ...data, navPrevLabel: e.target.value })} className="bg-black border border-[#333] p-2 text-white text-[10px]" placeholder="Prev Label" />
                            <input value={data.navPrevText} onChange={e => setData({ ...data, navPrevText: e.target.value })} className="bg-black border border-[#333] p-2 text-white text-[10px]" placeholder="Prev Link" />
                            <input value={data.navNextLabel} onChange={e => setData({ ...data, navNextLabel: e.target.value })} className="bg-black border border-[#333] p-2 text-white text-[10px]" placeholder="Next Label" />
                            <input value={data.navNextText} onChange={e => setData({ ...data, navNextText: e.target.value })} className="bg-black border border-[#333] p-2 text-white text-[10px]" placeholder="Next Link" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}