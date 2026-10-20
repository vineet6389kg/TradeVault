import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // password is hidden unless we ask for it
    },
    avatar: { type: String, default: "" },
    avatarId: { type: String, default: "" }, // Cloudinary id, used to delete the old photo
  },
  { timestamps: true },
);

// runs automatically before saving: hash the password
userSchema.pre("save", async function () {
  // skip if the password was not changed (for example a profile update)
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// compares a typed password with the saved hash
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;