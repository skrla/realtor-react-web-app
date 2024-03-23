import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import Spinner from '../components/Spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import { FaShare, FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair } from 'react-icons/fa'
import ListingIcons from "../components/listing/ListingIcons";
import {getAuth} from "firebase/auth";
import Contact from '../components/listing/Contact';

export default function Listing() {

    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const auth = getAuth();
    const [contactLandlord, setContactLandlord] = useState();

    useEffect(()=> {
        async function fetchListing() {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()) {
                setListing(docSnap.data());
                setLoading(false);
            }
        }
        fetchListing();

    }, [params.listingId]);

    if (loading) {
        return <Spinner />
    } else {
        return (
            <main>
                <Swiper modules={[EffectFade, Autoplay, Navigation, Pagination]} slidesPerView={1} 
                navigation pagination={{type: "progressbar"}} effect="fade"
                autoplay={{ delay: 10000}} >
                    {listing.imgUrls.map((url, index)=>(
                        <SwiperSlide key={index}>
                            <div className='relative w-full overflow-hidden h-[300px]' 
                            style={{background: `url(${url}) center no-repeat`,
                            backgroundSize: "cover" }} >

                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className='fixed top-[10%] right-[5%] z-10 
                bg-white cursor-pointer border-2 border-gray-400 rounded-full
                w-12 h-12 flex justify-center items-center' onClick={() =>{
                    navigator.clipboard.writeText(window.location.href);
                    setShareLinkCopied(true);
                    setTimeout(() => {
                        setShareLinkCopied(false);
                    }, 2000)
                }}>
                    <FaShare className='text-lg text-slate-500' />
                </div>
                { shareLinkCopied && <p className='fixed top-[15%] right-[2%] 
                font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2'>
                    Link Copied!
                </p>}

                <div className='m-4 flex flex-col md:flex-row max-w-6xl
                lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5'>
                    <div className="w-full">
                        <p className='text-2xl font-bold mb-3 text-blue-900'>
                            {listing.title} - $ {listing.offer ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                             : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                             {listing.type === "rent" ? " / month" : ""}
                        </p>
                        <p className='flex items-center mt-6 mb-3 font-semibold'>
                            <FaMapMarkerAlt className='text-green-700 mr-1'/>
                            {listing.address}
                        </p>
                        <div className='flex justify-start items-center space-x-4 w-[75%]'>
                            <p className='bg-red-700 w-full max-w-[200px] rounded-md p-1 text-white
                             text-center font-semibold shadow-md'>
                                {listing.type === "rent" ? "Rent" : "Sale"}
                            </p>
                            {listing.offer && (
                                <p className='w-full max-w-[200px] bg-green-700 rounded-md p-1 text-white text-center
                                font-semibold shadow-md'>
                                    ${+listing.regularPrice - +listing.discountedPrice} discount
                                </p>
                            )}
                        </div>
                        <p className='my-3'>
                            <span className='font-semibold '>Description - </span>
                            {listing.description}
                        </p>
                        <ul className="mb-6 flex items-center space-x-2 sm:space-x-10 text-sm font-semibold">
                            <ListingIcons>
                                <FaBed className='text-lg mr-1'/>
                                {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
                            </ListingIcons>
                            <ListingIcons>
                                <FaBath className='text-lg mr-1'/>
                                {+listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : "1 Bath"}
                            </ListingIcons>
                            <ListingIcons>
                                <FaParking className='text-lg mr-1'/>
                                {listing.parking ? "Parking Spot" : "No Parking"}
                            </ListingIcons>
                            <ListingIcons>
                                <FaChair className='text-lg mr-1'/>
                                {listing.furnished ? "Furnished" : "Not Furnished"}
                            </ListingIcons>
                        </ul>
                        {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
                            <div className='mt-6'>
                                <button onClick={() => setContactLandlord(true)} className='px-7 py-3 bg-blue-600 text-white font-medium
                                text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg
                                focus:bg-blue-700 focus:shadow-lg w-full text-center transition duration-150
                                ease-in-out'>
                                    Contact Landlord
                                </button>
                            </div>                            
                        )}
                        {contactLandlord && (
                            <Contact userRef={listing.userRef} listing={listing} />
                        )}

                    </div> 
                    <div className="w-full lg-[400px] h-[200px] z-10 overflow-x-hidden">

                    </div>
                </div>
            </main>
        )
    }
}
