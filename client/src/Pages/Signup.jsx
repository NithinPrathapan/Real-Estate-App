import React from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl justify-center items-center flex font-semibold my-7">
        Sign-up
      </h1>
      <form action="" className="flex flex-col gap-4">
        <input
          type="text"
          className="p-3 border rounded-lg"
          placeholder="username"
          id="username"
        />
        <input
          type="email"
          className="p-3 border rounded-lg"
          placeholder="email"
          id="email"
        />
        <input
          type="password"
          className="p-3 border rounded-lg"
          placeholder="password"
          id="password"
        />
        <button className="bg-slate-700 text-white uppercase hover:opacity-95 p-3 rounded-lg disabled:opacity-80">
          Sign up
        </button>
      </form>
      <div className="flex gap-2 my-5" >
        <p>have an account?</p>
        <Link to="/signin">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
