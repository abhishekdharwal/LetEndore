import User from "../models/user.js";
import {
  decryption,
  encryption,
  generateJwtToken,
  hashing,
  hashingMatch,
} from "../services/encryption.js";

export const signup = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const encryptedName = encryption(name);
  const encryptedEmail = encryption(email);
  const encryptedPhone = encryption(phone);
  const hashedPassword = await hashing(password);
  if (hashedPassword.created === false) {
    return res.status(500).send({ message: "unable to save user , try again" });
  }

  let user = new User();
  user.name = encryptedName;
  user.email = encryptedEmail;
  user.phone = encryptedPhone;
  user.password = hashedPassword.hashedPassword;
  try {
    await user.save();
    return res.status(200).send({ message: "user saved successfully" });
  } catch (error) {
    return res.status(500).send({ message: "SERVER ERROR" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const encryptedEmail = encryption(email);
  let user;
  try {
    user = await User.findOne({ email: encryptedEmail });
    if (!user) {
      return res.status(500).send({ message: "user not found" });
    }
  } catch (error) {
    return res.status(500).send({ message: "user not found , signup first" });
  }
  if (user && (await hashingMatch(password, user.password))) {
    const decryptedEmail = decryption(user.email);
    const decryptedName = decryption(user.name);
    const decryptedPhone = decryption(user.phone);
    let token = await generateJwtToken(
      decryptedName,
      decryptedEmail,
      decryptedPhone
    );
    return res.status(200).send(token);
  } else {
    return res.status(500).send({ message: " Incorrect Password" });
  }
};
export const updateUser = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const encryptedName = encryption(name);
  const encryptedEmail = encryption(email);
  const encryptedPhone = encryption(phone);
  let user;
  try {
    user = await User.findOne({ email: encryptedEmail });
    if (!user) {
      return res.status(500).send({ message: "user not found" });
    }
  } catch (error) {
    return res.status(500).send({ message: "SERVER ERROR" });
  }
  if (await hashingMatch(password, user.password)) {
    user = await User.updateOne(
      { email: encryptedEmail },
      { $set: { name: encryptedName, phone: encryptedPhone } }
    );
    if (!user) {
      return res.status(400).send({ message: "user not updated" });
    }
    return res.status(200).send({ message: "User updated successfully" });
  } else {
    return res.status(500).send({ message: "Incorrect password" });
  }
};
export const updatePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  const encryptedEmail = encryption(email);
  let user;
  try {
    user = await User.findOne({ email: encryptedEmail });
    if (!user) {
      return res.status(500).send({ message: "user not found" });
    }
  } catch (error) {
    return res.status(500).send({ message: "SERVER ERROR" });
  }

  if (user && (await hashingMatch(oldPassword, user.password))) {
    const hashedPassword = await hashing(newPassword);
    user = await User.updateOne(
      { email: encryptedEmail },
      { $set: { password: hashedPassword.hashedPassword } }
    );
    return res
      .status(200)
      .send({ message: "user password updated successfully" });
  } else {
    return res.status(500).send({ message: "Incorrect Password" });
  }
};
