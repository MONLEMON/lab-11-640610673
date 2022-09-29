import { readUsersDB } from "../../../backendLibs/dbLib";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default function login(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    //validate body

    const users = readUsersDB();

    //find users with username, password
    const foundUser = users.find(
      (x) => x.username === username && bcrypt.compareSync(password, x.password)
    );
    if (!foundUser)
      return res
        .status(400)
        .json({ ok: false, message: "Invalid Username or Password" });

    //sign token
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(
      { username: foundUser.username, isAdmin: foundUser.isAdmin },
      secret,
      { expiresIn: "1800s" }
    );
    //return response
    return res.json({
      ok: true,
      username: foundUser.username,
      isAdmin: foundUser.isAdmin,
      token,
    });
  }
}
