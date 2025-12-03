'use client';

import { useState } from 'react';

export default function CMSBackup() {
    const [loading, setLoading] = useState(false);

    const handleDownloadBackup = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/sync');
            const blob = await res.blob();

            // Buat link download virtual
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            // Nama file pake tanggal biar rapi: backup-2025-10-24.json
            a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            alert("BACKUP FAILED");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl pb-20">
            {/* HEADER */}
            <div className="flex justify-between items-end mb-8 border-b border-[#333] pb-4 sticky top-0 bg-[#0a0a0a] z-10 pt-4">
                <h1 className="text-3xl font-bold">SYSTEM_BACKUP</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* SAFE ZONE: BACKUP */}
                <div className="bg-[#111] p-8 border border-[#333]">
                    <h2 className="text-xl font-bold mb-4 text-green-500">DOWNLOAD DATABASE</h2>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed font-mono">
                        Create a full JSON snapshot of your current live website data (Home, About, Projects, etc).
                        Keep this file safe as a recovery point.
                    </p>
                    <button
                        onClick={handleDownloadBackup}
                        disabled={loading}
                        className="w-full py-4 bg-white text-black font-bold uppercase hover:bg-gray-200 border border-white transition-all"
                    >
                        {loading ? 'GENERATING JSON...' : 'DOWNLOAD BACKUP .JSON'}
                    </button>
                </div>

                {/* DANGER ZONE EXPLANATION (Optional Info) */}
                <div className="bg-[#111] p-8 border border-red-900/30 opacity-75">
                    <h2 className="text-xl font-bold mb-4 text-gray-500">RESTORE / RESET</h2>
                    <p className="text-gray-500 text-sm mb-4 leading-relaxed font-mono">
                        The "Sync to Database" feature has been disabled to prevent accidental data loss.
                    </p>
                    <p className="text-gray-600 text-xs font-mono">
                        // Since the Database is now the "Source of Truth", overwriting it with a local file is dangerous.
                    // If you need to restore from a backup, please use MongoDB Atlas Import tool or contact the developer.
                    </p>
                </div>

            </div>
        </div>
    );
}