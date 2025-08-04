import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const Account = () => {
  const { backendUrl, token, setToken, navigate, userId, setUserId } = useContext(ShopContext);
  
  const [activeTab, setActiveTab] = useState("profile");
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  });

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      let currentUserId = userId;
      
      // Debug token structure
      if (token) {
        try {
          const tokenParts = token.split('.');
          console.log("Token parts:", tokenParts.length);
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log("Token payload:", payload);
          currentUserId = payload.id;
          console.log("Extracted userId:", currentUserId);
        } catch (e) {
          console.log("Token decode error:", e);
          toast.error("Invalid authentication token");
          return;
        }
      }

      if (!currentUserId) {
        console.log("No userId available - userId:", userId, "extracted:", currentUserId);
        toast.error("User ID not found. Please login again.");
        navigate("/login");
        return;
      }

      console.log("Fetching user info for userId:", currentUserId);
      
      const response = await axios.post(
        `${backendUrl}/api/user/profile`,
        { userId: currentUserId },
        { headers: { token } }
      );

      console.log("User info response:", response.data);

      if (response.data.success) {
        setUserInfo(response.data.user);
        console.log("User info set:", response.data.user);
      } else {
        console.log("Failed to fetch user info:", response.data.message);
        toast.error(response.data.message || "Failed to load user information");
      }
    } catch (error) {
      console.log("Error fetching user info:", error);
      
      if (error.response?.status === 404) {
        console.log("Profile API not available, using fallback");
        // Fallback: create basic user info from token
        setUserInfo({
          _id: currentUserId,
          name: "User",
          email: "Please update your profile",
          createdAt: new Date().toISOString()
        });
        toast.error("Profile API not available. Please restart the backend server.");
      } else {
        toast.error("Failed to load user information");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderStats = async () => {
    try {
      let currentUserId = userId;
      if (!currentUserId && token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          currentUserId = payload.id;
        } catch (e) {
          console.log("Could not extract userId for order stats");
          return;
        }
      }

      if (!currentUserId) {
        console.log("No userId available for order stats");
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        { userId: currentUserId },
        { headers: { token } }
      );

      if (response.data.success) {
        const orders = response.data.orders;
        const totalSpent = orders
          .filter(order => order.payment)
          .reduce((sum, order) => sum + order.amount, 0);
        
        setOrderStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter(order => !order.payment).length,
          completedOrders: orders.filter(order => order.payment).length,
          totalSpent: totalSpent
        });
      }
    } catch (error) {
      console.log("Error fetching order stats:", error);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      let currentUserId = userId;
      if (!currentUserId && token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        currentUserId = payload.id;
      }

      const response = await axios.post(
        `${backendUrl}/api/user/update`,
        { 
          userId: currentUserId,
          name: userInfo.name,
          email: userInfo.email
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error updating profile:", error);
      if (error.response?.status === 404) {
        toast.error("Update API not available. Please restart the backend server.");
      } else {
        toast.error("Failed to update profile");
      }
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    try {
      let currentUserId = userId;
      if (!currentUserId && token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        currentUserId = payload.id;
      }

      const response = await axios.post(
        `${backendUrl}/api/user/change-password`,
        {
          userId: currentUserId,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Password changed successfully");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to change password");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken("");
    setUserId("");
    navigate("/");
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    if (token) {
      // Extract userId and set it if missing
      let currentUserId = userId;
      if (!currentUserId && token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          currentUserId = payload.id;
          console.log("Extracted userId from token:", currentUserId);
          setUserId(currentUserId);
          localStorage.setItem('userId', currentUserId);
        } catch (e) {
          console.log("Could not extract userId from token:", e);
          toast.error("Invalid token");
          navigate("/login");
          return;
        }
      }
      
      // Only fetch data if we have a valid userId
      if (currentUserId || userId) {
        fetchUserInfo();
        fetchOrderStats();
      } else {
        console.log("No userId available");
        toast.error("User ID not found. Please login again.");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [token, userId]);

  if (!token) {
    return (
      <div className="text-center py-8">
        <p>Please log in to access your account</p>
      </div>
    );
  }

  return (
    <div className="border-t pt-16">
      <div className="text-2xl mb-8">
        <Title text1={"MY"} text2={"ACCOUNT"} />
      </div>

      {/* Account Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-blue-600">{orderStats.totalOrders}</h3>
          <p className="text-gray-600">Total Orders</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-yellow-600">{orderStats.pendingOrders}</h3>
          <p className="text-gray-600">Pending Orders</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-green-600">{orderStats.completedOrders}</h3>
          <p className="text-gray-600">Completed Orders</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-purple-600">Rs. {orderStats.totalSpent}</h3>
          <p className="text-gray-600">Total Spent</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-6 py-3 font-medium ${
            activeTab === "profile"
              ? "border-b-2 border-black text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-6 py-3 font-medium ${
            activeTab === "password"
              ? "border-b-2 border-black text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Change Password
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-6 py-3 font-medium ${
            activeTab === "orders"
              ? "border-b-2 border-black text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          My Orders
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Information Display */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">User Information</h3>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading user information...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{userInfo.name || 'Not available'}</p>
                      <p className="text-sm text-gray-500">User</p>
                    </div>
                  </div>
                
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Full Name:</span>
                    <span className="font-medium">{userInfo.name || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{userInfo.email || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">User ID:</span>
                    <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">
                      {userInfo._id || userId || 'Not available'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Status:</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since:</span>
                    <span className="font-medium">
                      {userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Spent:</span>
                    <span className="font-medium text-green-600">Rs. {orderStats.totalSpent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Favorite Payment:</span>
                    <span className="font-medium">COD</span>
                  </div>
                </div>
                </div>
              )}
            </div>

            {/* Edit Profile Form */}
            <div>
              <h3 className="text-lg font-medium mb-4">Edit Profile</h3>
              <form onSubmit={updateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "password" && (
          <div className="max-w-md">
            <h3 className="text-lg font-medium mb-4">Change Password</h3>
            <form onSubmit={changePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  minLength="8"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  minLength="8"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
              >
                Change Password
              </button>
            </form>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Recent Orders</h3>
              <button
                onClick={() => navigate("/orders")}
                className="text-blue-600 hover:text-blue-800"
              >
                View All Orders →
              </button>
            </div>
            <p className="text-gray-600">
              You have {orderStats.totalOrders} total orders. 
              <span className="ml-2">
                <button
                  onClick={() => navigate("/orders")}
                  className="text-blue-600 hover:underline"
                >
                  Click here to view all orders
                </button>
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Logout Section */}
      <div className="mt-12 pt-6 border-t">
        <button
          onClick={logout}
          className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Account;