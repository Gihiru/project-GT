import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, qty, price }) => {
  const { currency } = useContext(ShopContext);
  const getAvailability = () => {
    if (qty === 0) {
      return { text: "Out of Stock", color: "text-red-500" };
    } else {
      return { text: "In Stock", color: "text-green-500" };
    }
  };
  const availability = getAvailability();

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      className="block text-gray-700 cursor-pointer h-full"
      to={`/product/${id}`}
    >
      <div className="flex flex-col h-full border border-gray-100 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-square overflow-hidden rounded-lg mb-4">
          <img
            className="w-full h-full object-cover hover:scale-110 transition ease-in-out duration-300"
            src={image[0]}
            alt={name}
          />
        </div>
        <div className="flex flex-col flex-grow">
          <p className="text-sm min-h-[40px] line-clamp-2 mb-2">{name}</p>
          <p className="flex justify-between text-sm font-medium mt-auto">
            <span className="text-gray-900">
              {currency}
              {price}
            </span>
            <span className={availability.color}>{availability.text}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
