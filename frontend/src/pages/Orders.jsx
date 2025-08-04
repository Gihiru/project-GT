import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";

const Orders = () => {
  const { backendUrl, token, currency, userId } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrderData = async () => {
    try {
      // Extract userId from token if missing
      let currentUserId = userId;
      if (!currentUserId && token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          currentUserId = payload.id;
          console.log("Extracted userId from token:", currentUserId);
        } catch (e) {
          console.log("Could not extract userId from token");
        }
      }
      
      if (!token || !currentUserId) {
        console.log("Missing credentials - token:", !!token, "userId:", !!currentUserId);
        setLoading(false);
        return;
      }

      console.log("Fetching orders - userId:", currentUserId, "backendUrl:", backendUrl);
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        { userId: currentUserId },
        { headers: { token } }
      );
      
      console.log("Full response:", response);

      console.log("Order response:", response.data);

      if (response.data.success) {
        let allOrdersItem = [];
        if (response.data.orders && response.data.orders.length > 0) {
          response.data.orders.forEach((order) => {
            if (order.items && Array.isArray(order.items)) {
              order.items.forEach((item) => {
                allOrdersItem.push({
                  ...item,
                  qty: item.quantity, // Map quantity to qty for frontend display
                  status: order.status || "Processing",
                  payment: order.payment,
                  paymentMethod: order.paymentMethod,
                  date: order.date,
                  orderId: order._id,
                  address: order.address,
                });
              });
            }
          });
          console.log("Processed orders:", allOrdersItem);
          setOrderData(allOrdersItem.reverse());
        } else {
          console.log("No orders found in response");
          setOrderData([]);
        }
      } else {
        console.log("Failed to fetch orders:", response.data.message);
        setOrderData([]);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
      setOrderData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Orders useEffect - token:", !!token, "userId:", userId, "backendUrl:", backendUrl);
    if (token) {
      loadOrderData();
    } else {
      console.log("Missing token");
      setLoading(false);
    }
  }, [token, backendUrl]);
  
  // Debug function to check current state
  const debugAuth = () => {
    console.log("Current auth state:", {
      token: !!token,
      userId,
      backendUrl,
      localStorage_token: !!localStorage.getItem('token'),
      localStorage_userId: localStorage.getItem('userId')
    });
  };

  return (
    <div className="border-t border-yellow-600/30 pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div className="mt-4">
        {!token && (
          <div className="text-center py-8 text-gray-300">
            Please log in to view your orders
          </div>
        )}

        {token && !loading && orderData.length === 0 && (
          <div className="text-center py-8 text-gray-300">
            No orders found
            <button onClick={debugAuth} className="ml-4 text-yellow-400 underline hover:text-yellow-300">
              Debug Auth
            </button>
          </div>
        )}
        
        {loading && (
          <div className="text-center py-8 text-gray-300">Loading orders...</div>
        )}

        {token &&
          orderData.map((item, index) => (
            <div
              key={item.orderId + "-" + index}
              className="py-4 border-t border-b border-yellow-600/30 bg-gray-800/30 rounded-lg mb-4 px-4 text-gray-300 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                <img
                  className="w-16 sm:w-20"
                  src={Array.isArray(item.image) ? item.image[0] : item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.png'; // Fallback image
                  }}
                />
                <div>
                  <p className="sm:text-base font-medium text-gray-100">{item.name}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-base text-gray-300">
                    <p className="text-yellow-400 font-semibold">
                      {currency}
                      {item.price}
                    </p>
                    <p>Quantity: {item.qty}</p>
                  </div>
                  <p className="mt-1 text-gray-300">
                    Date:{" "}
                    <span className="text-gray-400">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="mt-1 text-gray-300">
                    Payment:{" "}
                    <span className="text-gray-400">
                      {item.paymentMethod || "N/A"}
                    </span>
                  </p>
                  <p className="mt-1 text-gray-300">
                    Payment Status:{" "}
                    <span
                      className={`${item.payment ? "text-green-400" : "text-red-400"}`}
                    >
                      {item.payment ? "Paid" : "Pending"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.status === "Delivered"
                        ? "bg-green-500"
                        : item.status === "Out for delivery"
                        ? "bg-blue-500"
                        : item.status === "Shipped"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  <p className="text-sm md:text-base text-gray-100">
                    {item.status || "Processing"}
                  </p>
                </div>
                <button
                  onClick={loadOrderData}
                  className="border border-yellow-600 bg-yellow-500 text-gray-900 px-4 py-2 text-sm font-medium rounded hover:bg-yellow-400 transition-colors"
                >
                  Refresh Status
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Orders;
