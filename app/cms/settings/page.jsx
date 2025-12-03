'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
    const [siteName, setSiteName] = useState('HIZKIA.WZ');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // Buat nampilin toast error/success

    // Fetch data awal (biar pura-pura load data asli)
    useEffect(() => {
        fetch('/api/settings').then(res => res.json()).then(data => {
            if (data.siteName) setSiteName(data.siteName);
        });
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const res = await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ siteName }),
        });

        const data = await res.json();
        setLoading(false);

        if (res.status === 401) {
            // INI LOGIC SHOWCASE-NYA!
            setMessage({ type: 'error', text: `ACCESS DENIED: ${data.message}` });
        } else if (res.ok) {
            setMessage({ type: 'success', text: "SUCCESS: Configuration updated. Changes will reflect in ~60 seconds (ISR)." });
        } else {
            setMessage({ type: 'error', text: "ERROR: System Failure." });
        }
    };

    const handleFakeRegister = () => {
        setMessage({ type: 'error', text: "RESTRICTED: Only existing Admins can invite new users." });
    };

    return (
        <div className="max-w-3xl pb-20">
            {/* HEADER & ACTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-[#333] pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">GLOBAL_SETTINGS</h1>
                    <p className="text-gray-500 font-mono text-xs mt-2">Manage Site Identity & System Access</p>
                </div>

                {/* IMPROVED REGISTER BUTTON */}
                <button
                    onClick={handleFakeRegister}
                    className="flex items-center gap-2 px-4 py-2 border border-[#333] bg-[#111] hover:bg-white hover:text-black transition-all text-xs font-bold uppercase tracking-wider group"
                >
                    <span>+ Invite New Admin</span>
                    <span className="bg-[#333] text-white group-hover:bg-black group-hover:text-white text-[10px] px-1 rounded">PRO</span>
                </button>
            </div>

            {/* NOTIFICATION AREA */}
            {message && (
                <div className={`p-4 mb-8 border font-mono text-sm flex justify-between items-center animate-pulse ${message.type === 'error' ? 'bg-red-900/10 border-red-500 text-red-500' : 'bg-green-900/10 border-green-500 text-green-500'
                    }`}>
                    <span>[{message.type.toUpperCase()}] {message.text}</span>
                    <button onClick={() => setMessage(null)} className="hover:underline">DISMISS</button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-12">

                {/* SECTION 1: GENERAL IDENTITY */}
                <div className="bg-[#111] p-8 border border-[#333]">
                    <h2 className="text-xl font-bold mb-1 text-white">01. Site Identity</h2>
                    <p className="text-gray-500 text-xs font-mono mb-6 border-b border-[#333] pb-4">
                        This setting controls the Brand Name visible on the Navigation Bar and the SEO Title tag across the website.
                    </p>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label className="block text-[10px] text-gray-400 mb-2 uppercase tracking-widest font-bold">Website Name / Logo Text</label>
                            <input
                                type="text"
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                                className="w-full bg-black border border-[#333] p-4 text-xl focus:border-white outline-none font-mono text-white placeholder-gray-700"
                                placeholder="E.g. HIZKIA.WZ"
                            />
                            <p className="mt-2 text-[10px] text-gray-600 font-mono">
                                * This will automatically update your <code className="bg-[#222] px-1 text-gray-300">&lt;title&gt;</code> tag and <code className="bg-[#222] px-1 text-gray-300">sitemap.xml</code> entries.
                            </p>
                        </div>

                        <div className="pt-4 flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-gray-200 disabled:opacity-50 transition-all"
                            >
                                {loading ? 'SAVING...' : 'SAVE CONFIGURATION'}
                            </button>
                            {loading && <span className="text-xs font-mono text-gray-500 animate-pulse">Syncing to Database...</span>}
                        </div>
                    </form>
                </div>

                {/* SECTION 2: SYSTEM INFO (DEBUG) */}
                <div className="p-6 border border-dashed border-[#333] bg-[#0a0a0a] text-xs font-mono text-gray-500">
                    <p className="mb-2 font-bold text-gray-300 uppercase">[ SYSTEM DIAGNOSTICS ]</p>
                    <ul className="space-y-1 list-disc pl-4">
                        <li>Middleware Interception: <span className="text-green-500">ACTIVE</span></li>
                        <li>Database Connection: <span className="text-green-500">CONNECTED (Atlas)</span></li>
                        <li>Write Permission: <span className="text-yellow-500">RESTRICTED (Guest Mode)</span></li>
                        <li>ISR Revalidation: <span className="text-blue-500">60 Seconds</span></li>
                    </ul>
                </div>

            </div>
        </div>
    );
}