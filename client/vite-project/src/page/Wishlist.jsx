import Navbar from "../component/Navbar";
import "./Wishlist.css";
import logo from "../assets/logo.png";
import video from "../assets/video.mp4";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useState, useEffect } from "react";
export default function Wishlist() {
  const IP = import.meta.env.VITE_IP;
  const PORT = import.meta.env.VITE_PORT;

  const [userid, setuserid] = useState();
  const [wishlistdata, setwishlistdata] = useState([]);

  const navigate = useNavigate();
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

        setuserid(response.data.userId);
      } catch (error) {

        navigate("/login");
      }
    };

    checkTokenAndFetchData();
  }, []);
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage
      if (!token) {
        navigate("/login"); // Redirect if no token
        return;
      }

      try {
        const response = await axios.get(
          `http://${IP}:${PORT}/upload/file/wishlist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setwishlistdata(response.data);
      } catch (error) {
        navigate("/login");
        alert("Error fetching wishlist");
      }
    };

    fetchWishlist(); // Fetch wishlist on mount
  }, []);
  const handledeletepost = async (e, id) => {
    e.stopPropagation();
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (!token) {
      navigate("/login"); // Redirect if no token
      return;
    }
    try {
      const response = await axios.delete(
        `http://${IP}:${PORT}/upload/file/wishlist/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setwishlistdata(response.data.reverse());
    } catch (error) {
      alert(error);
    }
  };
  const handlepostinfo = (e, id) => {
    e.stopPropagation();
    navigate(`/detail/review/${id}`);
  };
  const handleprofile = (e, id) => {
    e.stopPropagation();
    navigate(`/profile/info/${id}`);
  };
  return (
    <div>
      <Navbar />
      <div className="wish">
        <div className="realwish">
          {wishlistdata.length > 0 ? (
            wishlistdata &&
            wishlistdata.map((current, index) => {
              if (!current.postid) {
                return null;
              }
              return (
                <div className="container" key={index}>
                  <div className="removediv">
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="trash"
                      onClick={(e) => {
                        handledeletepost(e, current._id);
                      }}
                    />
                  </div>
                  <div className="thumbnaildiv">
                    <img
                      src={`http://${IP}:${PORT}/${current.postid.thumbnail}`}
                      alt="Selected"
                      className="thumbnail"
                      onClick={(e) => {
                        handlepostinfo(e, current.postid._id);
                      }}
                    />
                  </div>
                  <div className="titlediv">
                    <p className="ptitle">
                      {current.postid.title.length > 30
                        ? current.postid.title.slice(0, 34) + "...."
                        : current.postid.title}
                    </p>
                  </div>
                  <div className="creatordiv">
                    <img
                      src={`http://${IP}:${PORT}/${current.postid.createdBy.profile}`}
                      alt="Selected"
                      className="creatorimage"
                      onClick={(e) => {
                        handleprofile(e, current.postid.createdBy._id);
                      }}
                    />
                    <p className="creatorname">
                      {current.postid.createdBy.name}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="nodiv">
              <p className="nocontent">Uff! Create Some wishlist</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
