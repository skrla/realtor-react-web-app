import React, {useState} from 'react'
import CreateListingLabel from '../components/createListing/CreateListingLabel';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {getAuth} from 'firebase/auth';
import {v4 as uuidv4} from 'uuid'
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';
import {db} from '../firebase'
import { useNavigate } from 'react-router';

export default function CreateListing() {

    const [geoLocationEnabled, setGeoLocationEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
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
        const docRef = await addDoc(collection(db, "listings"), formDataCopy);
        setLoading(false);
        toast.success("Listing created");
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
        <h1 className='text-3xl text-center mt-6 font-bold '> Create a Listing </h1>
        
    </main>
  )
}
