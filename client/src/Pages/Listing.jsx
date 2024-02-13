import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../Components/Contact";

const Listing = () => {
  const { currentUser } = useSelector((state) => state.user.user);
  SwiperCore.use(Navigation);
  const [listing, setListing] = useState();
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const dp = listing.discountedPrice;

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const listingId = params.id;
        const response = await axios.get(
          `http://localhost:8000/api/listing/get/${listingId}`,
          {
            withCredentials: true,
          }
        );
        setListing(response.data);
        setLoading(false);
      } catch (error) {
        seterror("Fetching data failed!!! Try again");
        console.error(error.message);
        setLoading(false);
      }
    };
    fetchListing();
  }, []);
  return (
    <main>
      {loading && (
        <p className="text-center my-7 text-2xl font-semibold">Loading...</p>
      )}
      {error && (
        <p className="text-center my-7 text-2xl font-semibold">
          Something went wrong!!!
        </p>
      )}
      {listing && !loading && !error && (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[500px] w-full"
                  style={{
                    background: `url(${url}) center no-repeat `,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer ? listing.discountedPrice : listing.regularPrice}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${(+listing.regularPrice - +dp).toLocaleString()} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>{" "}
              {listing.description}
            </p>
            <ul className=" text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} bathrooms`
                  : `${listing.bathrooms} bathroom`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? ` Parking spot` : ` No Parking spot`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished ? ` Furnished` : `No furnished`}
              </li>
            </ul>
            {!contact && currentUser && listing.userRef !== currentUser._id && (
              <button
                onClick={() => setContact(true)}
                className="uppercase bg-slate-700 rounded-lg hover:opacity-95 text-white p-3"
              >
                contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </>
      )}
    </main>
  );
};

export default Listing;
