import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (request, response) => {
  const query = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId)
       WHERE c.postId = ? ORDER BY c.createdAt DESC`;
  db.query(query, [request.query.postId], (error, data) => {
    if (error) return response.status(500).json(error);
    return response.status(200).json(data);
  });
};

export const addComment = (request, response) => {
  const token = request.cookies.accessToken;

  if (!token) return response.status(401).json("You are not Logged In!");

  jwt.verify(token, "sha1BaddestDeveloper", (error, userInfo) => {
    if (error) return response.status(403).json("Token is not valid!");

    const query =
      "INSERT INTO comments (`desc`,`createdAt`,`userId`,`postId`) VALUES (?)";

    const values = [
      request.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      request.body.postId,
    ];

    db.query(query, [values], (error, data) => {
      if (error) return response.status(500).json(error);
      return response.status(200).json("Comment has been created!");
    });
  });
};
