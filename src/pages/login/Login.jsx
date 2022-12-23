import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.scss";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  
  });
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);

  const handleChange = (event) => {
    setInputs((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  };

  const { login } = useContext(AuthContext);

  const handleLogin = async (event) =>{
    event.preventDefault();

     try {
      await login(inputs);
     currentUser && navigate("/")
     } catch (error) {
       setError(error)
     }
  }
  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Hello World</h1>
          <p>
            In publishing and graphic design, Lorem ipsum is a placeholder text
            commonly used to demonstrate the visual form of a document or a
            typeface withou
          </p>
          <span>You don't have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input type="text" placeholder="Username" name="username"  onChange={handleChange}/>
            <input type="password" placeholder="Password" name="password"  onChange={handleChange} />
           <span>{ error && error }</span>
            <button onClick={ handleLogin }>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
