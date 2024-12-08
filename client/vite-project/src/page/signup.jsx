import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleLeft,
  faGlassMartiniAlt,
  faLock,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { faGoogleScholar } from "@fortawesome/free-brands-svg-icons";
import "./Signup.css";
import { useState } from "react";
import axios from "axios";
export default function Signup() {
  const IP = import.meta.env.VITE_IP;
  const PORT = import.meta.env.VITE_PORT;

  const [profile, setprofile] = useState();
  const [name, setname] = useState();
  const [email, setemail] = useState();
  const [education, seteducation] = useState();
  const [password, setpassword] = useState();
  const [error, seterror] = useState();
  const navigate = useNavigate();
  const handleprofile = (e) => {
    const file = e.target.files[0];
    if (file.type.startsWith("image/")) {
      setprofile({ src: URL.createObjectURL(file), file });
    } else {
      alert("image only");
    }
  };
  const handlename = (e) => {
    if (e.target.value.length < 25) {
      setname(e.target.value);
    }
  };

  const handleemail = (e) => {
    const emailValue = e.target.value;
    setemail(emailValue);

    // Simple email validation regex
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(emailValue)) {
      seterror("Please enter a valid email address");
    } else {
      seterror(""); // Clear error if email is valid
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!profile || !name || !email || !education || !password) {
      alert("Please fill out all fields and select files.");
      return;
    }

    if (error && error.length > 0) {
      alert(error); // Show error if email is invalid
      return;
    }

    try {
      const formdata = new FormData();
      formdata.append("profile", profile.file);
      formdata.append("name", name);
      formdata.append("email", email);
      formdata.append("education", education);
      formdata.append("password", password);

      const response = await axios.post(
        `http://${IP}:${PORT}/upload/file/signup`,
        formdata,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      navigate("/login"); // Navigate to login page after successful sign-up
    } catch (error) {
      seterror(error.response.data.message);
      setname("");
      setemail("");
    }
  };

  const handleeducation = (e) => {
    if (e.target.value.length < 25) {
      seteducation(e.target.value);
    }
  };
  const handlepassword = (e) => {
    setpassword(e.target.value);
  };

  return (
    <div className="signup">
      <div className="signupcontainer">
        <div>
          <Link to="/login">
            <FontAwesomeIcon icon={faCircleLeft} className="circleleft" />
          </Link>
        </div>
        <div className="photo">
          <label htmlFor="profile">
            {profile ? (
              <img src={profile.src} alt="image" className="profilerealimage" />
            ) : (
              <FontAwesomeIcon icon={faUser} className="profileimage" />
            )}
          </label>
          <input
            type="file"
            name=""
            id="profile"
            className="profile"
            onChange={handleprofile}
          />
        </div>
        <div className="info">
          <div className="form">
            <div className="name">
              <label htmlFor="name">
                <FontAwesomeIcon icon={faUser} className="icon" />
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter Your Name"
                className="inputinfo"
                onChange={handlename}
                value={name}
              />
            </div>

            <div className="phoneno">
              <label htmlFor="phone">
                <FontAwesomeIcon icon={faGlassMartiniAlt} className="icon" />
              </label>

              <input
                type="email"
                id="phone"
                placeholder="Enter your Email"
                className="inputinfo"
                onChange={handleemail}
                value={email}
              />
            </div>

            <div className="education">
              <label htmlFor="education">
                <FontAwesomeIcon icon={faGoogleScholar} className="icon" />
              </label>
              <input
                type="text"
                id="education"
                placeholder="Education Qualification"
                className="inputinfo"
                value={education}
                onChange={handleeducation}
              />
            </div>

            <div className="password">
              <label htmlFor="password">
                <FontAwesomeIcon icon={faLock} className="icon" />
              </label>
              <input
                type="text"
                id="password"
                placeholder="Enter Password"
                className="inputinfo"
                value={password}
                onChange={handlepassword}
              />
            </div>

            {error && error.length > 10 && (
              <div className="error">
                <p className="errorparagraph">{error}</p>
              </div>
            )}

            <div className="submit">
              <button className="submitbutton" onClick={handlesubmit}>
                Signup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
