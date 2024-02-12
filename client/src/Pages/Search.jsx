import React from "react";

const Search = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 sm:border-r-2 min-h-screen ">
        <form className="flex flex-col gap-8" action="">
          <div className=" flex items-center gap-2 ">
            <label className="whitespace-nowrap font-semibold" >
              Search Term :
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
            />
          </div>
          <div className=" flex gap-2 flex-wrap items-center">
            <label className="font-semibold" >Type : </label>
            <div className="flex gap-2 items-center">
              <input type="checkbox" name="" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 items-center">
              <input type="checkbox" name="" id="sale" className="w-5" />
              <span>Sale</span>
            </div>
            <div className="flex gap-2 items-center">
              <input type="checkbox" name="" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className=" flex gap-2 flex-wrap items-center">
            <label className="font-semibold" >Amenities : </label>
            <div className="flex gap-2 items-center">
              <input type="checkbox" name="" id="parking" className="w-5" />
              <span>Parking</span>
            </div>
            <div className="flex gap-2 items-center">
              <input type="checkbox" name="" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
          </div>
          <div>
            <label className="font-semibold" >Sort : </label>
            <select name="" id="sort_order" className="border rounded-lg p-3">
              <option value="">Price high to low</option>
              <option value="">Price low to high</option>
              <option value="">Latest</option>
              <option value="">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white uppercase p-3  rounded-lg hover:opacity-95 ">
            Search
          </button>
        </form>
      </div>
      <div className="">
        <h1 className="text-3xl font-semibold border-b p-3 mt-5 text-slate-700">Listing Results</h1>
      </div>
    </div>
  );
};

export default Search;
