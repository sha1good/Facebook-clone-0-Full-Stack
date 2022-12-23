import express from "express"
const app = express();

import  authRoutes from "./routes/auths.js"
import  userRoutes from "./routes/users.js"
import  commentRoutes from "./routes/comments.js"
import  likeRoutes from "./routes/likes.js"
import  postRoutes from "./routes/posts.js"
import  relationshipRoutes from "./routes/relationships.js"
import cors from "cors"
import cookieParser from "cookie-parser";
import multer from "multer";

app.use((request, response, next) =>{
    response.header("Access-Control-Allow-Credentials", true);
    next();
})

app.use(express.json())
app.use(cors({
  origin: "http://localhost:3000"
}))
app.use(cookieParser())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/auths", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/comments",commentRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/likes", likeRoutes)
app.use("/api/relationships", relationshipRoutes)


 app.listen(8800, () => {
    console.log("API working!");
  });