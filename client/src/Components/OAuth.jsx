import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInFailure, signInSuccess } from "../redux/user/UserSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const res = await axios.post(
        "http://localhost:8000/api/auth/google",
        {
          email: result.user.email,
          photo: result.user.photoURL,
          name: result.user.displayName,
        },
        {
          withCredentials: true,
        }
      );
      const data = res.data;
      dispatch(signInSuccess(data));
      navigate("/profile");
    } catch (error) {
      console.log(" Google authentication failed");
      dispatch(
        signInFailure("Failed to initiate Google OAuth. Please try again")
      );
      console.log(error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 p-3 rounded-lg uppercase hover:opacity-95 text-white"
    >
      continue with google
    </button>
  );
};

export default OAuth;
