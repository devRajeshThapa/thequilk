import * as React from "react";
import Home from "./page/Home";
import Search from "./page/Search";
import Wishlist from "./page/Wishlist";
import Profile from "./page/Profile";
import People from "./page/People";
import Review from "./page/Review";
import Info from "./page/Info";
import "./App.css"
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Login from "./page/login";
import Signup from "./page/signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: ( <Home/>  ),
  },
  {
    path: "/wishlist",
    element:(<Wishlist/>),
  },
  {
    path: "/search",
    element: (<Search/>),
  },
  {
    path: "/profile",
    element:(<Profile/>),
  },
  {
    path: "/people",
    element: (<People/>),
  },
 {
  path:"/detail/review/:id",
  element:(<Review/>)
 }
,{
  path:"*",
  element:<Navigate to="/" replace />
},
{
path:"/signup",
element:<Signup/>
},
{
  path:"/profile/info/:id",
  element:(<Info/>)
}
,
{
  path:"/login",
  element:<Login/>
}
]);
export default function App(){
  return(
    <div className="app">
    <RouterProvider router={router}>
   </RouterProvider>
   </div>
  )
}