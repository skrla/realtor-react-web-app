import React, { useState } from "react";
import CreateListingLabel from "./CreateListingLabel";
import Button from "../Button";
import Input from "../Input";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router";
import { CreateListingType } from "../../types/listingTypes";
import { saveListing } from "../../backend/listings";
import Spinner from "../Spinner";

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
    let boolean: boolean | null = null;
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
      console.log(formData);
    }
    console.log(formData);
  }

  async function onSubmit(e: any) {
    e.preventDefault();
    console.log(formData);

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

  if (loading) {
    return <Spinner />;
  }
  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold ">
        {" "}
        Create a Listing{" "}
      </h1>
      <form onSubmit={onSubmit}>
        <CreateListingLabel text="Sell / Rent" />
        <div className="flex gap-5">
          <Button
            id="type"
            value="sell"
            onClick={onChange}
            text="sell"
            secondary={formData.type !== "sell"}
            className="w-full mb-6"
          />

          <Button
            id="type"
            value="rent"
            onClick={onChange}
            text="rent"
            secondary={formData.type !== "rent"}
            className="w-full mb-6"
          />
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

        <div className="flex space-x-6 mb-6">
          <div>
            <CreateListingLabel text="Beds" />
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
          </div>
          <div>
            <CreateListingLabel text="Baths" />
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
          </div>
        </div>

        <CreateListingLabel text="Parking spot" />
        <div className="flex gap-5">
          <Button
            id="parking"
            type="button"
            value="true"
            onClick={onChange}
            text="yes"
            secondary={!formData.parking}
            className="w-full mb-6"
          />

          <Button
            id="parking"
            type="button"
            value="false"
            onClick={onChange}
            secondary={formData.parking}
            className="w-full mb-6"
            text="no"
          />
        </div>

        <CreateListingLabel text="Furnished" />
        <div className="flex gap-5">
          <Button
            id="furnished"
            type="button"
            value="true"
            onClick={onChange}
            secondary={!formData.furnished}
            className="w-full mb-6"
            text="yes"
          />

          <Button
            id="furnished"
            type="button"
            value="false"
            onClick={onChange}
            secondary={formData.furnished}
            className="w-full mb-6"
            text="no"
          />
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
        <div className="flex gap-5">
          <Button
            id="offer"
            type="button"
            value="true"
            onClick={onChange}
            secondary={!formData.offer}
            className="w-full mb-6"
            text="yes"
          />

          <Button
            id="offer"
            type="button"
            value="false"
            onClick={onChange}
            secondary={formData.offer}
            className="w-full mb-6"
            text="no"
          />
        </div>

        <CreateListingLabel text="Regular price" />
        <div className="flex w-full justify-center items-center space-x-6">
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
                className="focus:text-gray-700 focus:bg-white focus:border-slate-600"
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
        <Button id="sub" type="submit" text="Create Listing" className="my-8" />
      </form>
    </main>
  );
}

export default CreateListingForm;
