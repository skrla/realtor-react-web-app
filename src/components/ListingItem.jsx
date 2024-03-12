import React from 'react'

export default function ListingItem({listing, id}) {
  return (
    <div className='max-w-6xl px-3 mt-6 mx-auto'>
      {listing.name}
    </div>
  )
}
