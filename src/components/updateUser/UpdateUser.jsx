import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { makeRequest } from "../../Axios";
import "./updateuser.scss";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const UpdateUser = ({ setOpenUpdateUser, user }) => {
  const [coverPicuture, setCoverPicture] = useState(null);
  const [profilePicuture, setProfilePicture] = useState(null);

  const [texts, setTexts] = useState({
    email: user.email,
    password: user.password,
    name: user.name,
    city: user.city,
    website: user.website,
  });

  const handleChange = (event) => {
    setTexts((prev) => ({ ...prev, [event.target.name]: [event.target.value] }));
  };

  console.log(texts);
  
  const upload = async (file) => {
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
    (user) => {
      return makeRequest.put("/users", user);
     
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
      },
    }
  );

  const handleUpdate = async (event) => {
    event.preventDefault();
    let coverUrl;
    let profileUrl;

    coverUrl = coverPicuture ? await upload(coverPicuture) : user.coverPic; //if user upload new cover picture
    profileUrl = profilePicuture
      ? await upload(profilePicuture)
      : user.profilePic; //if user upload new profile picture
    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    setOpenUpdateUser(false);
    setCoverPicture(null);
    setProfilePicture(null);
  };

  

  return (
    <div className="updateuser">
      <div className="Wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    coverPicuture
                      ? URL.createObjectURL(coverPicuture)
                      : "/upload/" + user.coverPic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              onChange={(event) => setCoverPicture(event.target.files[0])}
              id="cover"
              style={{display: "none"}}
            />
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    profilePicuture
                      ? URL.createObjectURL(profilePicuture)
                      : "/upload/" + user.profilePic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              onChange={(event) => setProfilePicture(event.target.files[0])}
              id="profile"
              style={{display: "none"}}
            />
          </div>
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={texts.email}
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={texts.password}
            onChange={handleChange}
          />
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={texts.name}
            onChange={handleChange}
          />
          <label>Country / City</label>
          <input
            type="text"
            name="city"
            value={texts.city}
            onChange={handleChange}
          />
          <label>Website</label>
          <input
            type="text"
            name="website"
            value={texts.website}
            onChange={handleChange}
          />
          <button onClick={handleUpdate}>Update</button>
        </form>
        <button className="close" onClick={() => setOpenUpdateUser(false)}>X</button>
      </div>
    </div>
  );
};

export default UpdateUser;
