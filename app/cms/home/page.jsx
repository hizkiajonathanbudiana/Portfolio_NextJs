'use client';

import { useState, useEffect } from 'react';

export default function CMSHome() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState(null);

    const [data, setData] = useState({
        cornerTopLeft: '', subHeading: '', cornerTopRight: '',
        heading: '', scrollText: '',
        cornerBottomLeft: '', cornerBottomRight: ''
    });

    // LOAD DATA
    useEffect(() => {
        fetch('/api/home')
            .then(res => res.json())
            .then(resData => {
                setData(resData);
                setFetching(false);
            })
            .catch(err => setFetching(false));
    }, []);

    // SAVE HANDLER
    const handleSave = async () => {
        setLoading(true); setMessage(null);
        try {
            const res = await fetch('/api/home', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: "HOME CONFIG UPDATED" });
                setTimeout(() => setMessage(null), 2000);
            } else {
                setMessage({ type: 'error', text: "SAVE FAILED" });
            }
        } catch (err) { setMessage({ type: 'error', text: "NETWORK ERROR" }); }
        setLoading(false);
    };

    if (fetching) return <div className="p-12 text-center animate-pulse font-mono">LOADING HOME CONFIG...</div>;

    return (
        <div className="max-w-5xl pb-20">
            {/* HEADER */}
            <div className="flex justify-between items-end mb-8 border-b border-[#333] pb-4 sticky top-0 bg-[#0a0a0a] z-10 pt-4 shadow-lg shadow-black/50">
                <h1 className="text-3xl font-bold">HOME_EDITOR</h1>
                {message && <span className={`text-xs font-mono animate-pulse ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>{message.text}</span>}
                <button onClick={handleSave} disabled={loading} className="px-6 py-2 bg-white text-black font-bold text-xs hover:bg-gray-200">
                    {loading ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* LEFT COL: CENTER & TOP */}
                <div className="space-y-8">
                    {/* CENTER HERO */}
                    <div className="bg-[#111] p-6 border border-[#333]">
                        <h2 className="text-gray-400 font-bold uppercase text-xs mb-4 border-b border-[#333] pb-2">01. Center Stage</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] text-gray-500 mb-1">MAIN HEADING (HTML Allowed)</label>
                                <textarea rows={2} value={data.heading} onChange={e => setData({ ...data, heading: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white font-mono text-xl" placeholder="INTERACTION<br/>DESIGNER" />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-500 mb-1">SCROLL CTA</label>
                                <input value={data.scrollText} onChange={e => setData({ ...data, scrollText: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white text-xs text-center" placeholder="(SCROLL TO ENTER) ↓" />
                            </div>
                        </div>
                    </div>

                    {/* TOP CORNERS */}
                    <div className="bg-[#111] p-6 border border-[#333]">
                        <h2 className="text-gray-400 font-bold uppercase text-xs mb-4 border-b border-[#333] pb-2">02. Top Corners</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] text-gray-500 mb-1">TOP LEFT (TITLE)</label>
                                <input value={data.cornerTopLeft} onChange={e => setData({ ...data, cornerTopLeft: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white text-xs font-bold" placeholder="CHENWEIZE" />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-500 mb-1">TOP LEFT (SUBTITLE)</label>
                                <textarea rows={2} value={data.subHeading} onChange={e => setData({ ...data, subHeading: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white text-xs" placeholder="PORTFOLIO 2025" />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-500 mb-1">TOP RIGHT (TEXT)</label>
                                <textarea rows={3} value={data.cornerTopRight} onChange={e => setData({ ...data, cornerTopRight: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white text-xs text-right" placeholder="AVAILABLE FOR WORK" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COL: BOTTOM */}
                <div className="space-y-8">
                    {/* BOTTOM CORNERS */}
                    <div className="bg-[#111] p-6 border border-[#333]">
                        <h2 className="text-gray-400 font-bold uppercase text-xs mb-4 border-b border-[#333] pb-2">03. Bottom Corners</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] text-gray-500 mb-1">BOTTOM LEFT (COORDINATES)</label>
                                <textarea rows={3} value={data.cornerBottomLeft} onChange={e => setData({ ...data, cornerBottomLeft: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white text-xs font-mono" placeholder="COORDINATES..." />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-500 mb-1">BOTTOM RIGHT (CREDITS)</label>
                                <textarea rows={3} value={data.cornerBottomRight} onChange={e => setData({ ...data, cornerBottomRight: e.target.value })} className="w-full bg-black border border-[#333] p-2 text-white text-xs text-right font-mono" placeholder="INDEX_OF_WORKS" />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border border-yellow-900/30 bg-yellow-900/10 text-yellow-500 text-[10px] font-mono">
                        <p>TIP: Use <strong>Enter</strong> in text areas to create line breaks (new lines) on the actual website.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}