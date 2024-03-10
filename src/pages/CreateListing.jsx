import React, {useState} from 'react'
import CreateListingLabel from '../components/createListing/CreateListingLabel';


export default function CreateListing() {

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
        discountedPrice
    } = formData;

    function onChange() {

    }
  
    return (
    <main className='max-w-md px-2 mx-auto'>
        <h1 className='text-3xl text-center mt-6 font-bold '> Create a Listing </h1>
        <form>
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
                Create Listing
            </button>
        </form>
    </main>
  )
}
