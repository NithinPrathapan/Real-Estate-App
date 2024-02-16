import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/UserSlice";
import OAuth from "../Components/OAuth";

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user.user);
  console.log(loading, error);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const response = await axios.post(
        "http://localhost:8000/api/auth/signin",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const data = response.data;
      cookies.set("access_token", data.token);
      console.log('hai');
      console.log(data.token);
      dispatch(signInSuccess(data.data));
      navigate("/");
    } catch (error) {
      console.log(error);
      dispatch(signInFailure(error));
    }
  };
  return (
    <div className="p-3 max-w-lg  mx-auto">
      <h1 className="text-3xl uppercase justify-center items-center flex font-semibold my-7">
        Sign-in
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={handleChange}
          type="email"
          className="p-3 border rounded-lg"
          placeholder="email"
          id="email"
        />
        <input
          onChange={handleChange}
          type="password"
          className="p-3 border rounded-lg"
          placeholder="password"
          id="password"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white uppercase hover:opacity-95 p-3 rounded-lg disabled:opacity-80"
        >
          {loading ? "Loading.." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 my-5">
        <p>Don't have an account?</p>
        <Link to="/signup">
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default Signin;
