import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../component/Navbar";
import axios from "axios";
import "./Info.css"
const ProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);


  // First useEffect: Check token validity
  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect to login if token doesn't exist
        return;
      }

      try {
        // Verify the token with the backend
        await axios.post(
          "http://localhost:50001/upload/file/verifytoken",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Token is valid; no further action
      } catch (error) {
        console.error("Error during token verification:", error);
        localStorage.removeItem("token"); // Remove invalid token
        navigate("/login"); // Redirect to login
      }
    };
    

    checkTokenAndRedirect();
  }, [navigate]);

  const handlepostinfo=(e,id)=>{
    e.stopPropagation();
    navigate(`/detail/review/${id}`)
  
  }
  // Second useEffect: Fetch user data and posts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:50001/upload/file/people/${id}`
        );
      
        const userInfo = response.data;

        setUser(userInfo);
      
      } catch (error) {
        localStorage.removeItem("token"); 
        navigate("/login");
      }
    };

    fetchUserData();
  }, [id]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:50001/upload/file/people/profile/${id}`
        );
      
        const userInfo = response.data;

        setUserPosts(userInfo);
      
      } catch (error) {
       console.log(error.response.data.message)
      }
    };

    fetchUserData();
  }, [id]);
useEffect(()=>{
if(user&&userPosts){
  console.log(user,userPosts)
}
},[user,userPosts])

  return (
    <div>
      <Navbar/>
      <div className="userdiv">
        <div className="userprofilediv">
        {user&&(<div><img src={`http://localhost:50001/${user.profile}`} alt="" className="imageprofile" /> <p className="usernameclass">{user.name}</p></div>)}
        </div>




        <div className="usercollectiondivs">
        {userPosts.length > 0 ? (userPosts &&userPosts.map((current, index) => {
              return (
                <div className="container" key={index} >
                      <img src={`http://localhost:50001/${current.thumbnail}`} alt="Selected" className="thumbnailpicture" onClick={(e)=>{handlepostinfo(e,current._id)}} />
                      <p className="paragraphtitle">{current.title.length>30?current.title.slice(0,34)+"....":current.title}</p>
                </div>
              )
            })) : (<div className="nodiv"><p className="nocontent">Uff! User doesn't create Post</p></div>)}
        </div>


      </div>
    </div>
  );
};

export default ProfilePage;