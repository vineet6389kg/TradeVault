import React from "react";
import AvatarUpload from "../components/profile/AvatarUpload";
import ProfileForm from "../components/profile/ProfileForm";
import PasswordForm from "../components/profile/PasswordForm";

const Profile = () => {
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-fg">Profile</h1>
      <p className="mt-1 text-muted">Update your details, avatar, and password.</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <AvatarUpload />

        {/* the two forms take the other two columns */}
        <div className="space-y-5 lg:col-span-2">
          <ProfileForm />
          <PasswordForm />
        </div>
      </div>
    </div>
  );
};

export default Profile;