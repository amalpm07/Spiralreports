/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

const ListingItem = ({ listing }) => {
  const {
    id,
    serviceName,
    hostelName,
    address,
    description,
    photo1,
    // eslint-disable-next-line no-unused-vars
    photo2,
    photo3,
    photo4,
    photo5,
    photo6,
  } = listing;

  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <Link to={`/listing/${id}`}>
        <img
          src={photo1 || 'https://via.placeholder.com/595x400'}
          alt='Listing cover'
          className='h-[220px] sm:h-[320px] w-full object-cover hover:scale-105 transition-scale duration-300'
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/595x400'; // Placeholder image or default image URL
          }}
        />
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='truncate text-lg font-semibold text-slate-700'>
            {serviceName}
          </p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p className='text-sm text-gray-600 truncate w-full'>
              {address || 'Address not provided'}
            </p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>
            {description || 'No description available'}
          </p>
          <p className='text-slate-500 mt-2 font-semibold'>
            {hostelName}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
