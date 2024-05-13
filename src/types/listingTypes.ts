import { FieldValue } from "firebase/firestore";

export type ListingType = {
  address: string;
  bathrooms: number;
  bedrooms: number;
  description: string;
  furnished: boolean;
  geoLocation: LocationType;
  imgUrls: string[];
  offer: boolean;
  parking: boolean;
  regularPrice: string;
  timestamp: any;
  title: string;
  type: string;
  userRef: string;
  discountedPrice?: string;
  id: string;
};

export type LocationType = {
  lat: number;
  lng: number;
};

export type ListingFirebaseType = {
  address: string;
  bathrooms: number;
  bedrooms: number;
  description: string;
  furnished: boolean;
  geoLocation: LocationType;
  imgUrls: string[];
  offer: boolean;
  parking: boolean;
  regularPrice: string;
  timestamp: any;
  title: string;
  type: string;
  userRef: string;
  discountedPrice?: string;
};

export type CreateListingType = {
  address: string;
  bathrooms: number;
  bedrooms: number;
  description: string;
  furnished: boolean;
  geoLocation: LocationType;
  imgUrls: FileList | null;
  offer: boolean;
  parking: boolean;
  regularPrice: number;
  title: string;
  type: string;
  discountedPrice?: number;
};
