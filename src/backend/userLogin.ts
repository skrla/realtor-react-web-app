import {
  User,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { FormDataCopyType, FormDataType } from "../types/userTypes";

export const signInUser = async ({ email, password }: FormDataType) => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userCredential.user) {
      return true;
    }
  } catch (error) {
    toast.error("Bad user credentials");
  }
  return false;
};

export const signUpUser = async (formData: FormDataType) => {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    if (auth.currentUser) {
      updateProfile(auth.currentUser, {
        displayName: formData.name,
      });
    }
    const user = userCredential.user;
    const formDataCopy: FormDataCopyType = {
      ...formData,
      timestamp: serverTimestamp(),
    };
    await setDoc(doc(db, "users", user.uid), formDataCopy);
  } catch (error) {
    toast.error("Something went wrong with registration");
  }
};

export const restartPassword = async (email: string) => {
  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
    toast.success("Email was sent");
  } catch (error) {
    toast.error("Could not send reset password");
  }
};

export const updateUser = async (
  currentUser: User, name: string
) => {
try {
  if (currentUser.displayName !== name) {
    await updateProfile(currentUser, { displayName: name });
  }

  const docRef = doc(db, "users", currentUser.uid);
  await updateDoc(docRef, { name });
  toast.success("Profile details updated");
} catch (error) {
  toast.error("Could not update the profile details");
}
}
