import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends mongoose.Document {
  alias: string;
  name: string;
  email: string;
  password: string;
  profilePic: string;
  type: string;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  alias: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    inmutable: true,
  },
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    // minlength: [8, "Password must be at least 8 characters"],
    // maxlength: [16, "Password must be less than 16 characters"],
  },
  profilePic: {
    type: String,
    default: "https://i.imgur.com/V4RclNb.png",
  },
  type: {
    type: String,
    enum: ["user", "critic"],
    default: "user",
    required: true,
  },
});

userSchema.virtual("lastName").get(function () {
  return this.name.split(" ")[1];
});

// Register Password Encryption
// This will run before any document.save()
userSchema.pre<IUser>("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

// Login Password Validator
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>("users", userSchema);
