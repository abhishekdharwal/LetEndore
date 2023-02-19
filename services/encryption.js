import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
const algorithm = "aes-256-cbc";
import dotenv from "dotenv";
dotenv.config();

const securityKey = crypto
  .createHash("sha512")
  .update(process.env.SECURE_KEY)
  .digest("hex")
  .substring(0, 32);
const initVector = crypto
  .createHash("sha512")
  .update(process.env.IV)
  .digest("hex")
  .substring(0, 16);

export const encryption = (payload) => {
  const cipher = crypto.createCipheriv(algorithm, securityKey, initVector);
  return Buffer.from(
    cipher.update(payload, "utf8", "hex") + cipher.final("hex")
  ).toString("base64");
};
export const decryption = (payload) => {
  const buff = Buffer.from(payload, "base64");
  const decipher = crypto.createDecipheriv(algorithm, securityKey, initVector);
  return (
    decipher.update(buff.toString("utf8"), "hex", "utf8") +
    decipher.final("utf8")
  );
};

export const hashing = async (payload) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(payload, salt);
    return { hashedPassword: hashedPassword, created: true };
  } catch (err) {
    return { err: err, created: false };
  }
};
export const hashingMatch = async (oldpassword, hashedPassword) => {
  try {
    return await bcrypt.compare(oldpassword, hashedPassword);
  } catch (err) {
    return err;
  }
};
export const generateJwtToken = async (name, email, phone) => {
  const token = jwt.sign(
    {
      name: name,
      email: email,
      phone: phone,
    },
    process.env.SECURE_KEY,
    {
      expiresIn: "1h",
    }
  );
  return token;
};
