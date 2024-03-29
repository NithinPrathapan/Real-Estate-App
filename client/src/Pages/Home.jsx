import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../Components/ListingItem";

const Home = () => {
  const [offerListing, setOfferListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  SwiperCore.use(Navigation);
  useEffect(() => {
    const fetchOfferlising = async () => {
      try {
        const response = await axios.get(`/api/listing/get?offer=true&limit=4`);
        const data = response.data;
        setOfferListing(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const response = await axios.get(`/api/listing/get?type=rent&limit=4`);
        const data = response.data;
        setRentListing(data);
        fetchSalelisting();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSalelisting = async () => {
      try {
        const response = await axios.get(`/api/listing/get?type=sale&limit=4`);
        const data = response.data;
        setSaleListing(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferlising();
  }, []);
  return (
    <div className="p-1">
      <div className="flex flex-col gap-6 p-10 px-3 bg-slate-200 max-w-full mx-auto shadow-md">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Vitalys Estate is the best place to find your next perfect place to
          live
        </div>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's get started...
        </Link>
      </div>
      <Swiper navigation>
        {offerListing &&
          offerListing.length > 1 &&
          offerListing.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                  borderRadius: "5px",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="">
        {offerListing && offerListing.length > 0 && (
          <div className="mx-auto">
            <div className=" my-3 flex flex-col">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className="text-sm text-blue-700 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
              <div className="flex flex-wrap gap-4 mt-4 w-full mx-auto justify-center items-center">
                {offerListing.map((listing, index) => (
                  <ListingItem key={index} listing={listing} />
                ))}
              </div>
            </div>
          </div>
        )}
        {rentListing && rentListing.length > 0 && (
          <div className="mx-auto">
            <div className=" my-3 flex flex-col">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                className="text-sm text-blue-700 hover:underline"
                to={"/search?type='rent"}
              >
                Show more places for rent
              </Link>
              <div className="flex flex-wrap gap-4 mt-4 w-full mx-auto justify-center items-center">
                {rentListing.map((listing, index) => (
                  <ListingItem key={index} listing={listing} />
                ))}
              </div>
            </div>
          </div>
        )}
        {saleListing && saleListing.length > 0 && (
          <div className="mx-auto">
            <div className=" my-3 flex flex-col">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                className="text-sm text-blue-700 hover:underline"
                to={"/search?offer=true"}
              >
                Show more places for sale
              </Link>
              <div className="flex flex-wrap gap-4 mt-4 w-full mx-auto justify-center items-center">
                {saleListing.map((listing, index) => (
                  <ListingItem key={index} listing={listing} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
