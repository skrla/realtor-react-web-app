import {
  DocumentData,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { Auth, User } from "firebase/auth";
import {
  CreateListingType,
  ListingFirebaseType,
  ListingType,
} from "../types/listingTypes";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const listingDb = "listings";

export const deleteListing = async (listingId: string) => {
  await deleteDoc(doc(db, listingDb, listingId));
  toast.success("Successfully deleted the listing");
};

export const fetchListingsUser = async (currentUser: User) => {
  const listingRef = collection(db, listingDb);
  const q = query(
    listingRef,
    where("userRef", "==", currentUser.uid),
    orderBy("timestamp", "desc")
  );
  const querySnap = await getDocs(q);
  let listings: ListingType[] = [];
  querySnap.forEach((doc) => {
    return listings.push({
      id: doc.id,
      ...(doc.data() as ListingFirebaseType),
    });
  });
  return listings;
};

export const fetchListingsOffer = async (
  lastFetchedListing: QueryDocumentSnapshot<unknown, DocumentData> | null
) => {
  try {
    const listingRef = collection(db, listingDb);
    let q;
    if (lastFetchedListing !== null) {
      q = query(
        listingRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(4)
      );
    } else {
      q = query(
        listingRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        limit(8)
      );
    }
    const querySnap = await getDocs(q);

    const listings: ListingType[] = [];
    querySnap.forEach((doc) => {
      return listings.push({
        id: doc.id,
        ...(doc.data() as ListingFirebaseType),
      });
    });
    const lastVisible = querySnap.docs[querySnap.docs.length - 1];
    return { listings, lastVisible };
  } catch (error) {
    toast.error("Could not fetch listing");
  }
};

export const fetchListingsCategory = async (
  lastFetchedListing: QueryDocumentSnapshot<unknown, DocumentData> | null,
  category: string
) => {
  try {
    const listingRef = collection(db, listingDb);
    let q;
    if (lastFetchedListing !== null) {
      q = query(
        listingRef,
        where("type", "==", category),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(4)
      );
    } else {
      q = query(
        listingRef,
        where("type", "==", category),
        orderBy("timestamp", "desc"),
        limit(8)
      );
    }
    const querySnap = await getDocs(q);

    const listings: ListingType[] = [];
    querySnap.forEach((doc) => {
      return listings.push({
        id: doc.id,
        ...(doc.data() as ListingFirebaseType),
      });
    });
    const lastVisible = querySnap.docs[querySnap.docs.length - 1];
    return { listings, lastVisible };
  } catch (error) {
    toast.error("Could not fetch listing");
  }
};

export const fetchListingsSpinner = async () => {
  const listingsRef = collection(db, "listings");
  const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
  const querySnap = await getDocs(q);
  let listings: ListingType[] = [];
  querySnap.forEach((doc) => {
    return listings.push({
      id: doc.id,
      ...(doc.data() as ListingFirebaseType),
    });
  });
  return listings;
};

export const storeImageBackend = async (image: File, auth: Auth) => {
  return new Promise((resolve, reject) => {
    if (auth.currentUser) {
      const storage = getStorage();

      const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress.toFixed(2)}% done`);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
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
    }
  });
};

export const saveListing = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  formData: CreateListingType,
  geoLocationEnabled: boolean,
  auth: Auth
) => {
  setLoading(true);
  if (
    formData.offer &&
    formData.discountedPrice &&
    +formData.regularPrice <= +formData.discountedPrice
  ) {
    setLoading(false);
    toast.error("Discounted price needs to be less than regular price");
    return;
  }
  if (formData.imgUrls && formData.imgUrls.length > 6) {
    setLoading(false);
    toast.error("Maximum 6 images is allowed");
    return;
  }
  let geolocation = {
    lat: 0,
    lng: 0,
  };
  let location;
  if (geoLocationEnabled) {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${formData.address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
    );
    const data = await response.json();
    console.log(data);
    geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
    geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

    location = data.status === "ZERO_RESULTS" && undefined;

    if (location === undefined) {
      setLoading(false);
      toast.error("Please enter the correct address");
      return;
    }
  } else {
    geolocation.lat = formData.geoLocation.lat;
    geolocation.lng = formData.geoLocation.lng;
  }

  if (formData.imgUrls) {
    const imgUrls = await Promise.all(
      Array.from(formData.imgUrls).map((image) =>
        storeImageBackend(image, auth)
      )
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });
  }

  if (auth.currentUser) {
    const formDataCopy = {
      ...formData,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing created");
    return docRef.id;
  }
  setLoading(false);
  toast.error("Listing not created");
};
