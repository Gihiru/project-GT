import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="" />
          <p className="w-full md:w-2/3 text-gray-600 text-justify">
            We are a team of certified electrical engineers and technicians
            committed to safety, precision, and reliable power solutions. With
            decades of combined experience, we bring expertise you can
            trust—delivering compliant, efficient, and lasting results for every
            project. Your safety is our priority.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <NavLink to="/">
              <li>Home</li>
            </NavLink>
            <NavLink to="/collection">
              <li>Products</li>
            </NavLink>
            <NavLink to="/about">
              <li>About us</li>
            </NavLink>
            <NavLink to="/contact">
              <li>Contact us</li>
            </NavLink>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>
              No.576, Hirimbura road,
              <br />
              Karapitiya,
              <br />
              Galle,
              <br /> Sri Lanka.
            </li>
            <li>+94 76 067 4326</li>
            <li>gtelectricals9@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2025 @ GT-Electricals - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
