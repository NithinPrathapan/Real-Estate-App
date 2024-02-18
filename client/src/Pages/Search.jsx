import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ListingItem from "../Components/ListingItem";

const Search = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebarData({ ...sidebarData, sort, order });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParms = new URLSearchParams();
    urlParms.set("searchTerm", sidebarData.searchTerm);
    urlParms.set("type", sidebarData.type);
    urlParms.set("parking", sidebarData.parking);
    urlParms.set("furnished", sidebarData.furnished);
    urlParms.set("offer", sidebarData.offer);
    urlParms.set("order", sidebarData.order);
    const searchQuery = urlParms.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    const offerFromUrl = urlParams.get("offer");
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      sortFromUrl ||
      orderFromUrl ||
      furnishedFromUrl ||
      offerFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const response = await axios.get(
        `/api/listing/get?${searchQuery}`
      );
      if (response.data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListing(response.data);
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);

  const onShowMoreClick = async () => {
    const numberOfListings = listing.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();

    const response = await axios.get(`/api/listing/get?${searchQuery}`);
    const data = await response.data;
    if (data.length < 9) {
      setShowMore(false);
    }
    setListing([...listing, ...data]);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 sm:border-r-2  md:min-h-screen ">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8" action="">
          <div className=" flex items-center gap-2 ">
            <label className="whitespace-nowrap font-semibold">
              Search Term :
            </label>
            <input
              type="text"
              id="searchTerm"
              value={sidebarData.searchTerm}
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              onChange={handleChange}
            />
          </div>
          <div className=" flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type : </label>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name=""
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name=""
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name=""
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name=""
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.offer === true}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className=" flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities : </label>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name=""
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.parking === true}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name=""
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.furnished === true}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div>
            <label className="font-semibold">Sort : </label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              name=""
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularprice_asc">Price high to low</option>
              <option value="regularprice_desc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white uppercase p-3  rounded-lg hover:opacity-95 ">
            Search
          </button>
        </form>
      </div>
      <div className="">
        <h1 className="text-3xl text-center font-semibold border-b p-3 mt-5 text-slate-700">
          Listing Results
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listing.length === 0 && (
            <p className="text-xl text-center w-full  text-slate-700">
              No listings found!!
            </p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            listing &&
            listing.map((item) => (
              <ListingItem key={item._id} listing={item} />
            ))}
        </div>
        {showMore && (
          <button
            className="font-semibold w-full text-green-600 hover:underline p-7 text-lg text-center"
            onClick={() => {
              onShowMoreClick();
            }}
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
