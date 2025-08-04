import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t border-yellow-600/30">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-300">
          <p className="text-justify">
            Welcome to GT Electrical, your trusted partner for all your
            electrical needs! Established in May 2025, we specialize in
            providing high-quality electrical products and professional services
            to residential, commercial, and industrial clients.
          </p>
          <p className="text-justify">
            At GT Electrical, we offer a wide range of products, including
            wires, switches, lighting solutions, circuit breakers, and
            energy-efficient appliances, sourced from top brands to ensure
            reliability and safety. Our expert team also provides electrical
            installations, repairs, maintenance, and wiring services, ensuring
            your systems run smoothly and efficiently.
          </p>
          <b className="text-yellow-400">Our Mission</b>
          <p className="text-justify">
            At GT Electrical, we deliver top-quality electrical products and
            expert services with a focus on safety, innovation, and
            affordability. Since 2025, we’ve powered homes and businesses with
            reliable wiring, lighting, and energy-efficient solutions—backed by
            professional installations and repairs. Your trust drives us to keep
            your world running smoothly.
          </p>
        </div>
      </div>

      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border border-yellow-600/30 bg-gray-800/30 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b className="text-yellow-400">Quality Assurance:</b>
          <p className="text-gray-300">
            We stock only top-grade electrical components from trusted brands,
            ensuring safety, durability, and optimal performance for all your
            residential and commercial electrical needs.
          </p>
        </div>
        <div className="border border-yellow-600/30 bg-gray-800/30 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b className="text-yellow-400">Convenience:</b>
          <p className="text-gray-300">
            Our certified electricians provide professional advice and technical
            assistance, helping you select the right products and solutions for
            your specific electrical requirements.
          </p>
        </div>
        <div className="border border-yellow-600/30 bg-gray-800/30 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b className="text-yellow-400">Exceptional Customer Service:</b>
          <p className="text-gray-300">
            From installation guidance to troubleshooting support, our team
            remains available to ensure your complete satisfaction long after
            your purchase.
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
