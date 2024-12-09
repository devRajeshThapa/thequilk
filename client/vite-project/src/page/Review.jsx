import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import logo from "../assets/logo.png";
import video from "../assets/video.mp4";
import { useEffect, useState } from "react";
import "./Review.css";
import axios from "axios";

export default function Review() {
  const IP = import.meta.env.VITE_IP;
  const PORT = import.meta.env.VITE_PORT;

  const { id } = useParams();
  const [infodata, setInfodata] = useState(null);
  const [mixdata, setMixdata] = useState([]);
  const [selectedimage, setselectedimage] = useState(null);
  const [adsdata] = useState([
    {
      url: logo,
      links:
        "https://www.amazon.in/stores/page/FB61ADA2-F77A-413C-97C9-BB74C754829D?channel=Search_store_AMZ&gad_source=1&gclid=CjwKCAiA0rW6BhAcEiwAQH28IuBGGZOg5s-1L8qQdc2Lq_DIssCwnkpLxZotQc5tSAVPDD6ZS9DNSBoCoxMQAvD_BwE",
    },
    {
      url: video,
      links:
        "https://www.amazon.in/stores/page/FB61ADA2-F77A-413C-97C9-BB74C754829D?channel=Search_store_AMZ&gad_source=1&gclid=CjwKCAiA0rW6BhAcEiwAQH28IuBGGZOg5s-1L8qQdc2Lq_DIssCwnkpLxZotQc5tSAVPDD6ZS9DNSBoCoxMQAvD_BwE",
    },
  ]);

  const navigate = useNavigate();

  // Function to merge post data and ads data
  const mixArray = (array1, array2) => {
    const result = [];
    let adIndex = 0;
    for (let i = 0; i < array1.length; i++) {
      result.push(array1[i]); // Push post data item
      if ((i + 1) % 2 === 0 && adIndex < array2.length) {
        result.push(array2[adIndex]); // Insert ad data after every 2 images
        adIndex = (adIndex + 1) % array2.length; // Cycle through ads
      }
    }
    return result;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://${IP}:${PORT}/upload/file/${id}`
        );
        setInfodata(response.data.postdata);
      } catch (error) {
        navigate("/");
      }
    };

    fetchPosts();
  }, [id, navigate]);
  const handleprofile = (e, id) => {
    navigate(`/profile/info/${id}`);
  };
  useEffect(() => {
    const checkTokenAndFetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        await axios.post(
          `http://${IP}:${PORT}/upload/file/verifytoken`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
    if (infodata) {
      const mixedData = mixArray(infodata.images, adsdata);

      setselectedimage(mixedData[0]);
      setMixdata(mixedData);
    }
  }, [infodata, adsdata]);
  const handleselectedimage = (e, current) => {
    setselectedimage(current);
  };

  return (
    <div>
      <Navbar />

      <div className="detail">
        <div className="detaildiv">
          <div className="bigimagediv">
            {selectedimage &&
              (typeof selectedimage === "object" && selectedimage.url ? (
                <>
                  {selectedimage.url.endsWith(".png") ||
                  selectedimage?.endsWith(".jpg") ||
                  selectedimage?.endsWith(".jpeg") ||
                  selectedimage?.endsWith(".svg") ||
                  selectedimage?.endsWith(".webp") ||
                  selectedimage?.endsWith(".gif") ||
                  selectedimage?.endsWith(".avif") ? (
                    <a
                      href={selectedimage.links}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={selectedimage.url}
                        alt="Ad"
                        className="bigimagepic"
                      />
                    </a>
                  ) : (
                    <a
                      href={selectedimage.links}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <video
                        controls
                        muted
                        autoPlay
                        loop
                        src={selectedimage.url}
                        className="bigimagepic"
                      ></video>
                    </a>
                  )}
                </>
              ) : (
                <>
                  {selectedimage?.endsWith(".png") ||
                  selectedimage?.endsWith(".jpg") ||
                  selectedimage?.endsWith(".jpeg") ||
                  selectedimage?.endsWith(".svg") ||
                  selectedimage?.endsWith(".webp") ||
                  selectedimage?.endsWith(".gif") ||
                  selectedimage?.endsWith(".avif") ? (
                    <img
                      src={`http://${IP}:${PORT}/${selectedimage}`}
                      alt="Post"
                      className="bigimagepic"
                    />
                  ) : selectedimage?.endsWith(".mp4") ? (
                    <video
                      src={`http://${IP}:${PORT}/${selectedimage}`}
                      controls
                      muted
                      autoPlay
                      className="bigimagepic"
                    ></video>
                  ) : (
                    selectedimage?.endsWith(".pdf") && (
                      <iframe
                        src={`https://docs.google.com/viewer?url=http://${IP}:${PORT}/${selectedimage}&embedded=true`}
                        className="bigimagepic"
                      ></iframe>
                    )
                  )}
                </>
              ))}
          </div>
          <div className="titlesdiv">
            {infodata && <p className="titles">{infodata.title}</p>}
          </div>
          <div
            className="imagedivreview"
            style={{
              justifyContent: mixdata.length > 5 ? "flex-start" : "center",
            }}
          >
            {mixdata.length > 0 &&
              mixdata.map((current, index) => {
                // Check if it's an ad (adsdata)
                if (current.url) {
                  // Handle ads (image or video)
                  if (
                    current.url.endsWith(".png") ||
                    current.url.endsWith(".jpg") ||
                    current.url.endsWith(".jpeg") ||
                    current.url.endsWith(".svg") ||
                    current.url.endsWith(".gif") ||
                    current.url.endsWith(".webp") ||
                    current.url.endsWith(".avif")
                  ) {
                    return (
                      <img
                        src={current.url}
                        alt="Ad"
                        className="imageprev"
                        onClick={(e) => {
                          handleselectedimage(e, current);
                        }}
                      />
                    );
                  } else if (current.url.endsWith(".mp4")) {
                    return (
                      <video
                        src={current.url}
                        autoPlay
                        muted
                        loop
                        className="imageprev"
                        onClick={(e) => {
                          handleselectedimage(e, current);
                        }}
                      ></video>
                    );
                  }
                } else {
                  // Handle media items from infodata.images
                  if (
                    current.endsWith(".png") ||
                    current.endsWith(".jpg") ||
                    current.endsWith(".jpeg") ||
                    current.url.endsWith(".svg") ||
                    current.url.endsWith(".gif") ||
                    current.url.endsWith(".webp") ||
                    current.url.endsWith(".avif")
                  ) {
                    return (
                      <img
                        key={index}
                        src={`http://${IP}:${PORT}/${current}`}
                        alt="Image"
                        className="imageprevdata"
                        onClick={(e) => {
                          handleselectedimage(e, current);
                        }}
                      />
                    );
                  } else if (current.endsWith(".mp4")) {
                    return (
                      <video
                        key={index}
                        autoPlay
                        muted
                        loop
                        className="imageprevdata"
                        onClick={(e) => {
                          handleselectedimage(e, current);
                        }}
                      >
                        <source src={`http://${IP}:${PORT}/${current}`} />
                      </video>
                    );
                  } else if (current.endsWith(".pdf")) {
                    return (
                      <button
                        className="showbutton"
                        onClick={(e) => {
                          handleselectedimage(e, current);
                        }}
                      >
                        Show Pdf
                      </button>
                    );
                  }
                }
                return null;
              })}
          </div>
          <div className="profiledivcontainer">
            {infodata && (
              <>
                <img
                  src={`http://${IP}:${PORT}/` + infodata.createdBy.profile}
                  alt=""
                  className="profilepicture"
                  onClick={(e) => {
                    handleprofile(e, infodata.createdBy._id);
                  }}
                />{" "}
                <p className="profilename">{infodata.createdBy.name}</p>
              </>
            )}
          </div>
          <div className="descriptiondiv">
            {infodata && (
              <div>
                {" "}
                <p className="descriptiontext">
                  *Description*: {infodata.description} *
                </p>{" "}
              </div>
            )}
          </div>
        </div>
        <div className="sponsordivb">
          <h1 className="headingb">Sponsored</h1>
          <p className="paragraphb">contact:thequilk369@gmail.com</p>
          <div className="divsponrshipb"></div>
        </div>
      </div>
    </div>
  );
}
