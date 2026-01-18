import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import {
  User,
  AtSign,
  Briefcase,
  MapPin,
  GraduationCap,
  FileText,
  Code,
  Link as LinkIcon,
  Mail,
  Save,
  ArrowLeft,
} from "lucide-react";

import Loader from "../components/common/Loader";
import { toast } from "sonner";

import {
  createOrUpdateProfile,
  getUserProfile,
  isUsernameTaken,
} from "../firebase/profilesAPI";

/* ================= ROLE OPTIONS ================= */

const ROLE_OPTIONS = [
  { value: "frontend", label: "Frontend Developer" },
  { value: "backend", label: "Backend Developer" },
  { value: "fullstack", label: "Full Stack Developer" },
  { value: "designer", label: "UI / UX Designer" },
  { value: "ml", label: "ML / AI Engineer" },
  { value: "iot", label: "IoT / Hardware Engineer" },
];

/* ================= ANIMATIONS ================= */

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const gridVariants = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ================= COMPONENT ================= */

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    role: "frontend",
    college: "",
    location: "",
    bio: "",
    skills: "",
    projects: "",
    linkedin: "",
    instagram: "",
    email: "",
  });

  /* ===== LOAD PROFILE ===== */
  useEffect(() => {
    const load = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const profile = await getUserProfile(user.id);

        if (profile) {
          setForm({
            full_name: profile.full_name || user.fullName || "",
            username: profile.username || "",
            role: profile.role || "frontend",
            college: profile.college || "",
            location: profile.location || "",
            bio: profile.bio || "",
            skills: (profile.skills || []).join(", "),
            projects: (profile.projects || []).join("\n"),
            linkedin: profile.linkedin || "",
            instagram: profile.instagram || "",
            email:
              profile.email ||
              user.primaryEmailAddress?.emailAddress ||
              "",
          });
        }
      } catch {
        toast.error("Failed to load profile");
      }
      setLoading(false);
    };

    load();
  }, [user]);

  /* ===== SUBMIT ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);

    try {
      const username = form.username.trim();

      if (username) {
        const taken = await isUsernameTaken(username, user.id);
        if (taken) {
          toast.error("Username already taken");
          setSaving(false);
          return;
        }
      }

      await createOrUpdateProfile(user.id, {
        full_name: form.full_name.trim(),
        username,
        role: form.role,
        college: form.college || null,
        location: form.location || null,
        bio: form.bio || null,
        skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
        projects: form.projects.split("\n").map(p => p.trim()).filter(Boolean),
        linkedin: form.linkedin || null,
        instagram: form.instagram || null,
        email: form.email,
        avatar_url: user.imageUrl,
      });

      toast.success("Profile updated!");
      navigate("/dashboard");
    } catch {
      toast.error("Failed to save profile");
    }

    setSaving(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#f1f5f9] bg-[radial-gradient(at_top_left,_#e2e8f0_0%,_transparent_50%),_radial-gradient(at_top_right,_#c7d2fe_0%,_transparent_50%)] flex items-center justify-center px-4">

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] shadow-xl p-10"
      >

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <User size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800">
              Edit Profile
            </h1>
            <p className="text-xs uppercase tracking-widest font-bold text-slate-500">
              Update your public information
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            <AnimatedInput icon={User} label="Full Name" value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })} />

            <AnimatedInput icon={AtSign} label="Username" value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })} />

            <AnimatedSelect label="Primary Role" value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {ROLE_OPTIONS.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </AnimatedSelect>

            <AnimatedInput icon={GraduationCap} label="College"
              value={form.college}
              onChange={(e) => setForm({ ...form, college: e.target.value })} />

            <AnimatedInput icon={MapPin} label="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })} />

            <AnimatedInput icon={Code} label="Skills (comma separated)"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })} />

            <AnimatedTextarea icon={FileText} label="Bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })} />

            <AnimatedTextarea icon={Briefcase} label="Projects (one per line)"
              value={form.projects}
              onChange={(e) => setForm({ ...form, projects: e.target.value })} />

            <AnimatedInput icon={LinkIcon} label="LinkedIn"
              value={form.linkedin}
              onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />

            <AnimatedInput icon={Mail} label="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />

          </motion.div>

          {/* ACTIONS */}
          <div className="flex justify-between items-center mt-12">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-600 font-bold"
            >
              <ArrowLeft size={18} /> Back
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              disabled={saving}
              className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest shadow-xl flex items-center gap-3"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Profile"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ================= REUSABLE INPUTS ================= */

const AnimatedInput = ({ icon: Icon, label, ...props }) => (
  <motion.div variants={inputVariants} className="bg-white/60 border border-slate-200 rounded-2xl p-4">
    <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">{label}</label>
    <div className="flex items-center gap-3 mt-1">
      <Icon size={16} className="text-slate-400" />
      <input {...props} className="w-full bg-transparent outline-none font-bold text-sm" />
    </div>
  </motion.div>
);

const AnimatedTextarea = ({ icon: Icon, label, ...props }) => (
  <motion.div variants={inputVariants} className="bg-white/60 border border-slate-200 rounded-2xl p-4 md:col-span-2">
    <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">{label}</label>
    <div className="flex items-start gap-3 mt-1">
      <Icon size={16} className="text-slate-400 mt-1" />
      <textarea {...props} rows={3} className="w-full bg-transparent outline-none font-bold text-sm resize-none" />
    </div>
  </motion.div>
);

const AnimatedSelect = ({ label, children, ...props }) => (
  <motion.div variants={inputVariants} className="bg-white/60 border border-slate-200 rounded-2xl p-4">
    <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">{label}</label>
    <select {...props} className="w-full bg-transparent outline-none font-bold text-sm mt-2">
      {children}
    </select>
  </motion.div>
);

export default ProfileSettings;
