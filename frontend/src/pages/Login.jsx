import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, backendUrl, setUserId } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [password, setPasword] = useState("");
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          if (response.data.userId) {
            setUserId(response.data.userId);
            localStorage.setItem("userId", response.data.userId);
          }
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          setUserId(response.data.userId);
          localStorage.setItem("userId", response.data.userId);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-100 bg-gray-800/50 border border-yellow-600/30 rounded-lg p-8"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-2">
        <p className="prata-regular text-3xl text-yellow-400">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-yellow-500" />
      </div>
      {currentState === "Login" ? (
        ""
      ) : (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-yellow-600 bg-gray-700 text-gray-100 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          placeholder="Name"
          required
        />
      )}
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-yellow-600 bg-gray-700 text-gray-100 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        placeholder="Email"
        required
      />
      <input
        onChange={(e) => setPasword(e.target.value)}
        value={password}
        type="password"
        className="w-full px-3 py-2 border border-yellow-600 bg-gray-700 text-gray-100 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        placeholder="Password"
        required
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer text-gray-400 hover:text-yellow-400 transition-colors">Forgot your password?</p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            Login Here
          </p>
        )}
      </div>
      <button className="bg-yellow-500 text-gray-900 font-semibold px-8 py-2 mt-4 rounded hover:bg-yellow-400 transition-colors w-full">
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;
