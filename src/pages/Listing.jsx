import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaShare,
  FaDog,
  FaCat,
  FaPaw,
  FaBed,
  FaPoop,
  FaHome,
 
} from 'react-icons/fa';

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const { selectedType, id } = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://hibow.in/api/Provider/GetListingByUserIdAndServiceName?serviceName=${selectedType}&userId=${id}`
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error('Failed to fetch listing');
        }
        setListing(data);
      } catch (error) {
        console.error('Error fetching listing:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [selectedType, id]);

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleBookNowClick = () => {
    navigate('/booking', { state: { listing } });
  };

  const renderListingDetails = () => {
    const acceptedPetTypes =
      listing?.answer.find((item) => item.answer.question_id === 33)?.answer
        .ans.split(', ') || [];
    const petTypeIcons = {
      Dogs: <FaDog className='text-xl' />,
      Cats: <FaCat className='text-xl' />,
      Rabbits: <FaPaw className='text-xl' />,
      'Guinea Pigs': <FaPaw className='text-xl' />,
    };

    const acceptedPetSizes =
      listing?.answer.find((item) => item.answer.question_id === 34)?.answer
        .ans.split(', ') || [];
    const petSizeIcons = {
      '1-5kg': <FaPaw className='text-xl' />,
      '5-10kg': <FaPaw className='text-xl' />,
      '10-20kg': <FaPaw className='text-xl' />,
    };

    return (
      <>
        <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
          <p className='text-2xl font-semibold'>
            {listing?.serviceHome.hostelName}
          </p>
          <p className='flex items-center mt-6 gap-2 text-slate-600 text-sm'>
            <FaMapMarkerAlt className='text-green-700' />
            {listing?.serviceHome.address}
          </p>
          <p className='text-slate-800'>
            <span className='font-semibold text-black'>Description - </span>
            {listing?.serviceHome.description}
          </p>

          {/* Image Gallery */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6'>
            {Object.keys(listing?.serviceHome)
              .filter(
                (key) => key.startsWith('photo') && listing.serviceHome[key]
              )
              .map((key, index) => (
                <div
                  key={index}
                  className='relative overflow-hidden rounded-lg'
                  style={{
                    paddingTop: '100%', // Maintain aspect ratio 1:1
                    backgroundImage: `url(${listing?.serviceHome[key]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              ))}
          </div>

          {/* Display answers */}
          <div className='mt-6'>
            <ul className='mt-3 space-y-4'>
              <li className='text-slate-800'>
                <strong>Number of pets that will be watched at one time:</strong>{' '}
                {
                  listing?.answer.find(
                    (item) => item.answer.question_id === 32
                  )?.answer.ans
                }
              </li>
              <li className='text-slate-800'>
                <strong>Accepted Pet Types:</strong>
                <div className='flex gap-2'>
                  {acceptedPetTypes.map((type) => (
                    <span key={type} className='flex items-center gap-1'>
                      {petTypeIcons[type]} {type}
                    </span>
                  ))}
                </div>
              </li>
              <li className='text-slate-800'>
                <strong>Accepted Pet size:</strong>
                <div className='flex gap-2'>
                  {acceptedPetSizes.map((size) => (
                    <span key={size} className='flex items-center gap-1'>
                      {petSizeIcons[size]} {size}
                    </span>
                  ))}
                </div>
              </li>
              <li className='text-slate-800 flex items-center gap-2'>
                <FaPoop className='text-xl' />
                <strong>The number of potty breaks provided per day:</strong>{' '}
                {
                  listing?.answer.find(
                    (item) => item.answer.question_id === 35
                  )?.answer.ans
                }
              </li>
              <li className='text-slate-800 flex items-center gap-2'>
                <FaHome className='text-xl' />
                <strong>
                  The place your pet will be if they are left unsupervised at
                  home:
                </strong>{' '}
                {
                  listing?.answer.find(
                    (item) => item.answer.question_id === 36
                  )?.answer.ans
                }
              </li>
              <li className='text-slate-800 flex items-center gap-2'>
                <FaPaw className='text-xl' />
                <strong>The number of walks provided per day:</strong>{' '}
                {
                  listing?.answer.find(
                    (item) => item.answer.question_id === 37
                  )?.answer.ans
                }
              </li>
              <li className='text-slate-800 flex items-center gap-2'>
                <FaBed className='text-xl' />
                <strong>The place your pet will sleep at night:</strong>{' '}
                {
                  listing?.answer.find(
                    (item) => item.answer.question_id === 36
                  )?.answer.ans
                }
              </li>
              <li className='text-slate-800 flex items-center gap-2'>
              
                <strong>Charge per day:</strong>{' '}
                {
                  listing?.answer.find(
                    (item) => item.answer.question_id === 38
                  )?.answer.ans
                }
              </li>
            </ul>
          </div>

          {/* Add Book Now button */}
          <button
            onClick={handleBookNowClick}
            className='bg-green-600 text-white rounded-lg uppercase hover:opacity-95 p-3 mt-6'
          >
            Book Now
          </button>
        </div>

        {/* Share Link and Copy Notification */}
        <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
          <FaShare className='text-slate-500' onClick={handleShareClick} />
        </div>
        {copied && (
          <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
            Link copied!
          </p>
        )}
      </>
    );
  };

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}
      {listing && !loading && !error && renderListingDetails()}
    </main>
  );
};

export default Listing;
