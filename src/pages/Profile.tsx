import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { FcHome } from "react-icons/fc";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import H1 from "../components/headers/H1";
import Input from "../components/Input";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { updateUser } from "../backend/userLogin";
import { deleteListing, fetchListingsUser } from "../backend/listings";
import { ListingType } from "../types/listingTypes";

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeName, setChangeName] = useState(false);
  const [listings, setListings] = useState<ListingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName,
    email: auth.currentUser?.email,
  });

  const { name, email } = formData;

  async function onLogout() {
    auth.signOut();

    navigate("/");
  }

  function onChange(e: any) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit() {
    if (auth.currentUser && name) {
      await updateUser(auth.currentUser, name);
    }
  }

  async function onDelete(listingId: string) {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteListing(listingId);
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
    }
  }

  function onEdit(listingId: string) {
    navigate(`/edit-listing/${listingId}`);
  }

  useEffect(() => {
    async function fetchUserListings() {
      if (auth.currentUser) {
        const listings = await fetchListingsUser(auth.currentUser);
        setListings(listings);
        setLoading(false);
      }
    }
    fetchUserListings();
  }, [auth.currentUser?.uid]);

  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <H1 title="My Profile" />
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            <Input
              type="text"
              id="name"
              value={name ? name : ""}
              name=""
              disabled={!changeName}
              onChange={onChange}
              className={`mb-6 ${
                changeName ? "bg-red-200 focus:bg-red-300" : "bg-white"
              }`}
            />

            <Input
              type="email"
              id="email"
              value={email ? email : ""}
              name=""
              disabled
              className="mb-6"
            />

            <div className="flex justify-between mb-6 whitespace-nowrap text-sm sm:text-lg">
              <p className="flex items-center">
                Do you want to change your name?
                <span
                  onClick={() => {
                    changeName && onSubmit();
                    setChangeName((prevState) => !prevState);
                  }}
                  className="text-red-600 hover:to-red-700 
                transition duration-200 ease-in-out ml-1 cursor-pointer"
                >
                  {changeName ? "Apply change" : "Edit"}
                </span>
              </p>
              <p
                onClick={onLogout}
                className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer"
              >
                Sing out
              </p>
            </div>
          </form>
          <Button type="submit">
            <Link
              to="/create-listing"
              className="flex justify-center items-center "
            >
              <Icon
                IconName={FcHome}
                className="mr-2 text-3xl bg-red-200 rounded-full p-1 border-2"
              />
              Sell or rent your home
            </Link>
          </Button>
        </div>
      </section>
      <div>
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mt-6">
              My Listing
            </h2>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 my-6">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
