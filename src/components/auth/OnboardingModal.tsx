import React, { useState, useRef } from 'react';
import { User as UserIcon, AtSign, Image as ImageIcon, Sparkles, ArrowRight, Upload, Camera } from 'lucide-react';
import { useStore } from '../../lib/store';
import { UserAvatar } from '../common/UserAvatar';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, currentUser, updateUserProfile } = useStore();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOnboardingOpen) return null;

  const defaultAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  ];

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim()) {
      setErrorMsg('Please enter both your display name and unique handle.');
      return;
    }

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

    await updateUserProfile({
      fullName: fullName.trim(),
      username: cleanUsername,
      bio: bio.trim(),
      avatarUrl: avatarUrl || defaultAvatars[0],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#121215] border border-[#222226] rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Subtle Ambient */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-6">
          <div className="inline-flex p-2.5 rounded-xl bg-white/5 border border-[#222226] text-white mb-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-[#FAFAFA]">
            Complete Your Academic Profile
          </h2>
          <p className="text-xs text-[#71717A] mt-1 max-w-sm mx-auto">
            Set up your identity before entering competitive study squads and leaderboards.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleFinish} className="space-y-4">
          {/* Avatar Picker / Upload */}
          <div className="flex flex-col items-center justify-center gap-3 py-2">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <UserAvatar
                user={{ fullName: fullName || 'User', avatarUrl }}
                size="xl"
                showStatus={false}
              />
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                <Camera className="w-5 h-5" />
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarFile}
              accept="image/*"
              className="hidden"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-mono text-[#71717A] hover:text-white underline underline-offset-4"
              >
                Upload Photo
              </button>
              <span className="text-xs text-[#52525B]">•</span>
              <div className="flex items-center gap-1.5">
                {defaultAvatars.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`w-6 h-6 rounded-full overflow-hidden border transition-all ${
                      avatarUrl === url ? 'ring-2 ring-white border-white scale-110' : 'border-[#222226] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-mono tracking-wider text-[#71717A] mb-1.5">
              Full Name / Display Name *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B]" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Marcus Vance"
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-xl text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-mono tracking-wider text-[#71717A] mb-1.5">
              Unique Handle *
            </label>
            <div className="relative">
              <AtSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B]" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="marcus_phys"
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-xl text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none transition-colors font-mono lowercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-mono tracking-wider text-[#71717A] mb-1.5">
              Academic Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. IIT Bombay aspirant | Grinding Physics & Calculus 6h daily"
              rows={2}
              className="w-full p-2.5 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-xl text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.99] transition-all shadow-lg mt-3"
          >
            <span>Complete Setup & Enter Platform</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
