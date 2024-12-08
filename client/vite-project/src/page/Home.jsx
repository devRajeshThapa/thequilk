import { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
import axios from "axios";
import logo from "../assets/logo.png";
import video from "../assets/video.mp4";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const IP = import.meta.env.VITE_IP;
  const PORT = import.meta.env.VITE_PORT;

  const [userid, setuserid] = useState();
  const navigate = useNavigate();
  const [postdata, setpostdata] = useState([]);
  const [mixdata, setmixdata] = useState([]);
  const [adsdata, setadsdata] = useState([
    {
      imgsrc: logo,
      title:
        "set the title of the thing in the world anda and make sure that all the thing work",
      profileimage: logo,
    },
    {
      imgsrc: video,
      title: "Here is the sponsor of the detail and know more about it.",
      profileimage: logo,
    },
    {
      imgsrc: video,
      title: "Here is the sponsor of the detail and know more about it.",
      profileimage: logo,
    },
  ]);

  // Function to merge the post data and ads data
  const mixArray = (array1, array2) => {
    const result = [];
    let number = 0;
    for (let item = 0; item < array1.length; item++) {
      result.push(array1[item]); // Push the post data item
      if ((item + 1) % 8 === 0 && number < array2.length) {
        result.push(array2[number]); // Insert ads data after every 4th item
        number = (number + 1) % array2.length;
      }
    }
    return result;
  };
  const handledetail = (e, id) => {
    e.stopPropagation();
    navigate(`detail/review/${id}`);
  };
  const handleprofile = (e, id) => {
    e.stopPropagation();
    navigate(`/profile/info/${id}`);
  };

  const handlewishlist = async (e, id) => {
    e.stopPropagation();

    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      // If no token is found, redirect to login page
      navigate("/login");
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
            Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
          },
        }
      );
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        // The server responded with an error status code
        if (
          error.response.status === 400 &&
          error.response.data.message === "Post is already in your wishlist"
        ) {
          alert("Thidds post is already in your wishlist!");
        } else if (error.response.status === 403) {
          // If the token is invalid or expired, redirect to login
          alert("Token is invalid or expired. Please log in again.");
          navigate("/login");
        } else {
          // For any other errors
          alert("Error adding to wishlist.");
          navigate("/login");
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
        // If token is valid, save the user data
        setuserid(response.data.userId);
      } catch (error) {

        navigate("/login");
      }
    };

    checkTokenAndFetchData();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://${IP}:${PORT}/upload/file`);
        const reversedResponse = response.data.datas.reverse(); // Reverse the posts order
        setpostdata(reversedResponse);
      } catch (error) {
      }
    };

    fetchPosts();
  }, []);

  // Once postdata is updated, merge it with adsdata and update mixdata
  useEffect(() => {
    if (postdata.length > 0) {
      const mixedData = mixArray(postdata, adsdata);
      setmixdata(mixedData); // Update mixdata with merged data
    }
  }, [postdata]); // Run this effect when postdata changes

  return (
    <div className="home">
      <Navbar />
      <div className="postcontainer">
        {postdata.length > 10 && mixdata.length > 0 ? (
          mixdata.map((current, index) => {
            return (index + 1) % 9 === 0 ? (
              <div className="contentdivsponsored" key={index}>
                <a href="" target="_blank">
                  <div className="shows">
                    {current.imgsrc && current.imgsrc.endsWith(".mp4") ? (
                      <video
                        src={current.imgsrc}
                        alt="Selected"
                        className="showimage"
                        loop
                        muted
                        autoPlay
                      />
                    ) : (
                      <img
                        src={current.imgsrc}
                        className="showimage"
                        alt="Selected"
                      />
                    )}
                  </div>
                </a>
                <div className="title">
                  <p className="currenttitle">{current.title}</p>
                </div>
                <div className="creatordiv">
                  <img
                    src={`${current.profileimage}`}
                    alt="Selected"
                    className="userimage"
                  />
                  <p className="usernames">Sponsered</p>
                  <a href="" target="_blank">
                    <button className="showlink">Visit</button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="container" key={index}>
                <div className="removediv">
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="trash"
                    onClick={(e) => {
                      handlewishlist(e, current._id);
                    }}
                  />
                </div>
                <div className="thumbnaildiv">
                  <img
                    src={`http://${IP}:${PORT}/${current.thumbnail}`}
                    alt="Selected"
                    className="thumbnail"
                    onClick={(e) => {
                      handledetail(e, current._id);
                    }}
                  />
                </div>
                <div className="titlediv">
                  <p className="ptitle">
                    {current.title.length > 30
                      ? current.title.slice(0, 34) + "...."
                      : current.title}
                  </p>
                </div>
                <div className="creatordiv">
                  <img
                    src={`http://${IP}:${PORT}/${current.createdBy.profile}`}
                    alt="Selected"
                    className="creatorimage"
                    onClick={(e) => {
                      handleprofile(e, current.createdBy._id);
                    }}
                  />
                  <p className="creatorname">{current.createdBy.name}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="nodiv">
            <p className="nocontent">Uff! No Content</p>
          </div>
        )}
      </div>
    </div>
  );
}
