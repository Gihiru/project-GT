import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t border-yellow-600/30">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img
          className="w-full md:max-w-[480px]"
          src={assets.contact_img}
          alt=""
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-yellow-400">Our Store</p>
          <p className="text-gray-300">
            No.576, Hirimbura road, <br /> Karapitiya, <br />
            Galle,
            <br /> Sri Lanka.
          </p>
          <p className="text-gray-300">
            Tel: +94 76 067 4326 <br /> Email: gtelectricals9@gmail.com
          </p>
          <p className="text-gray-300">
            We are here to assist you with any inquiries or support you may
            need. Feel free to reach out to us via phone or email, and our team
            will be happy to help.
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;
