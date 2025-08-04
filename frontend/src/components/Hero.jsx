import React from "react";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-yellow-600/30 bg-gray-900 hero-glow rounded-lg">
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-white">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-yellow-500"></p>
            <p className="font-medium text-sm md:text-base text-yellow-400">We are here to,</p>
          </div>
          <h1 className="poppins text-3xl sm:py-3 lg:text-4xl leading-relaxed text-white">
            Powering Homes <span className="text-yellow-500">Wiring Future</span>
          </h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base text-yellow-400 hover:text-yellow-300 cursor-pointer transition-colors">SHOP NOW</p>
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
