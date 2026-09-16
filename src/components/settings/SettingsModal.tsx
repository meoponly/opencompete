import React, { useState, useRef } from 'react';
import {
  X,
  User as UserIcon,
  AtSign,
  Sun,
  Moon,
  LogOut,
  Save,
  Check,
  Shield,
  Camera,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { UserAvatar } from '../common/UserAvatar';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    currentUser,
    updateUserProfile,
    theme,
    setTheme,
    logout,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'account'>('profile');
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isSettingsOpen || !currentUser) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      fullName: fullName.trim(),
      username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, ''),
      bio: bio.trim(),
      avatarUrl,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleLogout = async () => {
    setIsSettingsOpen(false);
    await logout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#121215] border border-[#222226] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222226]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-white" />
            <h2 className="text-base font-semibold tracking-tight text-[#FAFAFA]">Settings</h2>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-lg text-[#71717A] hover:text-white hover:bg-[#1C1C21] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body: Sidebar tabs & Main Panel */}
        <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
          {/* Settings Nav Tabs */}
          <div className="sm:w-44 p-3 bg-[#09090B] border-b sm:border-b-0 sm:border-r border-[#222226] flex sm:flex-col gap-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                activeTab === 'profile'
                  ? 'bg-[#1C1C21] text-white border border-[#2E2E35] font-semibold'
                  : 'text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#121215]'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('preferences')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                activeTab === 'preferences'
                  ? 'bg-[#1C1C21] text-white border border-[#2E2E35] font-semibold'
                  : 'text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#121215]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Preferences</span>
            </button>

            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                activeTab === 'account'
                  ? 'bg-[#1C1C21] text-white border border-[#2E2E35] font-semibold'
                  : 'text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#121215]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Account</span>
            </button>
          </div>

          {/* Tab Viewport */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            {/* Tab 1: Profile Management */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="flex items-center gap-4 pb-2">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UserAvatar
                      user={{ fullName, avatarUrl }}
                      size="lg"
                      showStatus={false}
                    />
                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                      <Camera className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1 rounded-md bg-[#1C1C21] border border-[#2E2E35] text-xs font-mono text-white hover:bg-[#25252B] transition-colors"
                    >
                      Change Photo
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <p className="text-[10px] text-[#71717A] mt-1 font-mono">
                      JPG, PNG or GIF up to 5MB
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider text-[#71717A] mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-lg text-[#FAFAFA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider text-[#71717A] mb-1">
                    Username Handle
                  </label>
                  <div className="relative">
                    <AtSign className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B]" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-lg text-[#FAFAFA] font-mono lowercase focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider text-[#71717A] mb-1">
                    Bio / Status
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    placeholder="Tell your squad what exams or topics you are focusing on..."
                    className="w-full p-2.5 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-lg text-[#FAFAFA] focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-lg bg-white text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-neutral-200 transition-all shadow-md"
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Profile Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: App Preferences (Theme Switcher) */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-[#FAFAFA] mb-1">Theme Mode</h3>
                  <p className="text-xs text-[#71717A] mb-3">
                    Choose your preferred interface appearance.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        theme === 'dark'
                          ? 'bg-[#1C1C21] border-white/50 text-white shadow-md'
                          : 'bg-[#09090B] border-[#222226] text-[#71717A] hover:text-[#FAFAFA]'
                      }`}
                    >
                      <Moon className="w-5 h-5" />
                      <span className="text-xs font-mono font-medium">Dark (Linear Black)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        theme === 'light'
                          ? 'bg-[#1C1C21] border-white/50 text-white shadow-md'
                          : 'bg-[#09090B] border-[#222226] text-[#71717A] hover:text-[#FAFAFA]'
                      }`}
                    >
                      <Sun className="w-5 h-5" />
                      <span className="text-xs font-mono font-medium">Light Mode</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Account Control */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-[#09090B] border border-[#222226] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#71717A]">Registered Email:</span>
                    <span className="text-xs font-mono font-medium text-white">
                      {currentUser.email || 'user@opencompete.com'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#71717A]">User ID:</span>
                    <span className="text-[10px] font-mono text-[#71717A] truncate max-w-[180px]">
                      {currentUser.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#71717A]">Current Streak:</span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {currentUser.streakDays} Days
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#222226]">
                  <h4 className="text-xs font-semibold text-rose-400 mb-1">Account Actions</h4>
                  <p className="text-[11px] text-[#71717A] mb-3">
                    Signing out will end your active session on this device.
                  </p>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-300 font-semibold text-xs flex items-center gap-2 hover:bg-rose-900/50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out of OpenCompete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
