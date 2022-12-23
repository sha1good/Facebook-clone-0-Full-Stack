import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../Axios";

const Share = () => {
  const [file, setFile] = useState(null);

  const [desc, setDesc] = useState("");

  const { currentUser } = useContext(AuthContext);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await makeRequest.post("/upload", formData);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const queryClient = useQueryClient();

  //below we are fetching post from database and show it immediately
  const mutation = useMutation(
    (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleShare = async (event) => {
    event.preventDefault();
    let imgUrl = "";

    if (file) imgUrl = await upload();
    mutation.mutate({ desc, img: imgUrl });
    setDesc("");
    setFile(null);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={"/upload/"+ currentUser.profilePic} alt="" />
            <input
              type="text"
              placeholder={`what is on your mind ${currentUser.name}?`}
              onChange={(event) => setDesc(event.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(event) => setFile(event.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleShare}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
