import { getAuth, updateCurrentUser, updateProfile } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import {doc, updateDoc } from 'firebase/firestore'
import {db} from '../firebase'
import { FcHome } from "react-icons/fc";
import { Link } from 'react-router-dom';

 
export default function Profile() {

  const auth = getAuth();
  const navigate = useNavigate();
  const [changeName, setChangeName] = useState(false);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });

  const {name, email} = formData;

  async function onLogout() {

    auth.signOut();
    
    navigate("/");

  }

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  async function onSubmit() {
    try {
      if(auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {displayName: name});
      }
      
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {name,});
      toast.success("Profile details updated")

    } catch (error) {
      toast.error("Could not update the profile details")
    }
  }

  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold'>
          My Profile
        </h1>
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form>
            <input type="text" id='name' value={name} 
              disabled={!changeName} onChange={onChange} 
              className={`w-full px-4 py-2 text-xl text-gray-700 
             border-gray-300 rounded transition ease-in-out mb-6
              ${changeName ? "bg-red-200 focus:bg-red-200" : "bg-white" }`}/>

            <input type="email" id='email' value={email} 
              disabled className='w-full px-4 py-2 text-xl text-gray-700 
            bg-white border-gray-300 rounded transition ease-in-out mb-6' />

            <div className='flex justify-between mb-6 whitespace-nowrap text-sm sm:text-lg'>
              <p className='flex items-center'>Do you want to change your name?
                <span onClick={() => {
                  changeName && onSubmit();
                  setChangeName((prevState) => !prevState)
                }} className='text-red-600 hover:to-red-700 
                transition duration-200 ease-in-out ml-1 cursor-pointer'>
                  {changeName ? "Apply change" : "Edit"}
                </span>
              </p>
              <p onClick={onLogout} className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer'>
                Sing out
              </p>
            </div>
          </form>
          <button type="submit" className="w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 active:bg-blue-800 transition duration-150 ease-in-out hover:shadow-lg">
            <Link to="/create-listing" className='flex justify-center items-center '>
              <FcHome className='mr-2 text-3xl bg-red-200 rounded-full p-1 border-2'/>
              Sell or rent your home
            </Link>
          </button>
        </div>
      </section>
    </>
  )
}
