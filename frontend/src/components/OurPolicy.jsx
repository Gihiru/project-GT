import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import { Typography } from "./ui/Typography";

const OurPolicy = () => {
  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"OUR"} text2={"POLICY"} />
        <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base">
          <div className="policy-icon">
            <img
              src={assets.guarantee_icon}
              className="w-12 m-auto mb-5 filter brightness-0 invert sepia-100 saturate-200 hue-rotate-45"
              alt=""
            />
            <Typography variant="h3" className="font-semibold text-base">
              Guarantee
            </Typography>
            <Typography variant="small">
              Full coverage on products & services,
              <br />
              no hidden terms
            </Typography>
          </div>
          <div className="policy-icon">
            <img
              src={assets.service_icon}
              className="w-12 m-auto mb-5 filter brightness-0 invert sepia-100 saturate-200 hue-rotate-45"
              alt=""
            />
            <Typography variant="h3" className="font-semibold text-base">
              After Service
            </Typography>
            <Typography variant="small">
              We don't just sell,
              <br /> we ensure long-term performance
            </Typography>
          </div>
          <div className="policy-icon">
            <img
              src={assets.support_img}
              className="w-12 m-auto mb-5 filter brightness-0 invert sepia-100 saturate-200 hue-rotate-45"
              alt=""
            />
            <Typography variant="h3" className="font-semibold text-base">
              Best customer support
            </Typography>
            <Typography variant="small">
              Quick response, real solutions, <br />
              your convenience matters.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurPolicy;
