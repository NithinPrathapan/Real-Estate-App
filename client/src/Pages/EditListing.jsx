import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditListing = () => {
  const [files, setFiles] = useState([]);
  const [imageUploadError, setimageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const params = useParams();
  console.log(formData);

  // !get the list based on the id
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingId = params.id;
        const response = await axios.get(
          `/api/listing/get/${listingId}`,
          {
            withCredentials: true,
          }
        );
        setFormData(response.data);
      } catch (error) {
        setError("Fetching data failed!!! Try again");
        console.error(error.message);
      }
    };
    fetchListing();
  }, []);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user.user);
  //   ! handle image submit
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setUploading(false);
          setimageUploadError(false);
        })
        .catch((err) => {
          setUploading(false);
          setimageUploadError("image size of max 2mb is allowed");
        });
    } else {
      setUploading(false);
      setimageUploadError(
        "Minimum 1 file is required and maximum 6 file is allowed"
      );
    }
  };
  //   ! store multiple image promise function
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };
  //   ! remove image
  const handleRemoveimage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // if (formData.imageUrls.length < 1)
      //   return setError("You must upload at least one image");
      if (+formData.regularPrice <= +formData.discountedPrice)
        return setError("Dicount price should be less than regular price");
      setLoading(true);
      setError(false);
      const res = await axios.post(
        `/api/listing/edit/${params.id}`,
        { ...formData, userRef: currentUser._id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const data = res.data;
      console.log("axios response: ", data);
      setLoading(false);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold my-7  uppercase text-center">
        Update a lisiting
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            onChange={handleChange}
            value={formData.name}
            type="text"
            className="border p-3 rounded-lg"
            maxLength={62}
            minLength={0}
            required
            placeholder="name"
            id="name"
          />
          <textarea
            onChange={handleChange}
            value={formData.description}
            type="text"
            className="border p-3 rounded-lg"
            required
            placeholder="description"
            id="description"
          />
          <input
            onChange={handleChange}
            value={formData.address}
            type="text"
            className="border p-3 rounded-lg"
            maxLength={62}
            minLength={10}
            required
            placeholder="Address"
            id="address"
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.type === "sale"}
                type="checkbox"
                name=""
                id="sale"
                className="w-5"
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.type === "rent"}
                type="checkbox"
                name=""
                id="rent"
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.parking}
                type="checkbox"
                name=""
                id="parking"
                className="w-5"
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.furnished}
                type="checkbox"
                name=""
                id="furnished"
                className="w-5"
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.offer}
                type="checkbox"
                name=""
                id="offer"
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                className="p-3 border rounded-lg border-gray-300"
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border rounded-lg border-gray-300"
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                value={formData.regularPrice}
                className="p-3 border rounded-lg border-gray-300"
                type="number"
                id="regularPrice"
                min="50"
                max="1000000"
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                {formData.type === "rent" && (
                  <span className="text-xs">($ / months)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  onChange={handleChange}
                  value={formData.discountedPrice}
                  className="p-3 border rounded-lg border-gray-300"
                  type="number"
                  id="discountedPrice"
                  min="0"
                  max="1000000"
                  required
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  {formData.type === "rent" && (
                    <span className="text-xs">($ / months)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold ">
            Images:{" "}
            <span className="font-normal text-sm text-gray-700 ml-2">
              The first image will be the cover (max 6)
            </span>{" "}
          </p>
          <div className=" flex flex-col sm:flex-row gap-4 ">
            <input
              onChange={(e) => {
                setFiles(e.target.files);
              }}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              disabled={uploading}
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border
               border-green-700 rounded uppercase hover:shadow-lg
              disabled:opacity-80 "
            >
              {uploading ? "uploading..." : "upload"}
            </button>
          </div>
          <p className="text-red-700 m-0 text-center w-full text-sm ">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={index}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="pic"
                  className="w-20 h-20 object-contain rounded-lg "
                />
                <button
                  onClick={(e) => {
                    handleRemoveimage(index);
                  }}
                  type="button"
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <p className="text-red-700 text-sm ">{error}</p>
          <button
            disabled={loading || uploading}
            type="submit"
            className="p-3 bg-slate-700  text-white 
              rounded-lg uppercase hover:opacity-95
              disabled:opacity-80"
          >
            {loading ? "Updating..." : "Update list"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default EditListing;
