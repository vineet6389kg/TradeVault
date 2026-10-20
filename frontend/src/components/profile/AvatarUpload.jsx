import React, { useRef, useState } from "react";
import { FiCamera, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";

const AvatarUpload = () => {
  const { user, updateUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  const handleSelect = async (e) => {
    const file = e.target.files[0];
    e.target.value = ""; // lets you pick the same file again later
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }

    setBusy(true);
    try {
      const form = new FormData();
      form.append("avatar", file);
      const { data } = await api.put("/users/avatar", form);
      updateUser(data.user);
      toast.success("Photo updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    setBusy(true);
    try {
      const { data } = await api.delete("/users/avatar");
      updateUser(data.user);
      toast.success("Photo removed");
    } catch (error) {
      toast.error("Could not remove photo");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-white p-6 text-center">
      <div className={busy ? "opacity-50 transition-opacity" : "transition-opacity"}>
        <Avatar user={user} size={112} />
      </div>

      <p className="mt-4 font-bold text-fg">{user.name}</p>
      <p className="text-sm text-muted">{user.email}</p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => inputRef.current.click()}
          disabled={busy}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-fg hover:bg-primary-hover disabled:opacity-60"
        >
          <FiCamera /> {busy ? "Working..." : "Change photo"}
        </button>

        {user.avatar && (
          <button
            onClick={handleRemove}
            disabled={busy}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-fg hover:bg-surface hover:text-loss disabled:opacity-60"
          >
            <FiTrash2 /> Remove
          </button>
        )}
      </div>

      <p className="mt-3 text-xs text-muted">JPG, PNG or WebP, up to 5 MB</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleSelect}
        className="hidden"
      />
    </div>
  );
};

export default AvatarUpload;