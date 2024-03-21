import React, {useEffect, useState} from 'react'
import CreateListingLabel from '../components/createListing/CreateListingLabel';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {getAuth} from 'firebase/auth';
import {v4 as uuidv4} from 'uuid'
import { doc, getDoc, serverTimestamp, updateDoc} from 'firebase/firestore';
import {db} from '../firebase';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';


export default function EditListing() {

    const [geoLocationEnabled, setGeoLocationEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState(null);
    const auth = getAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
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
        images: {},
        latitude: 0,
        longitude: 0,
    });
    const {
        type, 
        title, 
        bedrooms, 
        bathrooms, 
        parking, 
        furnished, 
        address, 
        description, 
        offer,
        regularPrice,
        discountedPrice,
        images,
        latitude,
        longitude
    } = formData;

    const params = useParams();

    useEffect(()=> {
        if(listing && listing.userRef !== auth.currentUser.uid ) {
            toast.error("You can't edit this listing");
            navigate("/");
        }
    }, [auth.currentUser.uid, listing, navigate]);
    
    useEffect(()=> {
        setLoading(true);
        async function fetchListing() {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()) {
                setListing(docSnap.data())
                setFormData({
                    ...docSnap.data()
                });
                setLoading(false);
            } else {
                navigate("/");
                toast.error("Listing does not exists");
            }
        }
        fetchListing();
    }, [navigate, params.listingId])



    function onChange(e) {
        let boolean = null;
        if(e.target.value === "true") {
            boolean = true;
        }
        if(e.target.value === "false") {
            boolean = false;
        }
        if(e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files,
            }));
        }
        if(!e.target.files) {
            setFormData((prevState) =>({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }));
        }
    }

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        if(offer && +regularPrice <= +discountedPrice) {
            setLoading(false);
            toast.error("Discounted price needs to be less than regular price")
            return;
        }
        if(images.length > 6){
            setLoading(false);
            toast.error("Maximum 6 images is allowed");
            return;
        }
        let geolocation = {};
        let location;
        if(geoLocationEnabled) {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`);
            const data = await response.json();
            console.log(data)
            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

            location = data.status === "ZERO_RESULTS" && undefined;

            if(location === undefined) {
                setLoading(false);
                toast.error("Please enter the correct address");
                return;
            }
        } else {
            geolocation.lat = latitude;
            geolocation.lng = longitude;
        }

        const imgUrls = await Promise.all(
            [...images]
            .map((image) => storeImage(image)))
            .catch((error) => {
                setLoading(false);
                toast.error("Images not uploaded");
                return;
            });

        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
            timestamp: serverTimestamp(),
            userRef: auth.currentUser.uid,
        }
        delete formDataCopy.latitude;
        delete formDataCopy.longitude;
        delete formDataCopy.images;
        !formDataCopy.offer && delete formDataCopy.discountedPrice;
        const docRef = doc(db, "listings", params.listingId); 
        await updateDoc(docRef, formDataCopy);
        setLoading(false);
        toast.success("Listing edited ");
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }

    async function storeImage(image) {
        return new Promise((resolve, reject) => {
            const storage = getStorage();
            const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
            const storageRef = ref(storage, filename);
            const uploadTask = uploadBytesResumable(storageRef, image);
            uploadTask.on('state_changed', 
            (snapshot) => {

              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;
                case 'running':
                  console.log('Upload is running');
                  break;
              }
            }, 
            (error) => {
              reject(error);
            }, 
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              });
            }
          );
        })
    }

    if(loading) {
        return <Spinner/>
    }

    return (
    <main className='max-w-md px-2 mx-auto'>
        <h1 className='text-3xl text-center mt-6 font-bold '> Edit Listing </h1>
        <form onSubmit={onSubmit}>
            <CreateListingLabel>Sell / Rent</CreateListingLabel>
            <div className='flex'>
                <button type='button' id="type" value="sell" onClick={onChange}
                className={`mr-3 uppercase px-7 py-3 font-medium text-sm  shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    type === "rent" ? "bg-white text-black" : "bg-slate-600 text-white"
                }`} >
                    sell
                </button>
                <button type='button' id="type" value="rent" onClick={onChange}
                className={`ml-3 uppercase px-7 py-3 font-medium text-sm  shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    type === "sell" ? "bg-white text-black" : "bg-slate-600 text-white"
                }`} >
                    rent
                </button>
            </div>
            
            
            <CreateListingLabel>Title</CreateListingLabel>
            <input type="text" id="title" value={title} onChange={onChange} 
            placeholder='Title' maxLength="32" minLength="10" required
            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded 
            transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6' />
            <div className='flex space-x-6 mb-6'>
                <div>
                    <p className='text-lg font-semibold'>Beds</p>
                    <input type="number" id="bedrooms" value={bedrooms}
                    onChange={onChange} min="1" max="50" required
                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 
                    rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white 
                    focus:border-slate-600 text-center' />
                </div>
                <div>
                    <p className='text-lg font-semibold'>Baths</p>
                    <input type="number" id="bathrooms" value={bathrooms}
                    onChange={onChange} min="1" max="50" required
                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 
                    rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white 
                    focus:border-slate-600 text-center' />
                </div>
            </div>
            
            
            <CreateListingLabel>Parking spot</CreateListingLabel>
            <div className='flex'>
                <button type='button' id="parking" value={true} onClick={onChange}
                className={`mr-3 uppercase px-7 py-3 font-medium text-sm  shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    !parking ? "bg-white text-black" : "bg-slate-600 text-white"
                }`} >
                    yes
                </button>
                <button type='button' id="parking" value={false} onClick={onChange}
                className={`ml-3 uppercase px-7 py-3 font-medium text-sm  shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    parking ? "bg-white text-black" : "bg-slate-600 text-white"
                }`} >
                    no
                </button>
            </div>
            
            
            <CreateListingLabel>Furnished</CreateListingLabel>
            <div className='flex'>
                <button type='button' id="furnished" value={true} onClick={onChange}
                className={`mr-3 uppercase px-7 py-3 font-medium text-sm  shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
                }`} >
                    yes
                </button>
                <button type='button' id="furnished" value={false} onClick={onChange}
                className={`ml-3 uppercase px-7 py-3 font-medium text-sm  shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    furnished ? "bg-white text-black" : "bg-slate-600 text-white"
                }`} >
                    no
                </button>
            </div>
            
            
            <CreateListingLabel>Address</CreateListingLabel>
            <textarea type="text" id="address" value={address} onChange={onChange} 
            placeholder='Address' required
            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded 
            transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' />
            
            {!geoLocationEnabled && (
                <div className='flex space-x-6'>
                    <div>
                        <CreateListingLabel>Latitude</CreateListingLabel>
                        <input type="number" id="latitude" value={latitude} min="-90" max="90"
                        onChange={onChange} required className='w-full px-4 py-2 text-xl
                        text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out
                        focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center'  />
                    </div>
                    <div>
                        <CreateListingLabel>Longitude</CreateListingLabel>
                        <input type="number" id="longitude" value={longitude} min="-180" max="180"
                        onChange={onChange} required className='w-full px-4 py-2 text-xl
                        text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out
                        focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center'  />
                    </div>
                </div>
            )}
            
            <CreateListingLabel>Description</CreateListingLabel>
            <textarea type="text" id="description" value={description} onChange={onChange} 
            placeholder='Description'  required
            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded 
            transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' />
            
            
            <CreateListingLabel>Offer</CreateListingLabel>
            <div className='flex'>
                <button type='button' id="offer" value={true} onClick={onChange}
                className={`mr-3 uppercase px-7 py-3 font-medium text-sm  shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    !offer ? "bg-white text-black" : "bg-slate-600 text-white"
                }`} >
                    yes
                </button>
                <button type='button' id="offer" value={false} onClick={onChange}
                className={`ml-3 uppercase px-7 py-3 font-medium text-sm  shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    offer ? "bg-white text-black" : "bg-slate-600 text-white"
                }`} >
                    no
                </button>
            </div>

        
            <CreateListingLabel>Regular price</CreateListingLabel>
            <div className='mb-6 flex w-full justify-center items-center space-x-6'>
                <input type="number" id="regularPrice" value={regularPrice} onChange={onChange}
                min="50" max="40000000" required
                className='w-full  px-4 py-2 text-xl rounded transition duration-150 ease-in-out
                text-gray-700 bg-white border border-gray-300 focus:text-gray-700 focus:bg-white
                focus:border-slate-600 text-center' />
                {type === "rent" && (
                    <div>
                        <p className='text-md w-full whitespace-nowrap'>$ / Month</p>
                    </div>
                )}
            </div>
            {offer && (
                <div>
                    <CreateListingLabel>Discounted price</CreateListingLabel>
                    <div className='mb-6 flex w-full justify-center items-center space-x-6'>
                        <input type="number" id="discountedPrice" value={discountedPrice} onChange={onChange}
                        min="50" max="40000000" required={offer}
                        className='w-full  px-4 py-2 text-xl rounded transition duration-150 ease-in-out
                        text-gray-700 bg-white border border-gray-300 focus:text-gray-700 focus:bg-white
                        focus:border-slate-600 text-center' />
                        {type === "rent" && (
                            <div>
                                <p className='text-md w-full whitespace-nowrap'>$ / Month</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div>
                <CreateListingLabel>Images</CreateListingLabel>
                <p className='text-gray-600'>The first image will be the cover (max 6)</p>
                <input type="file" name="images" id="images" 
                onChange={onChange} accept='.jpg, .png, .jpeg'
                multiple required
                className='w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 
                rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600' />
            </div>
            <button type="submit" className='my-6 w-full px-7 py-3 
            bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md
            hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg
            active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>
                Edit Listing
            </button>
        </form>
    </main>
  )
}
