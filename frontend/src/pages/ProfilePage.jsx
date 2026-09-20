import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiShield, FiGlobe, FiCheck, FiSave, FiEdit3, FiUpload, FiCamera } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const fileInputRef = useRef(null);

  const [nameInput, setNameInput] = useState(user?.name || '');
  const [bio, setBio] = useState(() => {
    return localStorage.getItem(`oceanfusion_bio_${user?.id}`) || 
      'Senior Oceanographic Data Researcher studying spatiotemporal cyclone genesis and wave energy propagation across the Bay of Bengal.';
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setNameInput(user.name);
    }
  }, [user]);

  const defaultAvatar = user?.avatar || 
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}&backgroundColor=0284c7`;

  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    return localStorage.getItem(`oceanfusion_avatar_${user?.id}`) || user?.avatar || defaultAvatar;
  });

  useEffect(() => {
    const currentAvatar = localStorage.getItem(`oceanfusion_avatar_${user?.id}`) || user?.avatar;
    if (currentAvatar) {
      setSelectedAvatar(currentAvatar);
    }
  }, [user?.id, user?.avatar]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (user?.id) {
      updateUserProfile({ name: nameInput });
      localStorage.setItem(`oceanfusion_bio_${user.id}`, bio);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG or JPEG)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Str = reader.result;
        setSelectedAvatar(base64Str);
        if (user?.id) {
          localStorage.setItem(`oceanfusion_avatar_${user.id}`, base64Str);
          window.dispatchEvent(new Event('storage')); // Notify sidebar & components
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-5xl mx-auto"
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Profile Overview Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar Display with Upload Overlay */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative group flex-shrink-0 cursor-pointer"
            title="Click to Upload Custom Profile Picture (PNG/JPEG)"
          >
            <img
              src={selectedAvatar}
              alt="User Avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-ocean-primary/20 shadow-md group-hover:opacity-80 transition-opacity"
            />
            <div className="absolute inset-0 bg-ocean-sidebar/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
              <FiCamera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold uppercase">Upload</span>
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h2 className="text-xl font-bold font-heading text-ocean-text">
                {user?.name}
              </h2>
              <Badge variant={user?.role === 'admin' ? 'danger' : 'info'}>
                {user?.role?.toUpperCase()}
              </Badge>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-500 font-medium">
              <FiMail className="w-4 h-4 text-ocean-primary" />
              <span>{user?.email}</span>
            </div>

            {/* Custom Upload Button */}
            <div className="pt-1">
              <Button
                variant="outline"
                size="sm"
                icon={FiUpload}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Profile Picture (PNG / JPEG)
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Name & Bio Edit Card */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-ocean-border pb-3">
          <div className="flex items-center gap-2">
            <FiEdit3 className="w-4 h-4 text-ocean-primary" />
            <h3 className="text-sm font-bold font-heading text-ocean-text">
              Edit Account Information &amp; Bio
            </h3>
          </div>
          {savedSuccess && (
            <span className="text-xs font-semibold text-ocean-success flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <FiCheck className="w-3.5 h-3.5" /> Account Information Updated!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              Display Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-ocean-border bg-ocean-bg focus:bg-ocean-card focus:outline-none focus:border-ocean-primary focus:ring-1 focus:ring-ocean-primary transition-all font-semibold text-ocean-text"
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* Bio Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
              {t('editBio')}
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t('bioPlaceholder')}
              className="w-full text-sm p-3.5 rounded-xl border border-ocean-border bg-ocean-bg focus:bg-ocean-card focus:outline-none focus:border-ocean-primary focus:ring-1 focus:ring-ocean-primary transition-all leading-relaxed text-ocean-text"
            ></textarea>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={FiSave}
            >
              Update Profile Information
            </Button>
          </div>
        </form>
      </Card>

      {/* Language Preference Card */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-ocean-border pb-3">
          <div className="flex items-center gap-2">
            <FiGlobe className="w-4 h-4 text-ocean-primary" />
            <h3 className="text-sm font-bold font-heading text-ocean-text">
              {t('preferredLanguage')}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => toggleLanguage('en')}
            className={`flex-1 p-4 rounded-xl border flex items-center justify-between font-semibold text-sm transition-all ${
              language === 'en'
                ? 'bg-ocean-primary/10 border-ocean-primary text-ocean-primary shadow-sm'
                : 'bg-ocean-card border-ocean-border text-ocean-text hover:bg-ocean-bg'
            }`}
          >
            <span>English (US / Global)</span>
            {language === 'en' && <FiCheck className="w-5 h-5 text-ocean-primary" />}
          </button>

          <button
            onClick={() => toggleLanguage('ta')}
            className={`flex-1 p-4 rounded-xl border flex items-center justify-between font-semibold text-sm transition-all ${
              language === 'ta'
                ? 'bg-ocean-primary/10 border-ocean-primary text-ocean-primary shadow-sm'
                : 'bg-ocean-card border-ocean-border text-ocean-text hover:bg-ocean-bg'
            }`}
          >
            <span>தமிழ் (Tamil Language)</span>
            {language === 'ta' && <FiCheck className="w-5 h-5 text-ocean-primary" />}
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
