import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import { fetchListingsCategory } from "../backend/listings";
import { ListingType } from "../types/listingTypes";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export default function Category() {
  const [listings, setListings] = useState<ListingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] =
    useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(null);
  const params = useParams();

  async function fetchListings() {
    if (params.categoryName) {
      const fetch = await fetchListingsCategory(
        lastFetchedListing,
        params.categoryName
      );
      if (fetch) {
        const { listings: listListing, lastVisible } = fetch;
        setLastFetchedListing(lastVisible);
        setListings((prevState) => [...prevState, ...listListing]);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center my-6 font-bold">
        Places for {params.categoryName}
      </h1>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul
              className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
            2xl:grid-cols-5"
            >
              {listings.map((listing) => (
                <ListingItem key={listing.id} listing={listing} />
              ))}
            </ul>
            {lastFetchedListing && (
              <div className="flex justify-center items-center">
                <Button onClick={fetchListings} secondary text="Load more" />
              </div>
            )}
          </main>
        </>
      ) : (
        <p>There are no current places for {params.categoryName}</p>
      )}
    </div>
  );
}
