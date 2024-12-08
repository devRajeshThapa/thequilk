import Navbar from "../component/Navbar";
import "./People.css"
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function People(){
  const [userid, setuserid] = useState();
  const[peopledata,setpeopledata]=useState([]);
  const[peoplename,setpeoplename]=useState("");
  const navigate=useNavigate();
const handleinputdata=(e)=>{
  setpeoplename(e.target.value)
}
const handleprofile=(e,id)=>{
 navigate(`/profile/info/${id}`)
}
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
          "http://localhost:50001/upload/file/verifytoken",
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
  useEffect(()=>{
    const fetchpeople=async()=>{
try{
const response=axios.get("http://localhost:50001/upload/file/people");
const people=(await response).data.data;
setpeopledata(people.reverse())
}catch(error){
  console.log(error)
}
    }
    fetchpeople()
  },[])
  const filteredPeople = peopledata.filter((person) =>
  
    person.name.toLowerCase().includes(peoplename.toLowerCase())
  );
  console.log(filteredPeople)
  return(
    <div>
<Navbar/>

<div className="usercontainer">

<div className="inputdiv">
  <input type="text" name="" id=""className="searchname" placeholder="search name..." value={peoplename} onChange={handleinputdata}/>
</div>

<div className="userdiv">

{filteredPeople.length > 0 ? (peopledata &&filteredPeople.map((current, index) => {
              return (
                <div className="personcontainer" key={index} >
                      <img src={`http://localhost:50001/${current.profile}`} alt="Selected" className="personimage" onClick={(e)=>{handleprofile(e,current._id)}} />
                      <p className="personname">{current.name}</p>
                </div>
              )
            })) : (<div className="nodiv"><p className="nocontent">Uff !!! No User</p></div>)}

  
</div>





</div>

    </div>
  )
}