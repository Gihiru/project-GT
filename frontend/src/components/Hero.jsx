import React from "react";
import { assets } from "../assets/assets";
import ElectricitySparks from "./ElectricitySparks";
import { Button } from "./ui/Button";
import { Typography } from "./ui/Typography";
import { Link, NavLink } from "react-router-dom";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-yellow-600/30 bg-gray-900 hero-glow rounded-lg relative overflow-hidden">
      <ElectricitySparks />
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-white">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-yellow-500"></p>
            <Typography variant="small" className="font-medium text-yellow-400">We are here to,</Typography>
          </div>
          <Typography variant="h1" className="poppins text-3xl sm:py-3 lg:text-4xl leading-relaxed">
            Powering Homes <span className="text-yellow-500">Wiring Future</span>
          </Typography>
          <div className="flex items-center gap-2 mt-4">
            <p className="w-8 md:w-11 h-[1px] bg-yellow-500"></p>
            <NavLink to ="/collection">
              <Button size="lg" className="font-semibold">
                SHOP NOW
              </Button>
            </NavLink>
            <p className="w-8 md:w-11 h-[1px] bg-yellow-500"></p>
          </div>
        </div>
      </div>
      {/* Hero Right Side */}
      <div className="w-full sm:w-1/2 relative">
        <img className="w-full opacity-90" src={assets.hero_img} alt="" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-900/50"></div>
      </div>
    </div>
  );
};

export default Hero;
