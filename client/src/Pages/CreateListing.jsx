import React from "react";

const CreateListing = () => {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold my-7 text-center">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            className="border p-3 rounded-lg"
            maxLength={62}
            minLength={10}
            required
            placeholder="Name "
          />
          <textarea
            type="text"
            className="border p-3 rounded-lg"
            required
            placeholder="Description "
          />
          <input
            type="text"
            className="border p-3 rounded-lg"
            maxLength={62}
            minLength={10}
            required
            placeholder="Address"
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" name="" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="" id="Parking" className="w-5" />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="" id="offer" className="w-5" />
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
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border rounded-lg border-gray-300"
                type="number"
                id="regularPrice"
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / months)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border rounded-lg border-gray-300"
                type="number"
                id="discountedPrice"
                required
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">($ / months)</span>
              </div>
            </div>
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
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              className="p-3 text-green-700 border
             border-green-700 rounded uppercase hover:shadow-lg
            disabled:opacity-80 "
            >
              Upload
            </button>
          </div>
          <button
            className="p-3 bg-slate-700 my-4 text-white rounded-lg uppercase hover:opacity-95
        disabled:opacity-80"
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
