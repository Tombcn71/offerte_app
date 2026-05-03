"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { uploadLogo } from "@/app/actions/upload";

export default function ProfileForm({ profile }: { profile: any }) {
  const [isEditing, setIsEditing] = useState(!profile?.company_name);
  const [logoUrl, setLogoUrl] = useState(profile?.logo_url);
  const [uploading, setUploading] = useState(false);

  if (!isEditing && profile?.company_name) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
        <div className="flex justify-between items-start">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-900 flex-1">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Bedrijfsnaam
              </label>
              <p className="font-semibold text-lg mt-1">
                {profile.company_name}
              </p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Adres
              </label>
              <p className="text-slate-600 mt-1">{profile.address || "—"}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                KvK-nummer
              </label>
              <p className="text-slate-600 mt-1">{profile.kvk_number || "—"}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                BTW-nummer
              </label>
              <p className="text-slate-600 mt-1">{profile.btw_number || "—"}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Bankrekening (IBAN)
              </label>
              <p className="text-slate-600 font-mono mt-1">
                {profile.iban || "—"}
              </p>
            </div>
          </div>
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-20 w-20 object-contain ml-4 border rounded-lg p-2"
            />
          )}
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-600 font-bold text-sm">
          Aanpassen
        </button>
      </div>
    );
  }

  return (
    <form
      action={async (formData) => {
        await updateProfile(formData);
        setIsEditing(false);
      }}
      className="bg-white p-8 rounded-2xl border-2 border-blue-100 shadow-xl space-y-8 text-slate-900">
      {/* LOGO */}
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase mb-4 block">
          Bedrijfslogo
        </label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-50 border rounded-xl flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} className="w-full h-full object-contain" />
            ) : (
              <span className="text-slate-300 text-[10px]">Geen logo</span>
            )}
          </div>
          <input
            type="file"
            id="logo-upload"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                setUploading(true);
                const formData = new FormData();
                formData.append("logo", file);
                const newUrl = await uploadLogo(formData);
                if (newUrl) setLogoUrl(newUrl);
                setUploading(false);
              }
            }}
          />
          <label
            htmlFor="logo-upload"
            className="bg-slate-100 hover:bg-slate-200 cursor-pointer font-bold py-2 px-4 rounded-lg text-xs transition">
            {uploading ? "Laden..." : "Foto uploaden"}
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
            Bedrijfsnaam
          </label>
          <input
            name="company_name"
            defaultValue={profile?.company_name || ""}
            className="w-full p-3 rounded-xl border border-slate-200"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
            Adres
          </label>
          <input
            name="address"
            defaultValue={profile?.address || ""}
            className="w-full p-3 rounded-xl border border-slate-200"
          />
        </div>
        <input
          name="kvk_number"
          defaultValue={profile?.kvk_number || ""}
          placeholder="KvK-nummer"
          className="p-3 rounded-xl border border-slate-200"
        />
        <input
          name="btw_number"
          defaultValue={profile?.btw_number || ""}
          placeholder="BTW-nummer"
          className="p-3 rounded-xl border border-slate-200"
        />
        <input
          name="iban"
          defaultValue={profile?.iban || ""}
          placeholder="IBAN"
          className="md:col-span-2 p-3 rounded-xl border border-slate-200 font-mono"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl">
          Opslaan
        </button>
        {profile?.company_name && (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-slate-400 font-bold px-4">
            Annuleren
          </button>
        )}
      </div>
    </form>
  );
}
