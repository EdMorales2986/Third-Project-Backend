import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import users, { IUser } from "../models/users";

function createToken(user: IUser) {
  return jwt.sign(
    { id: user.id, alias: user.alias },
    `${process.env.JWTSECRET}`,
    { expiresIn: "10000" }
  );
}

function validateEmail(email: string) {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(String(email).toLowerCase());
}

export const signUp = async function (
  req: Request,
  res: Response
): Promise<Response> {
  const { password, email, name, alias } = req.body;

  if (!password || !email || !name || !alias) {
    return res.status(400).json({ msg: "Please send valid data" });
  }

  const userAlias = await users.findOne({ alias });
  const userEmail = await users.findOne({ email });
  if (userAlias || userEmail) {
    return res
      .status(400)
      .json({ msg: "The user/email is already registered" });
  } else if (password.length < 8) {
    return res
      .status(400)
      .json({ msg: "The password must be at least 8 characters" });
  } else if (password.length > 16) {
    return res
      .status(400)
      .json({ msg: "The password must be less than 16 characters" });
  } else if (!validateEmail(email)) {
    return res.status(400).json({ msg: "The email is not valid" });
  }

  const newUser = new users(req.body);
  try {
    await newUser.save();
    // console.log("user saved");
    return res.status(200).json({ msg: "User created" });
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const signIn = async function (req: Request, res: Response) {
  const { alias, password } = req.body; //e.g. "ED_123"
  const user = await users.findOne({ alias });

  if (!alias || !password) {
    return res.status(400).json({ msg: "Please send valid data" });
  }

  if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({ msg: "Wrong Password" });
  }

  const token = createToken(user);
  return res.json({ jwt: token, user });
};

export const deleteUser = async function (req: Request, res: Response) {
  const { user } = req.params; //e.g. "ED_123"
  const { password } = req.body;

  const foundUser = await users.findOne({ alias: user });
  if (!password) {
    return res.status(400).json({ msg: "Please send valid data" });
  } else if (!foundUser) {
    return res.status(400).json({ msg: "User not found" });
  }

  const isMatch = await foundUser.comparePassword(password);
  if (foundUser && isMatch) {
    await users.deleteOne({ alias: user });
    return res.status(200).json({ msg: "User deleted" });
  }

  return res
    .status(400)
    .json({ msg: "Encountered an error during this process" });
};

export const updateName = async function (req: Request, res: Response) {
  const { user } = req.params;
  const { name, oldPass } = req.body;

  const foundUser = await users.findOne({ alias: user });

  if (!foundUser) {
    return res.status(400).json({ msg: "User not found" });
  }

  const isMatch = await foundUser.comparePassword(oldPass);

  if (isMatch) {
    foundUser.name = name;
    await foundUser.save();
    return res.status(200).json({ msg: "Name updated" });
  }

  return res
    .status(400)
    .json({ msg: "Encountered an error during this process" });
};

export const updateEmail = async function (req: Request, res: Response) {
  const { user } = req.params;
  const { email, oldPass } = req.body;

  const foundUser = await users.findOne({ alias: user });
  if (!foundUser) {
    return res.status(400).json({ msg: "User not found" });
  }

  const userEmail = await users.findOne({ email: email });
  if (userEmail) {
    return res
      .status(400)
      .json({ msg: "The user/email is already registered" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ msg: "The email is not valid" });
  }

  const isMatch = await foundUser.comparePassword(oldPass);
  if (isMatch) {
    foundUser.email = email;
    await foundUser.save();
    return res.status(200).json({ msg: "Email updated" });
  }

  return res
    .status(400)
    .json({ msg: "Encountered an error during this process" });
};

export const updateProfilePic = async function (req: Request, res: Response) {
  const { user } = req.params;
  const { profilePic } = req.body;

  const foundUser = await users.findOne({ alias: user });

  if (!foundUser) {
    return res.status(400).json({ msg: "User not found" });
  }

  foundUser.profilePic = profilePic;
  await foundUser.save();

  return res.status(200).json({ msg: "Profile picture updated" });
};

export const updatePassword = async function (req: Request, res: Response) {
  const { user } = req.params;
  const { newPass, oldPass } = req.body;

  const foundUser = await users.findOne({ alias: user });

  if (!foundUser) {
    return res.status(400).json({ msg: "User not found" });
  }

  const isMatch = await foundUser.comparePassword(oldPass);

  if (isMatch) {
    foundUser.password = newPass;
    await foundUser.save();
    return res.status(200).json({ msg: "Password updated" });
  }

  return res
    .status(400)
    .json({ msg: "Encountered an error during this process" });
};

export const searchUser = async function (req: Request, res: Response) {
  const { query } = req.body;

  try {
    const user = await users.find({
      alias: { $regex: query, $options: "i" },
    });
    // const test = user[0].get("lastName");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ msg: "User not found" });
  }
};
