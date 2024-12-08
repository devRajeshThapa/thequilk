import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate,Link} from "react-router-dom";
import logo from "../assets/logo.png"
import "./Signup.css"
import { useState } from "react"
import axios from "axios";
export default function Signup(){
  const IP = import.meta.env.VITE_IP;
  const PORT = import.meta.env.VITE_PORT;

  const[email,setemail]=useState("");
  const[password,setpassword]=useState("");
  const[error,seterror]=useState("");
  const navigate=useNavigate();
  
 const handleemail=(e)=>{
  setemail(e.target.value)
 };
 
 const handlepassword=(e)=>{
  setpassword(e.target.value)
 }
 const handlesubmit = async (e) => {
  e.preventDefault();
  
  // Simple email regex validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email || !password) {
    alert("Please fill out all fields");
    return;
  }

  if (!emailRegex.test(email)) {
    seterror("Please enter a valid email address.");
    return;
  }

  try {
    const data = { email, password };
    const response = await axios.post(`http://${IP}:${PORT}/upload/file/login`, data);
    if (response && response.data) {
      localStorage.setItem("token", response.data.token);
      navigate("/profile");
    }
  } catch (error) {
    seterror(error.response.data.message);
  }
};

  return(
    <div className="signup">

<div className="signupcontainer">
    <div className="photo">
    
        <img src={logo} alt="image" className="profilerealimage"/>
     
    </div>
    <div className="info">

    <div className="form">

     <div className="phoneno">
     <label htmlFor="email"><FontAwesomeIcon icon={faUser} className="icon"/></label>
     <input type="email" id="email" placeholder="Enter email" className="inputinfo" value={email} onChange={handleemail} />
     </div>

     
     <div className="password">
     <label htmlFor="password"><FontAwesomeIcon icon={faLock} className="icon"/></label>
     <input type="text" id="password" placeholder="Enter Password" className="inputinfo" value={password} onChange={handlepassword}/>
     </div>

     {error&&error.length>10&&<div className="error">
     <p className="errorparagraph">{error}</p>
     </div>}

     <div className="submit" >
      <button  className="submitbutton" onClick={handlesubmit}>SignIn</button>
     </div>
    <div className="or">
      <button className="orbutton">Or</button>
    </div>
    <div className="create">
            <Link to="/signup"><button className="createbutton">Create a Account</button></Link>
    </div>
    </div>

    </div>
    </div>

    </div>
  )
}
