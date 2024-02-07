import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

const Listing = () => {
  SwiperCore.use(Navigation);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(false);
  const params = useParams();
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
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </main>
  );
};

export default Listing;
