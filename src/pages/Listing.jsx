import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaDog, FaCat, FaPaw, FaStar, FaTrash } from 'react-icons/fa';
import '../styleComponets/styledComponents.css';
import { useSelector } from 'react-redux';

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
  const { currentUser } = useSelector((state) => state.user);
  const { selectedType, id } = useParams();

  // Define fetchReviews function with headers
const fetchReviews = async (serviceHomeId) => {
  try {
    const res = await fetch(`https://hibow.in/api/User/GetCustomerReviewByProviderServiceHomeId?serviceHomeId=${serviceHomeId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Token': currentUser.guid, // Assuming currentUser.guid contains the token
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch reviews');
    }
    const data = await res.json();
    setReviews(data);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    setReviews([]);
  }
};


  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `https://hibow.in/api/Provider/GetListingByUserIdAndServiceName?serviceName=${selectedType}&userId=${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Token': currentUser.guid, // Pass the guid in the header
            },
          }
        );
        if (!res.ok) {
          throw new Error('Failed to fetch listing');
        }
        const data = await res.json();
        setListing(data);
      } catch (error) {
        console.error('Error fetching listing:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `https://hibow.in/api/Booking/GetTheListofQuestions?serviceName=profile${selectedType}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Token': currentUser.guid, // Pass the guid in the header
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    if (id && selectedType) {
      fetchListing();
      fetchQuestions();
    }
  }, [selectedType, id, currentUser]);

  useEffect(() => {
    if (listing && listing.serviceHome && listing.serviceHome.id) {
      fetchReviews(listing.serviceHome.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing]);

  // eslint-disable-next-line no-unused-vars
  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // eslint-disable-next-line no-unused-vars
  const handleBookNowClick = () => {
    navigate('/booking', { state: { listing } });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.text || !newReview.rating) {
      setReviewError('Please provide a rating and a review.');
      return;
    }
    if (!currentUser?.guid) {
      setReviewError('User information not available.');
      return;
    }
    if (currentUser?.usertype === 'provider') {
      setReviewError('Providers cannot submit reviews.');
      return;
    }
    try {
      const res = await fetch('https://hibow.in/api/User/AddCustomerReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Token': currentUser.guid, // Pass the guid in the header
        },
        body: JSON.stringify({
          serviceHomeId: listing.serviceHome.id,
          customerId: currentUser.id,
          customerName: currentUser.userName,
          reviewMessage: newReview.text,
          stars: newReview.rating,
          postedDate: new Date().toISOString(),
        }),
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

  const handleDeleteReview = async (reviewId) => {
    try {
      const res = await fetch(`https://hibow.in/api/User/DeleteCustomerReview?reviewId=${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Token': currentUser.guid, // Pass the guid in the header
        },
      });
      if (!res.ok) {
        throw new Error('Failed to delete review');
      }
      setReviews(reviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<FaStar key={i} className='text-yellow-400' />);
    }
    return stars;
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
                  paddingTop: '100%',
                  backgroundImage: `url(${listing?.serviceHome[key]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            ))}
        </div>

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
        <div className='mt-10'>
          <h2 className='text-2xl font-semibold'>Reviews</h2>
          {reviews.length === 0 ? (
            <p className='text-slate-700'>No reviews yet.</p>
          ) : (
            <ul className='space-y-4 mt-4'>
              {reviews.map((review, index) => (
                <li key={index} className='border-b pb-4 relative'>
                  <div className='flex items-center'>
                    {renderStars(review.stars)}
                  </div>
                  <p className='text-slate-700 mt-2'>{review.reviewMessage}</p>
                  <p className='text-gray-500 text-xs mt-1'>
                    Posted on {new Date(review.postedDate).toLocaleDateString()}
                  </p>
                  {/* Only show delete button if current user posted the review */}
                  {currentUser?.id === review.customerId && (
                    <span className='absolute right-0 top-0 mt-2 mr-2'>
                      <FaTrash
                        className='text-red-600 cursor-pointer'
                        onClick={() => handleDeleteReview(review.id)}
                      />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {currentUser?.usertype !== 'provider' && (
          <div className='mt-6'>
            <form onSubmit={handleReviewSubmit}>
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
        )}

        
      </div>
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
