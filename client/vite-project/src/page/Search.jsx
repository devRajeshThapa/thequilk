import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../component/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Search() {
  const IP = import.meta.env.VITE_IP;
  const PORT = import.meta.env.VITE_PORT;
  const [searchparams, setsearchparams] = useSearchParams();
  const navigate = useNavigate();
  const [searchdata, setsearchdata] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // New state for filtered data

  const data = searchparams.get("query");

  useEffect(() => {
    const checkTokenAndFetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // If no token, redirect to login page
        navigate("/login");
        return;
      }

      try {
        // Send the token to backend for validation
        const response = await axios.post(
          `http://${IP}:${PORT}/upload/file/verifytoken`,
          {}, // No need to send data in the body, just the headers
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send the token in the Authorization header
            },
          }
        );
      } catch (error) {
        navigate("/login");
      }
    };

    checkTokenAndFetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://${IP}:${PORT}/upload/file`);
        const reversedResponse = response.data.datas.reverse(); // Reverse the posts order
        setsearchdata(reversedResponse);
      } catch (error) {
      }
    };

    fetchPosts();
  }, []); 

  useEffect(() => {
    if (searchdata.length > 0) {
      // Filter the data based on the query parameter
      const filtersearchdata = searchdata.filter((current) =>
        current.title.toLowerCase().includes(data?.toLowerCase() || "")
      );
      setFilteredData(filtersearchdata); // Update the filtered data state
    }
  }, [searchdata, data]); // Re-run this effect whenever searchdata or the query parameter changes
  const handledetail=(e,id)=>{
    e.stopPropagation();
    navigate(`detail/review/${id}`)
  }
 const handleprofile=(e,id)=>{
  e.stopPropagation();
  navigate(`/profile/info/${id}`)
 }
 
const handlewishlist = async (e, id) => {
  e.stopPropagation();

  // Get the token from localStorage
  const token = localStorage.getItem('token');
  
  if (!token) {
    // If no token is found, redirect to login page
    navigate('/login');
    return;
  }

  try {
    // Make the API request to add the post to the wishlist using Axios
    const response = await axios.post(
      `http://${IP}:${PORT}/upload/file/wishlist`, // Endpoint for adding to wishlist
      { postid: id }, // Body with the postid
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Attach the token in the Authorization header
        },
      }
    );
  } catch (error) {
    // Handle different types of errors
    if (error.response) {
      // The server responded with an error status code
      if (error.response.status === 400 && error.response.data.message === "Post is already in your wishlist") {
        alert("This post is already in your wishlist!");
      } else if (error.response.status === 403) {
        // If the token is invalid or expired, redirect to login
        alert("Token is invalid or expired. Please log in again.");
        navigate("/login");
      } else {
        // For any other errors
        alert("Error adding to wishlist.");
        navigate("/login")
      }
    } else if (error.request) {
      // The request was made but no response was received
      alert("No response from the server. Please try again.");
    } else {
      // Something else caused the error
      alert("An error occurred. Please try again.");
    }
  }
};
  return (
    <div>
      <Navbar />
      
    <div className="postcontainer">
      {filteredData.length > 0 ? (
        filteredData.map((current,index) => (
          <div className="container" key={index} >

          <div className="removediv">
            <FontAwesomeIcon icon={faHeart} className="trash" onClick={(e) => { handlewishlist(e, current._id) }} />
          </div>
          <div className="thumbnaildiv">
            <img src={`http://${IP}:${PORT}/${current.thumbnail}`} alt="Selected" className="thumbnail" onClick={(e)=>{handledetail(e,current._id)}} />
          </div>
        <div className="titlediv">
          <p className="ptitle">{current.title.length>30?current.title.slice(0,34)+"....":current.title}</p>
        </div>
        <div className="creatordiv">
        <img src={`http://${IP}:${PORT}/${current.createdBy.profile}`} alt="Selected" className="creatorimage" onClick={(e)=>{handleprofile(e,current.createdBy._id)}} />
        <p className="creatorname">{current.createdBy.name}</p>
        </div>

      </div>
        ))
      ) : (
        searchdata.map((current,index) => (
          <div className="container" key={index} >

          <div className="removediv">
            <FontAwesomeIcon icon={faHeart} className="trash" onClick={(e) => { handlewishlist(e, current._id) }} />
          </div>
          <div className="thumbnaildiv">
            <img src={`http://${IP}:${PORT}/${current.thumbnail}`} alt="Selected" className="thumbnail" onClick={(e)=>{handledetail(e,current._id)}} />
          </div>
        <div className="titlediv">
          <p className="ptitle">{current.title.length>30?current.title.slice(0,34)+"....":current.title}</p>
        </div>
        <div className="creatordiv">
        <img src={`http://${IP}:${PORT}/${current.createdBy.profile}`} alt="Selected" className="creatorimage" onClick={(e)=>{handleprofile(e,current.createdBy._id)}} />
        <p className="creatorname">{current.createdBy.name}</p>
        </div>

      </div>
        ))
        
      )}
      </div>
    </div>
  );
}
