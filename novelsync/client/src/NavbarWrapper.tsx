import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
export const NavbarWrapper = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};
