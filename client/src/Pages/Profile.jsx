import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const Profile = () => {
  // firebase storage
  // allow read;
  // allow write : if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user.user);
  const [file, setFile] = useState(undefined);
  const [filePer, setFilePer] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  // ! handle image upload
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

  // !////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form action="" className="flex flex-col gap-4">
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
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
        />
        <input
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          type="text"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between my-5">
        <span className="text-red-700">Delete Account</span>
        <span className="text-blue-700">Sign Out </span>
      </div>
    </div>
  );
};

export default Profile;
