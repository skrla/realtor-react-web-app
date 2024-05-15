import React, { useState } from "react";
import CreateListingLabel from "../components/createListing/CreateListingLabel";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router";
import CreateListingForm from "../components/createListing/CreateListingForm";

export default function CreateListing() {

  return <CreateListingForm />;
}
