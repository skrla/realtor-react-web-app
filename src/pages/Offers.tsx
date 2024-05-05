import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import H1 from "../components/headers/H1";
import Button from "../components/Button";
import { fetchListingsOffer } from "../backend/listings";
import { ListingType } from "../types/listingTypes";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export default function Offers() {
  const [listings, setListings] = useState<ListingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] =
    useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(null);

  async function fetchListings() {
    const fetch = await fetchListingsOffer(lastFetchedListing);
    if (fetch) {
      const { listings: listListing, lastVisible } = fetch;
      setLastFetchedListing(lastVisible);
      setListings((prevState) => [...prevState, ...listListing]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-3">
      <H1 title="Offers" />
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
                <ListingItem
                  key={listing.id}
                  listing={listing}
                  onDelete={() => ""}
                  onEdit={() => ""}
                />
              ))}
            </ul>
            {lastFetchedListing && (
              <div className="flex justify-center items-center">
                <Button secondary onClick={fetchListings} text="Load more" />
              </div>
            )}
          </main>
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  );
}
