import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/auth/signup",
        {
          email: formData.email,
          password: formData.password,
          username: formData.username,
        }
      );
      if (response.data.status !== 201) {
        setLoading(false);
        setError(response.message);
        console.log(response);
      }
      setLoading(false);
      setError(null);
      navigate("/signin");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl justify-center items-center flex font-semibold my-7">
        Sign-up
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={handleChange}
          type="text"
          className="p-3 border rounded-lg"
          placeholder="username"
          id="username"
        />
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
          {loading ? "Loading.." : "Sign up"}
        </button>
      </form>
      <div className="flex gap-2 my-5">
        <p>have an account?</p>
        <Link to="/signin">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default Signup;
