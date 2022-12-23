import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { DarkModeContext } from "../../context/DarkmodeContext";
import { AuthContext } from "../../context/AuthContext";
import { makeRequest } from "../../Axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { darkMode, toggle } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [openSearch, setOpenSearch] = useState(false);
  const [openLogoutMenu, setOpenLogoutMenu] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
   const response =  await makeRequest.post("/auths/logout");
   response.status === 200 && localStorage.setItem("user", null)
    navigate("/login");
  };
  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Sha1Social</span>
        </Link>
        <HomeOutlinedIcon />
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <GridViewOutlinedIcon />
        <div
          className={"search " + (openSearch && "active")}
          onClick={() => setOpenSearch(!openSearch)}
        >
          <SearchOutlinedIcon />
          <input placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <PersonOutlinedIcon />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="user">
          <img src={"/upload/" + currentUser.profilePic} alt="" />
          <button onClick={() => setOpenLogoutMenu(!openLogoutMenu)}>
            {currentUser.name}
          </button>
          {openLogoutMenu && currentUser.id && (
            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
