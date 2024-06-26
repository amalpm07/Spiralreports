import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaShare, FaDog, FaCat, FaPaw, FaBed,  FaStar } from 'react-icons/fa';
import '../styleComponets/styledComponents.css';

// const Map = ({ lat, lng }) => {
//   if (!lat || !lng) return null;

//   const mapLink = `https://maps.google.com/?q=Dolittle@${lat},${lng}`;
//   const iframeSrc = `https://www.google.com/maps/embed/v1/view?key=AIzaSyBEveG1KjtzqKXgVnimrIELXixBHG1GzWc&center=${lat},${lng}&maptype=roadmap&zoom=13`;

//   return (
//     <div id="map" className="my-6">
//       <a href={mapLink} target="_blank" rel="noopener noreferrer">
//         <iframe
//           style={{ border: 0, width: '100%', height: '300px' }}
//           src={iframeSrc}
//           frameBorder="0"
//           scrolling="no"
//           marginHeight="0"
//           marginWidth="0"
//           title="Google Map"
//         ></iframe>
//       </a>
//     </div>
//   );
// };

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ text: '', rating: 0 });
  const [reviewError, setReviewError] = useState(null);
  const navigate = useNavigate();

  const { selectedType, id } = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error before fetching
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
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`https://hibow.in/api/Provider/GetReviewsByListingId?listingId=${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Optionally, you can set an empty array or handle the error state here
        setReviews([]); // Set reviews to an empty array or handle the error state
      }
    };
    
    fetchListing();
    fetchReviews();
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.text || !newReview.rating) {
      setReviewError('Please provide a rating and a review.');
      return;
    }
    try {
      const res = await fetch('https://hibow.in/api/Provider/AddReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newReview, listingId: id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error('Failed to submit review');
      }
      setReviews([...reviews, data]);
      setNewReview({ text: '', rating: 0 });
      setReviewError(null);
    } catch (error) {
      console.error('Error submitting review:', error);
      setReviewError('Failed to submit review');
    }
  };

  const renderListingDetails = () => {
    const acceptedPetTypes =
      listing?.answer.find((item) => item.answer.question_id === 33)?.answer.ans.split(', ') || [];
    const petTypeIcons = {
      Dogs: <FaDog className='text-xl' />,
      Cats: <FaCat className='text-xl' />,
      Rabbits: <FaPaw className='text-xl' />,
      'Guinea Pigs': <FaPaw className='text-xl' />,
    };

    const acceptedPetSizes =
      listing?.answer.find((item) => item.answer.question_id === 34)?.answer.ans.split(', ') || [];
    const petSizeIcons = {
      '1-5kg': <FaPaw className='text-xl' />,
      '5-10kg': <FaPaw className='text-xl' />,
      '10-20kg': <FaPaw className='text-xl' />,
    };

    // const lat = listing?.serviceHome.latitude;
    // const lng = listing?.serviceHome.longitude;

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

          {/* Map Component */}
          {/* {lat && lng ? (
            <Map lat={lat} lng={lng} />
          ) : (
            <p className='text-center text-red-600'>Location not available</p>
          )} */}

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
                <strong>Number of pets that will be watched at one time:</strong>
                <div className='flex items-center gap-2'>
                  <span>{listing?.answer.find((item) => item.answer.question_id === 32)?.answer.ans}</span>
                </div>
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
              <li className='text-slate-800'>
                <strong>The number of walks provided per day:</strong>
                <div className='flex items-center gap-2'>
                  <FaPaw className='text-xl' />
                  <span>{listing?.answer.find((item) => item.answer.question_id === 37)?.answer.ans}</span>
                </div>
              </li>
              <li className='text-slate-800'>
                <strong>The place your pet will sleep at night:</strong>
                <div className='flex items-center gap-2'>
                  <FaBed className='text-xl' />
                  <span>{listing?.answer.find((item) => item.answer.question_id === 36)?.answer.ans}</span>
                </div>
              </li>
              <li className='text-slate-800'>
                <strong>Charge per day:</strong>
                <div className='flex items-center gap-2'>
                  <span>{listing?.answer.find((item) => item.answer.question_id === 38)?.answer.ans}</span>
                </div>
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

          {/* Review Section */}
          <div className='mt-10'>
            <h2 className='text-2xl font-semibold'>Reviews</h2>
            {reviews.length === 0 ? (
              <p className='text-slate-600 mt-4'>No reviews yet. Be the first to review!</p>
            ) : (
              <ul className='mt-4 space-y-4'>
                {reviews.map((review, index) => (
                  <li key={index} className='p-4 border rounded-lg'>
                    <div className='flex items-center gap-2'>
                      {[...Array(review.rating)].map((_, i) => (
                        <FaStar key={i} className='text-yellow-500' />
                      ))}
                    </div>
                    <p className='mt-2'>{review.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Review Form */}
          <form onSubmit={handleReviewSubmit} className='mt-6'>
            <h3 className='text-xl font-semibold'>Add a Review</h3>
            <div className='mt-4'>
              <label htmlFor='rating' className='block text-slate-800'>
                Rating:
              </label>
              <select
                id='rating'
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                className='mt-1 block w-full p-2 border rounded-md'
              >
                <option value='0'>Select Rating</option>
                <option value='1'>1 Star</option>
                <option value='2'>2 Stars</option>
                <option value='3'>3 Stars</option>
                <option value='4'>4 Stars</option>
                <option value='5'>5 Stars</option>
              </select>
            </div>
            <div className='mt-4'>
              <label htmlFor='reviewText' className='block text-slate-800'>
                Review:
              </label>
              <textarea
                id='reviewText'
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                className='mt-1 block w-full p-2 border rounded-md'
              />
            </div>
            {reviewError && <p className='text-red-600 mt-2'>{reviewError}</p>}
            <button
              type='submit'
              className='bg-green-600 text-white rounded-lg uppercase hover:opacity-95 p-3 mt-4'
            >
              Submit Review
            </button>
          </form>
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
      {error && <p className='text-center my-7 text-2xl'>{error}</p>}
      {listing && !loading && !error && renderListingDetails()}
    </main>
  );
};

export default Listing;
