import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    setUserId,
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken("");
    setUserId("");
    setCartItems({});
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src={assets.logo} className="w-36 logo-shine" alt="" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-100">
        <NavLink to="/" className="flex flex-col items-center gap-1 hover:text-yellow-400 transition-all duration-300 nav-glow font-medium">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-yellow-500 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1 hover:text-yellow-400 transition-all duration-300 nav-glow font-medium">
          <p>PRODUCTS</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-yellow-500 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1 hover:text-yellow-400 transition-all duration-300 nav-glow font-medium">
          <p>ABOUT US</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-yellow-500 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1 hover:text-yellow-400 transition-all duration-300 nav-glow font-medium">
          <p>CONTACT US</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-yellow-500 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <img
          onClick={() => {
            setShowSearch(true);
            navigate("/collection");
          }}
          src={assets.search_icon}
          className="w-5 cursor-pointer nav-glow hover:scale-110 transition-all duration-300 gold-icon"
          alt=""
        />

        <div className="group relative z-50">
          <img
            onClick={() => (token ? null : navigate("/login"))}
            className="w-5 cursor-pointer nav-glow hover:scale-110 transition-all duration-300 gold-icon"
            src={assets.profile_icon}
            alt=""
          />
          {/* Dropdown Menu */}
          {token && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-gray-800 text-gray-300 rounded border border-yellow-600/30 shadow-lg">
                <p
                  onClick={() => navigate("/account")}
                  className="cursor-pointer hover:text-yellow-400 transition-colors"
                >
                  My Account
                </p>
                <p
                  onClick={() => navigate("/orders")}
                  className="cursor-pointer hover:text-yellow-400 transition-colors"
                >
                  Orders
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-yellow-400 transition-colors">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5 nav-glow hover:scale-110 transition-all duration-300 gold-icon" alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-yellow-500 text-gray-900 aspect-square rounded-full text-[8px] font-semibold">
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden nav-glow hover:scale-110 transition-all duration-300"
          alt=""
        />
      </div>

      {/* Sidebar menu for small screens */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-gray-900 transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-300 bg-gray-900">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer hover:text-yellow-400 transition-colors"
          >
            <img className="h-4 rotate-180 filter brightness-0 invert" src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border border-yellow-600/30 hover:text-yellow-400 transition-colors"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border border-yellow-600/30 hover:text-yellow-400 transition-colors"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border border-yellow-600/30 hover:text-yellow-400 transition-colors"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border border-yellow-600/30 hover:text-yellow-400 transition-colors"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
