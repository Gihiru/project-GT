import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";

const OurPolicy = () => {
  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"OUR"} text2={"POLICY"} />
        <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
          <div>
            <img
              src={assets.guarantee_icon}
              className="w-12 m-auto mb-5"
              alt=""
            />
            <p className=" font-semibold">Guarantee</p>
            <p className=" text-gray-400">
              Full coverage on products & services,
              <br />
              no hidden terms
            </p>
          </div>
          <div>
            <img
              src={assets.service_icon}
              className="w-12 m-auto mb-5"
              alt=""
            />
            <p className=" font-semibold">After Service</p>
            <p className=" text-gray-400">
              We don't just sell,
              <br /> we ensure long-term performance
            </p>
          </div>
          <div>
            <img src={assets.support_img} className="w-12 m-auto mb-5" alt="" />
            <p className=" font-semibold">Best customer support</p>
            <p className=" text-gray-400">
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
