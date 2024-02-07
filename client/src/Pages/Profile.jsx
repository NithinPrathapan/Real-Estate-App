import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/UserSlice";

const Profile = () => {
  // firebase storage
  // allow read;
  // allow write : if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser, error, loading } = useSelector(
    (state) => state.user.user
  );
  const [file, setFile] = useState(undefined);
  const [filePer, setFilePer] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListError, setShowListError] = useState(false);
  const [userListings, setUserlistings] = useState([]);

  // !profile image upload function
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePer(Math.round(progress));
      },

      (error) => {
        setFileError(true);
        console.log(error);
      },
      // ! get the download url
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          console.log(downloadUrl);
          setFormData({ ...formData, avatar: downloadUrl });
        });
      }
    );
    // ! get the error
  };

  const handleChange = (e) => {
    e.preventDefault();
    setUpdateSuccess(false);
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // ! submit updateddata function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await axios.post(
        `http://localhost:8000/api/user/update/${currentUser._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log(res);
      const data = await res.data;
      console.log(data);
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      const errorMsg = error.response.data.message;
      console.log(errorMsg);
      dispatch(updateUserFailure(errorMsg));
    }
  };

  // ! DELETE ACCOUNT FUNCTION

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    try {
      dispatch(deleteUserStart());
      const res = await axios.delete(
        `http://localhost:8000/api/user/delete/${currentUser._id}`,
        { withCredentials: true }
      );
      dispatch(deleteUserSuccess(res.data));
      console.log("User deleted successfully", res.data);
    } catch (error) {
      console.log("error deleting user", error.response);
      dispatch(deleteUserFailure(error));
    }
  };

  // ! signout function
  const handleSignout = async (e) => {
    e.preventDefault();
    dispatch(signOutUserStart());
    try {
      const res = await axios.get(`http://localhost:8000/api/auth/signout`, {
        withCredentials: true,
      });
      console.log("signout successful", res.data);
      dispatch(signOutUserSuccess());
    } catch (error) {
      console.log(error);
      dispatch(signOutUserFailure(error.res));
    }
  };

  // !show listings function
  const handleShowListings = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:8000/api/user/listings/${currentUser._id}`,
        {
          withCredentials: true,
        }
      );

      setUserlistings(response.data);
    } catch (error) {
      setShowListError(true);
      console.error(error);
    }
  };

  // ! delete listing function

  const handleDeleteListing = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/listing/delete/${id}`,
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      setUserlistings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (error) {
      console.log(error.message);
    }
  };



  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => {
            fileRef.current.click();
          }}
          className="w-24 h-24 object-cover mt-2 self-center cursor-pointer rounded-full"
          src={formData.avatar || currentUser.avatar}
          alt="user image"
        />
        <p className="text-center text-sm">
          {fileError ? (
            <span className="text-red-700">Error image upload</span>
          ) : filePer > 0 && filePer < 100 ? (
            <span className="text-blue-800">
              Uploading {""} {filePer}
              {"% done "}
            </span>
          ) : filePer === 100 ? (
            <span className="text-green-500 font-semibold ">
              Updated successfully
            </span>
          ) : null}
        </p>
        <input
          onChange={handleChange}
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          id="username"
        />
        <input
          onChange={handleChange}
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          onChange={handleChange}
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "update"}
        </button>
        <Link
          className="uppercase p-3 bg-green-700 rounded-lg text-white text-center hover:opacity-95"
          to="/create-listing"
        >
          create listing
        </Link>
      </form>
      <div className="flex justify-between my-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignout} className="text-blue-700 cursor-pointer">
          Sign Out{" "}
        </span>
      </div>
      <p className="text-red-700">{error ? error : ""}</p>
      <p className="text-green-500 text-sm font-semibold mb-7 ">
        {updateSuccess ? "User Updated Successfully " : ""}
      </p>
      <button
        onClick={handleShowListings}
        className="text-green-700 font-semibold text-center w-full"
      >
        Show listings
      </button>
      <p className="text-red-700 text-sm">
        {showListError ? showListError : " "}
      </p>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl uppercase font-bold text-center mt-7 w-full">
          Your listings
        </h1>
        {userListings &&
          userListings.length > 0 &&
          userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex items-center gap-4 justify-between"
            >
              <Link
                className="text-slate-700 font-semibold hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <img
                  className="h-16 w-16 object-contain "
                  src={listing.imageUrls[0]}
                  alt="list-image"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p className="">{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-red-700 uppercase font-semibold hover:opacity-80 "
                >
                  Delete
                </button>
                <Link to={`/edit-listing/${listing._id}`}>
                  <button
                  
                    className="text-green-700 uppercase font-semibold hover:opacity-80 "
                  >
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Profile;
