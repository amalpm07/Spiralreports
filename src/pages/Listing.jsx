import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaDog, FaCat, FaPaw, FaStar } from 'react-icons/fa';
import '../styleComponets/styledComponents.css';
import { useSelector } from 'react-redux';  // Import useSelector hook from react-redux

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [copied, setCopied] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ text: '', rating: 0 });
  const [reviewError, setReviewError] = useState(null);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const currentUser = useSelector((state) => state.user.currentUser);
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
        console.log(currentUser)
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `https://hibow.in/api/Booking/GetTheListofQuestions?serviceName=profile${selectedType}`
        );
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
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
        setReviews([]); // Set reviews to an empty array or handle the error state
      }
    };

    fetchListing();
    fetchQuestions();
    fetchReviews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, id]);

  // eslint-disable-next-line no-unused-vars
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
              {questions.map((question) => {
                const answer = listing?.answer.find(
                  (item) => item.answer.question_id === question.id
                )?.answer.ans;
                return (
                  <li key={question.id} className='text-slate-800'>
                    <strong>{question.questions}:</strong>
                    <div className='flex items-center gap-2'>
                      {question.id === 33 && (
                        <div className='flex gap-2'>
                          {acceptedPetTypes.map((type) => (
                            <span key={type} className='flex items-center gap-1'>
                              {petTypeIcons[type]} {type}
                            </span>
                          ))}
                        </div>
                      )}
                      {question.id === 34 && (
                        <div className='flex gap-2'>
                          {acceptedPetSizes.map((size) => (
                            <span key={size} className='flex items-center gap-1'>
                              {petSizeIcons[size]} {size}
                            </span>
                          ))}
                        </div>
                      )}
                      {question.id !== 33 && question.id !== 34 && <span>{answer}</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Add Book Now button */}
          <button
  onClick={handleBookNowClick}
  className='bg-green-600 text-white rounded-lg uppercase hover:opacity-95 p-3 mt-6'
  disabled={currentUser && currentUser.usertype === 'provider'} // Check if currentUser exists before accessing usertype
>
  Book Now
</button>


          {/* Review Section */}
          <div className='mt-10'>
            <h2 className='text-2xl font-semibold'>Reviews</h2>
            {reviews.length === 0 ? (
              <p className='text-slate-700'>No reviews yet.</p>
            ) : (
              <ul className='space-y-4 mt-4'>
                {reviews.map((review, index) => (
                  <li key={index} className='border-b pb-4'>
                    <div className='flex items-center'>
                      <FaStar className='text-yellow-400' />
                      <span className='ml-2 font-semibold'>{review.rating}</span>
                    </div>
                    <p className='text-slate-700 mt-2'>{review.text}</p>
                  </li>
                ))}
              </ul>
            )}
            <form onSubmit={handleReviewSubmit} className='mt-6'>
              <div className='flex flex-col'>
                <label htmlFor='rating' className='text-slate-700'>
                  Rating:
                </label>
                <input
                  id='rating'
                  type='number'
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                  className='border p-2 rounded mt-1'
                  min='0'
                  max='5'
                />
              </div>
              <div className='flex flex-col mt-4'>
                <label htmlFor='review' className='text-slate-700'>
                  Review:
                </label>
                <textarea
                  id='review'
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  className='border p-2 rounded mt-1'
                />
              </div>
              {reviewError && <p className='text-red-600 mt-2'>{reviewError}</p>}
              <button
                type='submit'
                className='bg-blue-600 text-white rounded-lg uppercase hover:opacity-95 p-3 mt-6'
              >
                Submit Review
              </button>
            </form>
          </div>

          {/* Question and Answers Section */}
          {/* <div className='mt-10'>
            <h2 className='text-2xl font-semibold'>Questions & Answers</h2>
            {questions.length === 0 ? (
              <p className='text-slate-700'>No questions available.</p>
            ) : (
              <ul className='space-y-4 mt-4'>
                {questions.map((question, index) => (
                  <li key={index} className='border-b pb-4'>
                    <p className='text-slate-700'>
                      <strong>Q:</strong> {question.questions}
                    </p>
                    <p className='text-slate-700 mt-2'>
                      <strong>A:</strong> {listing?.answer.find(
                        (item) => item.answer.question_id === question.id
                      )?.answer.ans || 'No answer provided.'}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div> */}
        </div>
      </>
    );
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className='text-red-600'>{error}</p>}
      {!loading && !error && listing && renderListingDetails()}
    </div>
  );
};

export default Listing;
