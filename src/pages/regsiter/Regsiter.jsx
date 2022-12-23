import { useState } from "react";
import { Link } from "react-router-dom";
import "./regsiter.scss";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState(null);

  const [data, setData] = useState(null);

  const handleChange = (event) => {
    setInputs((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8800/api/auths/register",
        inputs
      );
      setData(response.data);
    } catch (error) {
      setError(error.response.data);
    }
  };

  return (
   
      <div className="register">
        <div className="card">
          <div className="left">
            <h1>Sha1 Social.</h1>
            <p>
              In publishing and graphic design, Lorem ipsum is a placeholder
              text commonly used to demonstrate the visual form of a document or
              a typeface withou
            </p>
            <span>You have an account?</span>
            <Link to="/login">
              <button>Login</button>
            </Link>
          </div>
          <div className="right">
            <h1>Register</h1>
            <form>
              <input
                type="text"
                placeholder="Username"
                name="username"
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
              />
              <input
                type="text"
                placeholder="Name"
                name="name"
                onChange={handleChange}
              />
              <span>{data ? data : error}</span>
              <button onClick={handleRegister}>Register</button>
            </form>
          </div>
        </div>
      </div>
      
    
  );
};

export default Register;
