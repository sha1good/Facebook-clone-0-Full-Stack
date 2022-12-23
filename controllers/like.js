import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (request, response) => {
  const query = "SELECT userId FROM likes WHERE postId = ?";

  db.query(query, [request.query.postId], (error, data) => {
    if (error) return response.status(500).json(error);
    return response.status(200).json(data.map((like) => like.userId));
  });
};

export const addLike = (request, response) => {
  const token = request.cookies.accessToken;

  if (!token) return response.status(401).json("You are not Logged In!");

  jwt.verify(token, "sha1BaddestDeveloper", (error, userInfo) => {
    if (error) return response.status(403).json("Token is not valid!");

    const query = "INSERT INTO likes (`userId`, `postId`) VALUES (?)";

    const values = [userInfo.id, request.body.postId];

    db.query(query, [values], (error, data) => {
      if (error) return response.status(500).json(error);
      return response.status(200).json("Post has been Liked!");
    });
  });
};

export const deleteLike = (request, response) => {  

    
  const token = request.cookies.accessToken;

  if (!token) return response.status(401).json("You are not Logged In!");

  jwt.verify(token, "sha1BaddestDeveloper", (error, userInfo) => {
    if (error) return response.status(403).json("Token is not valid!");

    const query = "DELETE FROM likes WHERE `userId`= ? AND `postId`= ?";

   db.query(query, [userInfo.id, request.query.postId], (error, data) => {
      if (error) return response.status(500).json(error);
      return response.status(200).json("Post has been disliked!");
    });
  });
};
