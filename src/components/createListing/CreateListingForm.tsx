import React, { useState } from "react";
import CreateListingLabel from "./CreateListingLabel";
import Button from "../Button";
import Input from "../Input";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router";
import { CreateListingType } from "../../types/listingTypes";
import { saveListing } from "../../backend/listings";

function CreateListingForm() {
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateListingType>({
    type: "rent",
    title: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    imgUrls: null,
    geoLocation: {
      lat: 0,
      lng: 0,
    },
  });

  function onChange(e: any) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }

  async function onSubmit(e: any) {
    e.preventDefault();
    const docId = await saveListing(
      setLoading,
      formData,
      geoLocationEnabled,
      auth
    );
    if (docId) {
      navigate(`/category/${formData.type}/${docId}`);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <CreateListingLabel text="Sell / Rent" />
      <div className="flex">
        <Button
          id="type"
          value="sell"
          onClick={onChange}
          secondary
          text="sell"
        />
        <button
          type="button"
          id="type"
          value="sell"
          onClick={onChange}
          className={`mr-3 uppercase px-7 py-3 font-medium text-sm  shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
            formData.type === "rent"
              ? "bg-white text-black"
              : "bg-slate-600 text-white"
          }`}
        >
          sell
        </button>
        <Button
          id="type"
          value="rent"
          onClick={onChange}
          secondary
          text="rent"
        />
        <button
          type="button"
          id="type"
          value="rent"
          onClick={onChange}
          className={`ml-3 uppercase px-7 py-3 font-medium text-sm  shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
            formData.type === "sell"
              ? "bg-white text-black"
              : "bg-slate-600 text-white"
          }`}
        >
          rent
        </button>
      </div>

      <CreateListingLabel text="Title" />
      <Input
        type="text"
        id="title"
        value={formData.title}
        onChange={onChange}
        name="Title"
        maxLength={32}
        minLength={10}
        required
        className="focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
      />
      <input
        type="text"
        id="title"
        value={formData.title}
        onChange={onChange}
        placeholder="Title"
        maxLength={32}
        minLength={10}
        required
        className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded 
            transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
      />
      <div className="flex space-x-6 mb-6">
        <div>
          <p className="text-lg font-semibold">Beds</p>
          <Input
            type="number"
            id="bedrooms"
            value={formData.bedrooms}
            onChange={onChange}
            min={1}
            max={50}
            required
            className="focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
          />
          <input
            type="number"
            id="bedrooms"
            value={formData.bedrooms}
            onChange={onChange}
            min="1"
            max="50"
            required
            className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 
                    rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white 
                    focus:border-slate-600 text-center"
          />
        </div>
        <div>
          <p className="text-lg font-semibold">Baths</p>
          <Input
            type="number"
            id="bathrooms"
            value={formData.bathrooms}
            onChange={onChange}
            min={1}
            max={50}
            required
            className="focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
          />
          <input
            type="number"
            id="bathrooms"
            value={formData.bathrooms}
            onChange={onChange}
            min="1"
            max="50"
            required
            className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 
                    rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white 
                    focus:border-slate-600 text-center"
          />
        </div>
      </div>

      <CreateListingLabel text="Parking spot" />
      <div className="flex">
        <Button
          id="parking"
          type="button"
          value="true"
          onClick={onChange}
          secondary
          text="yes"
        />
        <button
          type="button"
          id="parking"
          onClick={onChange}
          className={`mr-3 uppercase px-7 py-3 font-medium text-sm  shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
            !formData.parking
              ? "bg-white text-black"
              : "bg-slate-600 text-white"
          }`}
        >
          yes
        </button>
        <Button
          id="parking"
          type="button"
          value="false"
          onClick={onChange}
          secondary
          text="no"
        />
        <button
          type="button"
          id="parking"
          onClick={onChange}
          className={`ml-3 uppercase px-7 py-3 font-medium text-sm  shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
            formData.parking ? "bg-white text-black" : "bg-slate-600 text-white"
          }`}
        >
          no
        </button>
      </div>

      <CreateListingLabel text="Furnished" />
      <div className="flex">
        <Button
          id="furnished"
          type="button"
          value="true"
          onClick={onChange}
          secondary
          text="yes"
        />
        <button
          type="button"
          id="furnished"
          onClick={onChange}
          className={`mr-3 uppercase px-7 py-3 font-medium text-sm  shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
            !formData.furnished
              ? "bg-white text-black"
              : "bg-slate-600 text-white"
          }`}
        >
          yes
        </button>
        <Button
          id="furnished"
          type="button"
          value="false"
          onClick={onChange}
          secondary
          text="no"
        />
        <button
          type="button"
          id="furnished"
          onClick={onChange}
          className={`ml-3 uppercase px-7 py-3 font-medium text-sm  shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
            formData.furnished
              ? "bg-white text-black"
              : "bg-slate-600 text-white"
          }`}
        >
          no
        </button>
      </div>

      <CreateListingLabel text="Address" />
      <textarea
        id="address"
        value={formData.address}
        onChange={onChange}
        placeholder="Address"
        required
        className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded 
            transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
      />

      {!geoLocationEnabled && (
        <div className="flex space-x-6">
          <div>
            <CreateListingLabel text="Latitude" />
            <Input
              type="number"
              id="latitude"
              value={formData.geoLocation.lat}
              onChange={onChange}
              min={-90}
              max={90}
              required
              className="focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
            />
            <input
              type="number"
              id="latitude"
              value={formData.geoLocation.lat}
              min="-90"
              max="90"
              onChange={onChange}
              required
              className="w-full px-4 py-2 text-xl
                        text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out
                        focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
            />
          </div>
          <div>
            <CreateListingLabel text="Longitude" />
            <Input
              type="number"
              id="longitude"
              value={formData.geoLocation.lng}
              onChange={onChange}
              min={-180}
              max={180}
              required
              className="focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
            />
            <input
              type="number"
              id="longitude"
              value={formData.geoLocation.lng}
              min="-180"
              max="180"
              onChange={onChange}
              required
              className="w-full px-4 py-2 text-xl
                        text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out
                        focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
            />
          </div>
        </div>
      )}

      <CreateListingLabel text="Description" />
      <textarea
        id="description"
        value={formData.description}
        onChange={onChange}
        placeholder="Description"
        required
        className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded 
            transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
      />

      <CreateListingLabel text="Offer" />
      <div className="flex">
        <Button
          id="offer"
          type="button"
          value="true"
          onClick={onChange}
          secondary
          text="yes"
        />
        <button
          type="button"
          id="offer"
          onClick={onChange}
          className={`mr-3 uppercase px-7 py-3 font-medium text-sm  shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
            !formData.offer ? "bg-white text-black" : "bg-slate-600 text-white"
          }`}
        >
          yes
        </button>
        <Button
          id="offer"
          type="button"
          value="false"
          onClick={onChange}
          secondary
          text="no"
        />
        <button
          type="button"
          id="offer"
          onClick={onChange}
          className={`ml-3 uppercase px-7 py-3 font-medium text-sm  shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
            formData.offer ? "bg-white text-black" : "bg-slate-600 text-white"
          }`}
        >
          no
        </button>
      </div>

      <CreateListingLabel text="Regular price" />
      <div className="mb-6 flex w-full justify-center items-center space-x-6">
        <Input
          type="number"
          id="regularPrice"
          value={formData.regularPrice}
          onChange={onChange}
          min={50}
          max={40000000}
          required
          className="focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        <input
          type="number"
          id="regularPrice"
          value={formData.regularPrice}
          onChange={onChange}
          min="50"
          max="40000000"
          required
          className="w-full  px-4 py-2 text-xl rounded transition duration-150 ease-in-out
                text-gray-700 bg-white border border-gray-300 focus:text-gray-700 focus:bg-white
                focus:border-slate-600 text-center"
        />
        {formData.type === "rent" && (
          <div>
            <p className="text-md w-full whitespace-nowrap">$ / Month</p>
          </div>
        )}
      </div>
      {formData.offer && (
        <div>
          <CreateListingLabel text="Discounted price" />
          <div className="mb-6 flex w-full justify-center items-center space-x-6">
            <Input
              type="number"
              id="discountedPrice"
              value={formData.discountedPrice}
              onChange={onChange}
              min={50}
              max={40000000}
              required
              className="focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
            />
            <input
              type="number"
              id="discountedPrice"
              value={formData.discountedPrice}
              onChange={onChange}
              min="50"
              max="40000000"
              required={formData.offer}
              className="w-full  px-4 py-2 text-xl rounded transition duration-150 ease-in-out
                        text-gray-700 bg-white border border-gray-300 focus:text-gray-700 focus:bg-white
                        focus:border-slate-600 text-center"
            />
            {formData.type === "rent" && (
              <div>
                <p className="text-md w-full whitespace-nowrap">$ / Month</p>
              </div>
            )}
          </div>
        </div>
      )}
      <div>
        <CreateListingLabel text="Images" />
        <p className="text-gray-600">
          The first image will be the cover (max 6)
        </p>
        <input
          type="file"
          name="images"
          id="images"
          onChange={onChange}
          accept=".jpg, .png, .jpeg"
          multiple
          required
          className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 
                rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
        />
      </div>
      <Button id="sub" type="submit" text="Create Listing" />
      <button
        type="submit"
        className="my-6 w-full px-7 py-3 
            bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md
            hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg
            active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
      >
        Create Listing
      </button>
    </form>
  );
}

export default CreateListingForm;
