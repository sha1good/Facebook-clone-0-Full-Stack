import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const getUser = (request, response) => {
  const userId = request.params.userId;

  const query = "SELECT * FROM users WHERE id=?";
  db.query(query, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return response.json(info);
  });
};

export const updateUser = (request, response) => {
  const token = request.cookies.accessToken;

  if (!token) return response.status(401).json("You are not Logged In!");

  jwt.verify(token, "sha1BaddestDeveloper", (error, userInfo) => {
    if (error) return response.status(403).json("Token is not valid!");

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(request.body.password.toString(), salt);

    const query =
      "UPDATE users SET `email`=?,`password`=?,`name`=?,`city`=?,`website`=?,`coverPic`=?,`profilePic`=? WHERE id=?";

    db.query(
      query,
      [
        request.body.email,
        hashPassword,
        request.body.name,
        request.body.city,
        request.body.website,
        request.body.coverPic,
        request.body.profilePic,
        userInfo.id,
      ],
      (error, data) => {
        if (error) return response.status(500).json(error);
        if (data.affectedRows > 0) return response.json("Updated!");
        return response.status(403).json("You can only update your account!");
      }
    );
  });
};
