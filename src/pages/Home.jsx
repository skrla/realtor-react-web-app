import React, { useEffect, useState } from 'react'
import Slider from '../components/Slider'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import {Link} from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Home() {

  const [offerListings, setOfferListings] = useState(null);

  useEffect(()=>{
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, where("offer", "==", true), orderBy("timestamp", "desc"), limit(4));
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        });
        setOfferListings(listings)
      } catch (error) {
        toast.error("No listings available")
      }
    };
    fetchListings();
  }, [])

  const [rentListings, setRentListings] = useState(null);

  useEffect(()=>{
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, where("type", "==", "rent"), orderBy("timestamp", "desc"), limit(4));
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        });
        setRentListings(listings)
      } catch (error) {
        console.log(error)
        toast.error("No listings available")
      }
    };
    fetchListings();
  }, [])


  const [sellListings, setSellListings] = useState(null);

  useEffect(()=>{
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, where("type", "==", "sell"), orderBy("timestamp", "desc"), limit(4));
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        });
        setSellListings(listings)
      } catch (error) {
        console.log(error)
        toast.error("No listings available")
      }
    };
    fetchListings();
  }, [])

  return (
    <div>
        <Slider/>
        <div className='max-w-6xl mx-auto pt-4 space-y-6'>
          {offerListings && offerListings.length > 0 && (
            <div className='m-2 mb-6'>
              <h2 className='px-3 text-2xl mt-6 font-semibold'>
                Recent offers
              </h2>

              <Link to="/offers">
                <p className='px-3 text-sm text-blue-600 hover:text-blue-800
                transition duration-150 ease-in-out'>
                  Show more offers
                </p>
              </Link>
              <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {offerListings.map((listing) => (
                  <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
                ))}
              </ul>
            </div>
          )}
          {rentListings && rentListings.length > 0 && (
            <div className='m-2 mb-6'>
              <h2 className='px-3 text-2xl mt-6 font-semibold'>
                Places for rent
              </h2>

              <Link to="/category/rent">
                <p className='px-3 text-sm text-blue-600 hover:text-blue-800
                transition duration-150 ease-in-out'>
                  Show more places for rent
                </p>
              </Link>
              <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {rentListings.map((listing) => (
                  <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
                ))}
              </ul>
            </div>
          )}
          {sellListings && sellListings.length > 0 && (
            <div className='m-2 mb-6'>
              <h2 className='px-3 text-2xl mt-6 font-semibold'>
                Places for sale
              </h2>

              <Link to="/category/sell">
                <p className='px-3 text-sm text-blue-600 hover:text-blue-800
                transition duration-150 ease-in-out'>
                  Show more places for sale
                </p>
              </Link>
              <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {sellListings.map((listing) => (
                  <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
                ))}
              </ul>
            </div>
          )}
        </div>
    </div>
  )
}
