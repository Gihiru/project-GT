import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";

const OurPolicy = () => {
  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"OUR"} text2={"POLICY"} />
        <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base">
          <div>
            <img
              src={assets.guarantee_icon}
              className="w-12 m-auto mb-5 filter brightness-0 invert sepia-100 saturate-200 hue-rotate-45"
              alt=""
            />
            <p className="font-semibold text-yellow-400">Guarantee</p>
            <p className="text-gray-300">
              Full coverage on products & services,
              <br />
              no hidden terms
            </p>
          </div>
          <div>
            <img
              src={assets.service_icon}
              className="w-12 m-auto mb-5 filter brightness-0 invert sepia-100 saturate-200 hue-rotate-45"
              alt=""
            />
            <p className="font-semibold text-yellow-400">After Service</p>
            <p className="text-gray-300">
              We don't just sell,
              <br /> we ensure long-term performance
            </p>
          </div>
          <div>
            <img src={assets.support_img} className="w-12 m-auto mb-5 filter brightness-0 invert sepia-100 saturate-200 hue-rotate-45" alt="" />
            <p className="font-semibold text-yellow-400">Best customer support</p>
            <p className="text-gray-300">
              Quick response, real solutions, <br />
              your convenience matters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurPolicy;
