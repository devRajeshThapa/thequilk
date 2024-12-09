import Navbar from "../component/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./Profile.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Profile() {
  const IP = import.meta.env.VITE_IP;
  const PORT = import.meta.env.VITE_PORT;

  const [image, setimage] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [postdata, setpostdata] = useState([]);
  const [thumbnail, setthumbanil] = useState();
  const [userid, setuserid] = useState();
  const [filterdata, setfilterdata] = useState([]);
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

        // If token is valid, save the user data
        setuserid(response.data.userId);
      } catch (error) {

        navigate("/login");
      }
    };

    checkTokenAndFetchData();
  }, []);

  const handlefilechange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type.startsWith("image/") ||
        file.type.startsWith("video/") ||
        file.type === "application/pdf")
    ) {
      setimage((prev) => {
        const newImages = [...prev, { src: URL.createObjectURL(file), file }];
        if (selectedImage === null) {
          setSelectedImage(newImages[0]);
        }
        return newImages;
      });
      e.target.value = "";
    } else {
      alert("only the image,file and video are uploaded");
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handletitle = (e) => {
    const newtitle = e.target.value;
    if (newtitle.length <= 44) {
      settitle(newtitle);
    }
  };
  const handledescription = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    const newDescription = e.target.value;
    if (newDescription.length <= 300) {
      setdescription(newDescription); // Update the description state
    }
  };
  const handlethumbnail = (e) => {
    const filethumbnail = e.target.files[0];
    if (filethumbnail && filethumbnail.type.startsWith("image/")) {
      const objecturl = URL.createObjectURL(filethumbnail);
      setthumbanil({ src: objecturl, filethumbnail });
    } else {
      alert("enter image only");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !thumbnail || image.length === 0) {
      alert("Please fill out all fields and select files.");
      return;
    }

    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("description", description);
    formdata.append("thumbnail", thumbnail.filethumbnail);
    if (image) {
      for (let i = 0; i < image.length; i++) {
        formdata.append("file", image[i].file);
      }
    }
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a post.");
      navigate("/login"); // Redirect to login page if no token
      return;
    }

    try {
      const response = await axios.post(
        `http://${IP}:${PORT}/upload/file`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Add the token in the headers
          },
        }
      );

      setfilterdata((prev) => [response.data.data, ...prev]); // Use spread operator with empty array as fallback

      settitle("");
      setdescription("");
      setimage([]);
      setSelectedImage(null);
      setthumbanil(null);
    } catch (error) {
      localStorage.removeItem("token"); // Remove invalid token
      navigate("/login");
    }
  };

  const handledeletepost = async (e, id) => {
    e.stopPropagation();
    try {
      const response = await axios.delete(
        `http://${IP}:${PORT}/upload/file/${id}`
      );
      const responseremaining = response.data.remainingPosts;
      const remainalso = responseremaining.reverse();
      setpostdata(remainalso);
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://${IP}:${PORT}/upload/file`);
        const dataset = response.data.datas;
        setpostdata(dataset.reverse()); // Set posts directly from the response
      } catch (error) {
      }
    };
    fetchPosts();
  }, []);
  useEffect(() => {
    if (postdata.length > 0 && userid) {
      const filterdata = postdata.filter(
        (current) => current.createdBy._id === userid
      );

      setfilterdata(filterdata);
    }
  }, [postdata]);

  const handleinfodiv = (e, id) => {
    e.stopPropagation();
    navigate(`/detail/review/${id}`);
  };
  return (
    <div className="profile">
      <div className="navbar">
        <Navbar />
      </div>

      <div className="inputcontainer">
        <div className="imagefilldiv">
          <div className="inputholder">
            <div className="inputpic">
              {image.length > 0 ? (
                image.map((current, index) => (
                  <div
                    key={index}
                    className="divimage"
                    onClick={() => handleImageClick(current)}
                  >
                    {current.file.type.startsWith("image/") ? (
                      <img
                        src={current.src}
                        alt="image not found"
                        className="imageshow"
                      />
                    ) : current.file.type.startsWith("video/") ? (
                      <video autoPlay muted loop className="imageshow">
                        <source src={current.src} type={current.file.type} />
                      </video>
                    ) : (
                      <iframe src={current.src} className="imageshow"></iframe>
                    )}
                  </div>
                ))
              ) : (
                <div className="manager">
                  <div className="divimagetwo">
                    <p className="uploadparagraph">Upload</p>
                  </div>{" "}
                  <div className="divimagetwo">
                    <p className="uploadparagraph">Upload</p>
                  </div>
                </div>
              )}
            </div>
            <div className="inputselector">
              <label htmlFor="inputid" className="label">
                <FontAwesomeIcon icon={faPlus} className="plus" />{" "}
              </label>
              <input
                type="file"
                name="file"
                id="inputid"
                className="inputclass"
                onChange={handlefilechange}
                required
              />
            </div>
            <div className="showresult">
              {selectedImage ? (
                selectedImage.file.type.startsWith("video/") ? (
                  <video autoPlay muted loop className="bigshowvideo">
                    <source
                      src={selectedImage.src}
                      type={selectedImage.file.type}
                    />
                  </video>
                ) : selectedImage.file.type.startsWith("image/") ? (
                  <img
                    src={selectedImage.src}
                    alt="Selected"
                    className="bigshowimage"
                  />
                ) : (
                  <iframe
                    src={selectedImage.src}
                    allow="Selected"
                    className="bigshowimage"
                  ></iframe>
                )
              ) : (
                <div className="showresultonly"></div>
              )}
              <div className="title">
                <input
                  type="text"
                  className="titleinput"
                  placeholder="Set Title"
                  onChange={handletitle}
                  value={title}
                  required
                />
              </div>
            </div>
          </div>
          <div className="detaildiv">
            {image.length > 0 && title.length > 4 && (
              <div className="thumbnail">
                <div className="uploadthumbnail">
                  {thumbnail ? (
                    <img src={thumbnail.src} alt="" className="imageclass" />
                  ) : (
                    <div className="uploaded">
                      <p className="paragraph">Upload Thumbnail</p>{" "}
                    </div>
                  )}
                </div>
                <div className="selectthumbnail">
                  <label htmlFor="selectthumbnail">
                    <FontAwesomeIcon icon={faPlus} className="iconplus" />
                  </label>
                  <input
                    type="file"
                    name="thumbnail"
                    id="selectthumbnail"
                    className="thumbnailinput"
                    onChange={handlethumbnail}
                    required
                  />
                </div>
                <div className="description">
                  <textarea
                    className="descriptioninput"
                    placeholder="Set description of your project...."
                    onChange={handledescription}
                    value={description}
                    required
                  />
                </div>
              </div>
            )}

            <div className="finish">
              <form>
                <button className="button" onClick={handleSubmit}>
                  send data
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="inputpost">
          <div className="postholder">
            {postdata.length > 0 ? (
              filterdata &&
              filterdata.map((current, index) => {
                return (
                  <div
                    className="postdiv"
                    key={index}
                    onClick={(e) => {
                      handleinfodiv(e, current._id);
                    }}
                  >
                    <div className="showpostanddelete">
                      <div className="show">
                        <img
                          src={`http://${IP}:${PORT}/${current.thumbnail}`}
                          alt="Selected"
                          className="showimage"
                        />
                      </div>
                      <div className="delete">
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="trash"
                          onClick={(e) => {
                            handledeletepost(e, current._id);
                          }}
                        />
                      </div>
                    </div>

                    <div className="title">
                      <p className="ptitle">{current.title}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>
                <p className="wrongparagraph">Uff! Create Some Content</p>
              </div>
            )}
          </div>
        </div>

        <div className="sponsordiv">
          <h1 className="heading">Sponsored</h1>
          <p className="paragraph">contact:thequilk369@gmail.com</p>
          <div className="divsponrship"></div>
        </div>
      </div>
    </div>
  );
}
