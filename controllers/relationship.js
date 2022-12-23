import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationship = (request, response) => {
  const query = "SELECT followerUserId FROM relationships WHERE followedUserId= ?";

  db.query(query, [request.query.followedUserId], (error, data) => {
    if (error) return response.status(500).json(error);
    return response.status(200).json(data.map((relationship) => relationship.followerUserId));
  });
};

export const addRelationship = (request, response) => {
  const token = request.cookies.accessToken;

  if (!token) return response.status(401).json("You are not Logged In!");

  jwt.verify(token, "sha1BaddestDeveloper", (error, userInfo) => {
    if (error) return response.status(403).json("Token is not valid!");

    const query = "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?)";

    const values = [userInfo.id, request.body.userId];

    db.query(query, [values], (error, data) => {
      if (error) return response.status(500).json(error);
      return response.status(200).json("Following is successful!");
    });
  });
};

export const deleteRelationship = (request, response) => {  

    
  const token = request.cookies.accessToken;

  if (!token) return response.status(401).json("You are not Logged In!");

  jwt.verify(token, "sha1BaddestDeveloper", (error, userInfo) => {
    if (error) return response.status(403).json("Token is not valid!");

    const query = "DELETE FROM relationships WHERE `followerUserId`= ? AND `followedUserId`= ?";

   db.query(query, [userInfo.id, request.query.userId], (error, data) => {
      if (error) return response.status(500).json(error);
      return response.status(200).json("Unfollowed Successful!");
    });
  });
};
