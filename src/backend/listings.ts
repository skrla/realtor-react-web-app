import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { User } from "firebase/auth";
import { ListingFirebaseType, ListingType } from "../types/listingTypes";

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
