import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (request, response) => {
  // check if the  user already exist
  const query = "SELECT * FROM  users WHERE username = ?";

  db.query(query, [request.body.username], (error, data) => {
    if (error) return response.status(500).json(error);
    if (data.length) return response.status(409).json("User already exist");

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(request.body.password, salt);

    const query =
      "INSERT INTO users (`username`, `email`, `password`, `name`) VALUE (?)";

    const values = [
      request.body.username,
      request.body.email,
      hashPassword,
      request.body.name,
    ];

    db.query(query, [values], (error, data) => {
      if (error) return response.status(500).json(error);
      return response.status(200).json("User has been created!");
    });
  });
};

export const login = (request, response) => {
  const query = "SELECT *  From users WHERE  username = ?";

  db.query(query, [request.body.username], (error, data) => {
    if (error) return response.status(500).json(error);
    if (data.length === 0) return response.status(404).json("User not found!");

    const checkPassword = bcrypt.compareSync(
      request.body.password,
      data[0].password
    );
    if (!checkPassword)
      return response.status(400).json("Wrong Username or Password!");

    const token = jwt.sign({ id: data[0].id }, "sha1BaddestDeveloper");

    const { password, ...others } = data[0];
    response
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const logout = (request, response) => {
  response
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User  has been logged out!");
};
