import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser,faSearch,faHeart,faUsers} from '@fortawesome/free-solid-svg-icons'
import { Link, useSearchParams,useNavigate} from 'react-router-dom';
import "./Navbar.css"
import logo from "../assets/logo.png";
import { useState } from 'react';
export default function Navbar(){
  const[searchvalue,setsearchvalue]=useState();
  const navigate=useNavigate();
   const handleinputchange=(e)=>{
    setsearchvalue(e.target.value);
  };
  const handlekeydown=(e)=>{
    if(e.key==="Enter"){
      navigate(`/search?query=${searchvalue}`)
      setsearchvalue("");
    };
  
  }
  const handlesearch=(e)=>{
    if(searchvalue){
    navigate(`/search?query=${searchvalue}`);
    setsearchvalue("");
    }else{
      <div>search here</div>
    }
  }
  
  return(
    <div className='navbar'>
      <div className='start'>
    <Link to="/" className='link'><img src={logo} alt="" className='image'/></Link>
    <Link to="/wishlist" className='link'><FontAwesomeIcon icon={faHeart} className='heart'/></Link>
      </div>
      <div className='middle'>
        <input type="text" className='input' placeholder='Search here...' value={searchvalue} onChange={handleinputchange} onKeyDown={handlekeydown}/>
        <div className='searchdiv'><FontAwesomeIcon icon={faSearch} className='search' onClick={handlesearch}/> </div>
          
      </div>
      <div className="end">
      <Link to="/people" className='link'><FontAwesomeIcon icon={faUsers} className='users'/></Link>
      <Link to="/profile" className='link'><FontAwesomeIcon icon={faUser} className='user'/></Link>
      </div>
      <div>
  
      </div>
      
    </div>
  )
}