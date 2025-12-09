"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function CMSAbout() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const [aboutData, setAboutData] = useState({
    heroHeading: "",
    heroBio: "",
    profileImage: "",
    imageCaption: "",
    statusLabel: "",
    statusText: "",
    servicesTitle: "",
    servicesDescription: "",
    services: [], // Array of { title, description }
    navPrevLabel: "",
    navPrevText: "",
    navNextLabel: "",
    navNextText: "",
  });

  // LOAD DATA
  useEffect(() => {
    fetch("/api/about")
      .then((res) => res.json())
      .then((data) => {
        setAboutData({
          ...data,
          services: data.services || [],
          profileImage: data.profileImage || "",
        });
      });
  }, []);

  // --- CLOUDINARY UPLOAD LOGIC (IMPROVED DEBUGGING) ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    // Ambil config dari env
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    // Validasi Config
    if (!cloudName || !uploadPreset) {
      alert("CONFIG ERROR: Missing Cloud Name or Upload Preset in .env.local");
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      console.log(
        `UPLOADING TO: https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      ); // Debug URL

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (data.secure_url) {
        setAboutData((prev) => ({ ...prev, profileImage: data.secure_url }));
      } else {
        console.error("CLOUDINARY ERROR:", data);
        // Tampilkan pesan error spesifik dari Cloudinary
        alert(
          `UPLOAD FAILED: ${data.error?.message || "Check console for details"}`
        );
      }
    } catch (err) {
      console.error("NETWORK ERROR:", err);
      alert("Network Error during upload.");
    }
    setUploading(false);
  };

  // --- HANDLERS SERVICES ---
  const addService = () => {
    setAboutData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { title: "New Service", description: "Description..." },
      ],
    }));
  };
  const removeService = (i) => {
    const n = [...aboutData.services];
    n.splice(i, 1);
    setAboutData({ ...aboutData, services: n });
  };
  const updateService = (i, f, v) => {
    const n = [...aboutData.services];
    n[i][f] = v;
    setAboutData({ ...aboutData, services: n });
  };

  // --- SMART SAVE HANDLER (PARSIAL) ---
  const handleSave = async (scope) => {
    setLoading(true);
    setMessage(null);

    let payload = {};

    if (scope === "hero" || scope === "all") {
      payload = {
        ...payload,
        heroHeading: aboutData.heroHeading,
        heroBio: aboutData.heroBio,
      };
    }
    if (scope === "image" || scope === "all") {
      payload = {
        ...payload,
        profileImage: aboutData.profileImage,
        imageCaption: aboutData.imageCaption,
      };
    }
    if (scope === "status" || scope === "all") {
      payload = {
        ...payload,
        statusLabel: aboutData.statusLabel,
        statusText: aboutData.statusText,
        servicesTitle: aboutData.servicesTitle,
        servicesDescription: aboutData.servicesDescription,
      };
    }
    if (scope === "services" || scope === "all") {
      payload = { ...payload, services: aboutData.services };
    }
    if (scope === "footer" || scope === "all") {
      payload = {
        ...payload,
        navPrevLabel: aboutData.navPrevLabel,
        navPrevText: aboutData.navPrevText,
        navNextLabel: aboutData.navNextLabel,
        navNextText: aboutData.navNextText,
      };
    }

    try {
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage({ type: "success", text: `SAVED: ${scope.toUpperCase()}` });
        setTimeout(() => setMessage(null), 2000);
      } else {
        setMessage({ type: "error", text: "ERROR SAVING." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "NETWORK ERROR." });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl pb-20">
      {/* HEADER & SAVE ALL */}
      <div className="flex justify-between items-end mb-8 border-b border-[#333] pb-4 sticky top-0 bg-[#0a0a0a] z-10 pt-4 shadow-lg shadow-black/50">
        <h1 className="text-3xl font-bold">ABOUT_EDITOR</h1>
        {message && (
          <span className="text-xs font-mono text-green-500 animate-pulse">
            {message.text}
          </span>
        )}
        <button
          onClick={() => handleSave("all")}
          disabled={loading}
          className="px-6 py-2 bg-white text-black font-bold text-sm hover:bg-gray-200"
        >
          {loading ? "SAVING..." : "SAVE ALL"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          {/* 1. HERO TEXT */}
          <div className="bg-[#111] p-6 border border-[#333]">
            <div className="flex justify-between items-center mb-4 border-b border-[#333] pb-2">
              <h2 className="text-gray-400 font-bold uppercase text-sm">
                01. Hero & Bio
              </h2>
              <button
                onClick={() => handleSave("hero")}
                className="text-xs font-bold text-green-500 border border-green-900 bg-green-900/10 px-2 hover:bg-green-900/30"
              >
                SAVE
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  MAIN HEADING (HTML Allowed)
                </label>
                <textarea
                  rows={2}
                  value={aboutData.heroHeading}
                  onChange={(e) =>
                    setAboutData({ ...aboutData, heroHeading: e.target.value })
                  }
                  className="w-full bg-black border border-[#333] p-2 text-white font-mono text-lg"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  BIOGRAPHY
                </label>
                <textarea
                  rows={10}
                  value={aboutData.heroBio}
                  onChange={(e) =>
                    setAboutData({ ...aboutData, heroBio: e.target.value })
                  }
                  className="w-full bg-black border border-[#333] p-2 text-white font-serif text-sm leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* 2. PROFILE IMAGE */}
          <div className="bg-[#111] p-6 border border-[#333]">
            <div className="flex justify-between items-center mb-4 border-b border-[#333] pb-2">
              <h2 className="text-gray-400 font-bold uppercase text-sm">
                02. Profile Image
              </h2>
              <button
                onClick={() => handleSave("image")}
                className="text-xs font-bold text-green-500 border border-green-900 bg-green-900/10 px-2 hover:bg-green-900/30"
              >
                SAVE
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  IMAGE PREVIEW
                </label>
                <div className="w-full aspect-3/4 bg-black border border-[#333] relative flex items-center justify-center overflow-hidden">
                  {aboutData.profileImage ? (
                    <Image
                      src={aboutData.profileImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-xs">NO IMAGE</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  UPLOAD NEW (CLOUDINARY)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:bg-[#333] file:text-white hover:file:bg-[#444]"
                />
                {uploading && (
                  <p className="text-xs text-yellow-500 mt-2 animate-pulse">
                    UPLOADING TO CLOUD...
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  IMAGE CAPTION
                </label>
                <input
                  value={aboutData.imageCaption}
                  onChange={(e) =>
                    setAboutData({ ...aboutData, imageCaption: e.target.value })
                  }
                  className="w-full bg-black border border-[#333] p-2 text-white text-xs"
                  placeholder="Taipei, 2025"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          {/* 3. STATUS & SERVICES INFO */}
          <div className="bg-[#111] p-6 border border-[#333]">
            <div className="flex justify-between items-center mb-4 border-b border-[#333] pb-2">
              <h2 className="text-gray-400 font-bold uppercase text-sm">
                03. Status & Intro
              </h2>
              <button
                onClick={() => handleSave("status")}
                className="text-xs font-bold text-green-500 border border-green-900 bg-green-900/10 px-2 hover:bg-green-900/30"
              >
                SAVE
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    STATUS LABEL
                  </label>
                  <input
                    value={aboutData.statusLabel}
                    onChange={(e) =>
                      setAboutData({
                        ...aboutData,
                        statusLabel: e.target.value,
                      })
                    }
                    className="w-full bg-black border border-[#333] p-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    STATUS TEXT
                  </label>
                  <input
                    value={aboutData.statusText}
                    onChange={(e) =>
                      setAboutData({ ...aboutData, statusText: e.target.value })
                    }
                    className="w-full bg-black border border-[#333] p-2 text-white text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  SERVICES TITLE
                </label>
                <input
                  value={aboutData.servicesTitle}
                  onChange={(e) =>
                    setAboutData({
                      ...aboutData,
                      servicesTitle: e.target.value,
                    })
                  }
                  className="w-full bg-black border border-[#333] p-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  SERVICES DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={aboutData.servicesDescription}
                  onChange={(e) =>
                    setAboutData({
                      ...aboutData,
                      servicesDescription: e.target.value,
                    })
                  }
                  className="w-full bg-black border border-[#333] p-2 text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* 4. SERVICES LIST */}
          <div className="bg-[#111] p-6 border border-[#333]">
            <div className="flex justify-between items-center mb-4 border-b border-[#333] pb-2">
              <h2 className="text-gray-400 font-bold uppercase text-sm">
                04. Services List
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={addService}
                  className="text-xs text-white hover:underline"
                >
                  + ADD ITEM
                </button>
                <button
                  onClick={() => handleSave("services")}
                  className="text-xs font-bold text-green-500 border border-green-900 bg-green-900/10 px-2 hover:bg-green-900/30"
                >
                  SAVE
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {aboutData.services.map((svc, i) => (
                <div
                  key={i}
                  className="bg-black/50 p-4 border border-[#333] relative"
                >
                  <button
                    onClick={() => removeService(i)}
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                  >
                    ×
                  </button>
                  <div className="space-y-2">
                    <input
                      value={svc.title}
                      onChange={(e) =>
                        updateService(i, "title", e.target.value)
                      }
                      className="w-full bg-transparent text-white font-bold outline-none placeholder-gray-700"
                      placeholder="Service Title"
                    />
                    <textarea
                      value={svc.description}
                      onChange={(e) =>
                        updateService(i, "description", e.target.value)
                      }
                      className="w-full bg-transparent text-gray-500 text-sm outline-none resize-none placeholder-gray-800"
                      placeholder="Description..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. FOOTER NAVIGATION */}
          <div className="bg-[#111] p-6 border border-[#333]">
            <div className="flex justify-between items-center mb-4 border-b border-[#333] pb-2">
              <h2 className="text-gray-400 font-bold uppercase text-sm">
                05. Footer Navigation
              </h2>
              <button
                onClick={() => handleSave("footer")}
                className="text-xs font-bold text-green-500 border border-green-900 bg-green-900/10 px-2 hover:bg-green-900/30"
              >
                SAVE
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">
                  PREV LABEL
                </label>
                <input
                  value={aboutData.navPrevLabel}
                  onChange={(e) =>
                    setAboutData({ ...aboutData, navPrevLabel: e.target.value })
                  }
                  className="w-full bg-black border border-[#333] p-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">
                  PREV LINK TEXT
                </label>
                <input
                  value={aboutData.navPrevText}
                  onChange={(e) =>
                    setAboutData({ ...aboutData, navPrevText: e.target.value })
                  }
                  className="w-full bg-black border border-[#333] p-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">
                  NEXT LABEL
                </label>
                <input
                  value={aboutData.navNextLabel}
                  onChange={(e) =>
                    setAboutData({ ...aboutData, navNextLabel: e.target.value })
                  }
                  className="w-full bg-black border border-[#333] p-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">
                  NEXT LINK TEXT
                </label>
                <input
                  value={aboutData.navNextText}
                  onChange={(e) =>
                    setAboutData({ ...aboutData, navNextText: e.target.value })
                  }
                  className="w-full bg-black border border-[#333] p-2 text-white text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
