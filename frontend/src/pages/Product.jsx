import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [qty, setQty] = useState("");

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  const getAvailability = () => {
    if (productData.qty === 0) {
      return { text: "Out of Stock", color: "text-red-500" };
    } else {
      return {
        text: `${productData.qty}` + " In Stock",
        color: "text-green-500",
      };
    }
  };
  const availability = getAvailability();

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className="border-t-2 border-yellow-600/30 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/*----------- Product Data-------------- */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/*---------- Product Images------------- */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>

        {/* -------- Product Info ---------- */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2 text-gray-100">{productData.name}</h1>
          <div className=" flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className="pl-2 text-gray-300">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium text-yellow-400">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-300 md:w-4/5">
            {productData.description}
          </p>
          <p className="mt-5 font-medium">
            <span className={availability.color}>{availability.text}</span>
          </p>

          {/* ---------- Qty Selection ------------- */}
          <div className="flex flex-col gap-2 my-8">
            <label htmlFor="qty" className="font-medium text-gray-100">
              Enter Quantity
            </label>
            <input
              id="qty"
              type="number"
              min="1"
              max={productData.qty}
              value={qty}
              onChange={(e) => {
                const value = Math.min(productData.qty, Math.max(1, parseInt(e.target.value || 1)));
                setQty(value);
              }}
              className="w-full sm:w-[120px] px-3 py-2 border border-yellow-600 bg-gray-700 text-gray-100 rounded"
              placeholder="1"
              disabled={productData.qty === 0}
            />
            {productData.qty > 0 && (
              <p className="text-xs text-gray-400">Max available: {productData.qty}</p>
            )}
          </div>

          <button
            onClick={() => {
              const quantity = parseInt(qty) || 1;
              if (quantity > productData.qty) {
                alert(`Only ${productData.qty} items available in stock`);
                return;
              }
              addToCart(productData._id, quantity);
              setQty("");
            }}
            disabled={productData.qty === 0}
            className={`px-8 py-3 text-sm ${
              productData.qty === 0
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-yellow-500 text-gray-900 hover:bg-yellow-400 active:bg-yellow-600 font-semibold"
            }`}
          >
            {productData.qty === 0 ? "OUT OF STOCK" : "ADD TO CART"}
          </button>
          <hr className="mt-8 sm:w-4/5 border-yellow-600/30" />
          <div className="text-sm text-gray-300 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Have Authorized Warranty.</p>
          </div>
        </div>
      </div>

      {/* ---------- Description & Review Section ------------- */}
      <div className="mt-20">
        <div className="flex">
          <b className="border border-yellow-600/30 bg-yellow-500 text-gray-900 px-5 py-3 text-sm">Description</b>
          <p className="border border-yellow-600/30 bg-gray-800 text-gray-300 px-5 py-3 text-sm">Reviews (0)</p>
        </div>
        <div className="flex flex-col gap-4 border border-yellow-600/30 bg-gray-800/30 px-6 py-6 text-sm text-gray-300">
          <p>{productData.description}</p>
          <p></p>
        </div>
      </div>

      {/* --------- display related products ---------- */}

      <RelatedProducts category={productData.category} />
    </div>
  ) : (
    <div className=" opacity-0"></div>
  );
};

export default Product;
