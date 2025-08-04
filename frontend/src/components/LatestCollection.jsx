import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { assets } from "../assets/assets";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const services = [
    {
      icon: assets.building_icon,
      title: "Building Wiring",
      desc: "Safe & efficient electrical wiring for homes & apartments",
    },
    {
      icon: assets.industry_icon,
      title: "Industrial Wiring",
      desc: "Expert wiring solutions for factories & industries",
    },
    {
      icon: assets.surge_icon,
      title: "Surge Arrestor",
      desc: "Protect equipment from power surges",
    },
    {
      icon: assets.lightning_icon,
      title: "Lighting Arrestor",
      desc: "Lightning strike protection for buildings",
    },
    {
      icon: assets.maintain_icon,
      title: "All Electrical Maintain",
      desc: "Full-service electrical upkeep",
    },
    {
      icon: assets.panel_icon,
      title: "Panel Board",
      desc: "Reliable power distribution panel installation",
    },
    {
      icon: assets.design_icon,
      title: "Electrical Design / Construction",
      desc: "Custom electrical system planning & building",
    },
    {
      icon: assets.report_icon,
      title: "Charted Engineer Test Reports",
      desc: "Certified electrical safety inspections",
    },
  ];

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"OUR"} text2={"SERVICES"} />

        <div className="px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="relative [&_.slick-slide]:px-3 [&_.slick-list]:mx-[-12px] [&_.slick-prev]:left-[-45px] [&_.slick-next]:right-[-45px] [&_.slick-prev]:w-10 [&_.slick-next]:w-10 [&_.slick-prev]:h-10 [&_.slick-next]:h-10 [&_.slick-prev]:bg-yellow-500 [&_.slick-next]:bg-yellow-500 [&_.slick-prev]:rounded-full [&_.slick-next]:rounded-full [&_.slick-prev]:shadow-lg [&_.slick-next]:shadow-lg hover:[&_.slick-prev]:bg-yellow-400 hover:[&_.slick-next]:bg-yellow-400 [&_.slick-prev]:z-10 [&_.slick-next]:z-10 [&_.slick-prev]:before:content-['←'] [&_.slick-next]:before:content-['→'] [&_.slick-prev]:before:text-gray-900 [&_.slick-next]:before:text-gray-900 [&_.slick-dots]:bottom-[-30px] [&_.slick-dots_li_button:before]:text-gray-500 [&_.slick-dots_li.slick-active_button:before]:text-yellow-500">
              <Slider {...settings}>
                {services.map((service, index) => (
                  <div key={index}>
                    <div className="mx-3">
                      <div className="flex flex-col items-center p-6 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20 rounded-lg bg-gray-800 min-h-[220px] border border-yellow-600/30 hover:border-yellow-500/50">
                        <div className="w-16 h-16 mb-4 flex items-center justify-center bg-yellow-500/10 rounded-full">
                          <img
                            src={service.icon}
                            className="w-12 h-12 object-contain filter brightness-0 invert sepia-100 saturate-200 hue-rotate-45"
                            alt={service.title}
                          />
                        </div>
                        <p className="font-semibold text-lg mb-3 text-center h-14 flex items-center justify-center text-yellow-400">
                          {service.title}
                        </p>
                        <p className="text-gray-300 text-sm text-center h-10">
                          {service.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSeller;
