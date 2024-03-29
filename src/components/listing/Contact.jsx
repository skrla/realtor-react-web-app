import { useEffect, useState } from "react";
import {db} from "../../firebase";
import {doc, getDoc } from "firebase/firestore"
import { toast } from "react-toastify";

export default function Contact({userRef, listing}) {
    
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(()=> {

        async function getLandlord() {
            const docRef = doc(db, "users", userRef);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()) {
                setLandlord(docSnap.data()); 
            } else {
                toast.error("Could not get landlord data");
            }
        }
        getLandlord();
    }, [userRef]);

    function onChange(e) {
        setMessage(e.target.value)
    }
  
    return (
        <>{landlord !== null && (
            <div className="flex flex-col w-full">
                <p>
                    Contact {landlord.name} for the {listing.title.toLowerCase()}
                </p>
                <div>
                    <textarea name="message" id="message" rows="2" 
                    value={message} onChange={onChange} 
                    className="w-full px-4 py-2 text-xl text-gray-700
                    bg-white border border-gray-300 rounded transition
                    duration-150 ease-in-out mt-3
                    focus:text-gray-700 focus:bg-white focus:border-slate-600">
                    </textarea>
                </div>
                <a href={`mailto:${landlord.email}?Subject=${listing.title}&body=${message}`}>
                    <button type="button" className="my-6 px-7 py-3 bg-blue-600
                    text-white rounded text-sm uppercase shadow-md
                    hover:shadow-lg hover:bg-blue-700 focus:bg-blue-700
                    focus:shadow-lg active:shadow-lg active:bg-blue-800
                    transition duration-150 ease-in-out w-full text-center">
                        Send Message
                    </button>
                </a>
            </div>
        )}
        </>
    )
}
