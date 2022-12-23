import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (request, response) => {
  const userId = request.query.userId;

  const token = request.cookies.accessToken;

  if (!token) return response.status(401).json("You are not Logged In!");

  jwt.verify(token, "sha1BaddestDeveloper", (error, userInfo) => {
    if (error) return response.status(403).json("Token is not valid!");

    const query = userId !== "undefined"
      ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ?  ORDER BY p.createdAt DESC`
      : `SELECT p.*, u.id AS userId, name, profilePic FROM  posts AS p JOIN users AS u ON (u.id = p.userId)
        LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId= ?
         ORDER BY p.createdAt DESC
        `;
    const values = userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    db.query(query, values, (error, data) => {
      if (error) return response.status(500).json(error);
      return response.status(200).json(data);
    });
  });
};

export const addPost = (request, response) => {
  const token = request.cookies.accessToken;

  if (!token) return response.status(401).json("You are not Logged In!");

  jwt.verify(token, "sha1BaddestDeveloper", (error, userInfo) => {
    if (error) return response.status(403).json("Token is not valid!");

    const query =
      "INSERT INTO posts (`desc`,`img`,`createdAt`,`userId`) VALUES (?)";

    const values = [
      request.body.desc,
      request.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(query, [values], (error, data) => {
      if (error) return response.status(500).json(error);
      return response.status(200).json("Post has been created!");
    });
  });
};



export const deletePost = (request, response) => {
  const token = request.cookies.accessToken;

  if (!token) return response.status(401).json("You are not Logged In!");

  jwt.verify(token, "sha1BaddestDeveloper", (error, userInfo) => {
    if (error) return response.status(403).json("Token is not valid!");

    const query = "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

   db.query(query, [request.params.id, userInfo.id], (error, data) => {
      if (error) return response.status(500).json(error);
      if(data.affectedRows > 0) return response.status(200).json("Post has been deleted")
      return response.status(403).json("You are allowed to delete only your post!");
    });
  });
};
 