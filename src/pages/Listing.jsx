/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaShare } from 'react-icons/fa';

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
        const res = await fetch(`https://hibow.in/api/Provider/GetListingByUserIdAndServiceName?serviceName=${selectedType}&userId=${id}`);
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

  const renderListingDetails = () => (
    <>
      <div
        className='image-banner'
        style={{
          backgroundImage: `url(${listing?.serviceHome.photo1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '300px', // Adjust height as per your design
        }}
      />
      <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
        <FaShare className='text-slate-500' onClick={handleShareClick} />
      </div>
      {copied && (
        <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
          Link copied!
        </p>
      )}

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
        
        {/* Display answers */}
        <div className="mt-6">
          <ul className="mt-3">
            {/* Map over hardcoded questions and display answers */}
            <li className="text-slate-800">
              <strong>Number of pets that will be watched at one time:</strong> {listing?.answer.find(item => item.answer.question_id === 32)?.answer.ans}
            </li>
            <li className="text-slate-800">
              <strong>Accepted Pet Types:</strong> {listing?.answer.find(item => item.answer.question_id === 33)?.answer.ans}
            </li>
            <li className="text-slate-800">
              <strong>Accepted Pet size:</strong> {listing?.answer.find(item => item.answer.question_id === 34)?.answer.ans}
            </li>
            <li className="text-slate-800">
              <strong>The number of potty breaks provided per day:</strong> {listing?.answer.find(item => item.answer.question_id === 35)?.answer.ans}
            </li>
            <li className="text-slate-800">
              <strong>The place your pet will be if they are left unsupervised at home:</strong> {listing?.answer.find(item => item.answer.question_id === 36)?.answer.ans}
            </li>
            <li className="text-slate-800">
              <strong>The number of walks provided per day:</strong> {listing?.answer.find(item => item.answer.question_id === 37)?.answer.ans}
            </li>
            <li className="text-slate-800">
              <strong>Charge per day:</strong> {listing?.answer.find(item => item.answer.question_id === 38)?.answer.ans}
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
    </>
  );

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}
      {listing && !loading && !error && renderListingDetails()}
    </main>
  );
};

export default Listing;
