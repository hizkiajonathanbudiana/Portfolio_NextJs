'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            setError('ACCESS_DENIED: Invalid Credentials');
        } else {
            router.push('/cms'); // Sukses -> Lempar ke CMS
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#111] text-[#f0f0f0]">
            <div className="w-full max-w-md p-8 border border-[#333]">
                <h1 className="text-3xl font-mono mb-6 tracking-tighter">SYSTEM_LOGIN</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-mono text-xs text-gray-500 mb-1">IDENTIFIER</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border border-[#333] p-3 focus:border-white outline-none font-mono text-sm"
                            placeholder="admin@hizkia.wz"
                        />
                    </div>
                    <div>
                        <label className="block font-mono text-xs text-gray-500 mb-1">PASSPHRASE</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border border-[#333] p-3 focus:border-white outline-none font-mono text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-900/20 border border-red-500 text-red-500 text-xs font-mono">
                            ⚠ {error}
                        </div>
                    )}

                    <button type="submit" className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200">
                        Authenticate
                    </button>
                </form>
            </div>
        </div>
    );
}