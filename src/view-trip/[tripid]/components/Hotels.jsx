import React from 'react'
import { Link } from 'react-router-dom'

function Hotels({ trip }) {
  return (
    <div>
      <h2 className='font-bold text-xl mt-5'>Hotel Recommendations</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-4'>
        {trip?.tripData?.hotels?.map((hotel, index) => (
          <Link
            key={index}
            to={
              'https://www.google.com/maps/search/?api=1&query=' +
              hotel.hotel_name +
              ',' +
              hotel?.address
            }
            target='_blank'
          >
            <div className='cursor-pointer hover:scale-105 transition-all'>
              <img
                src={
                  index === 0
                    ? '/hotel1.jpeg'
                    : index === 1
                    ? '/hotel2.jpeg'
                    : '/hotel3.jpeg'
                }
                alt={`Hotel ${index}`} className='rounded-xl'
              />
              <div className='my-2 flex flex-col gap-3'>
                <h2 className='font-medium'>{hotel.hotel_name}</h2>
                <h2 className='text-xs text-gray-500'>📍 {hotel.address}</h2>
                <h2 className='text-xs'>Price per Day : $ {hotel.price_per_night_usd}</h2>
                <h2 className='text-sm'>⭐ {hotel.rating}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Hotels
