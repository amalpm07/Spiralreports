import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaDog, FaCat, FaPaw, FaStar, FaTrash } from 'react-icons/fa';
import Spinner from 'react-bootstrap/Spinner'; // Import Spinner component
import '../styleComponets/styledComponents.css';
import { useSelector } from 'react-redux';
import ServicesAndRates from '../components/ServicesAndRates ';
import dogImg from '../assets/dog.png';
import placeholderProfilePic from '../assets/avatar.jpg';

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ text: '', rating: 0 });
  const [reviewError, setReviewError] = useState(null);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const { selectedType, id } = useParams();
  const [isMounted, setIsMounted] = useState(false);

  const fetchReviews = useCallback(async (serviceHomeId) => {
    try {
      const res = await fetch(`https://hibow.in/api/User/GetCustomerReviewByProviderServiceHomeId?serviceHomeId=${serviceHomeId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Token': currentUser?.guid || '',
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await res.json();
      console.log('Reviews Data:', data); // Log data for debugging
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    }
  }, [currentUser]);

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
            },
          }
        );
        const data = await res.json();
        console.log('Listing Data:', data); // Log data for debugging
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

    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `https://hibow.in/api/Booking/GetTheListofQuestions?serviceName=profile${selectedType}`,
          {
            headers: {
              'Content-Type': 'application/json',
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
  }, [listing, fetchReviews]);

  const handleBookNowClick = () => {
    if (!currentUser) {
      navigate('/booking', { state: { listing } });
    } else {
      navigate('/bookings', { state: { listing } });
    }
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
          'Token': currentUser.guid,
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
          'Token': currentUser.guid,
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
      <div className={`m-6 max-w-3xl p-3 my-4 ${isMounted ? 'slide-in-left' : ''}`}>
        {/* Profile */}
        <div className='flex flex-col sm:flex-row items-center sm:mr-10 space-y-4 sm:space-y-0 sm:space-x-4 mb-6'>
          <img
            src={listing?.providerProfilePhoto || placeholderProfilePic}
            alt='Provider Profile'
            className='w-16 h-16 object-cover rounded-full'
          />
          <div className='text-center sm:text-left'>
            <p className='text-xl font-semibold'>{listing?.serviceHome.hostelName}</p>
            <p className='text-gray-600'>{listing?.serviceHome.address}</p>
          </div>
        </div>

        <p className='text-slate-800'>
          <span className='font-semibold text-black'>Description - </span>
          {listing?.serviceHome.description}
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6'>
          {Object.keys(listing?.serviceHome)
            .filter((key) => key.startsWith('photo') && listing.serviceHome[key])
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

        <ServicesAndRates />

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
                      <div className='flex gap-2 items-center'>
                        {acceptedPetTypes.map((type) => (
                          <span key={type} className='flex items-center gap-1'>
                            {type === 'dog' ? (
                              <img src={dogImg} alt={type} className='w-8 h-8 object-contain' />
                            ) : (
                              <span className='text-gray-500'>No icon</span>
                            )}
                            <span className='ml-1 text-lg font-bold uppercase'>{type}</span>
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

        <div className='mt-4'>
          {currentUser?.usertype !== 'Provider' && (
            <button
              onClick={handleBookNowClick}
              className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded'
            >
              Book Now
            </button>
          )}
        </div>

        <div className='mt-6'>
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

        {currentUser?.usertype !== 'Provider' && (
          <div className='mt-6 border-t pt-6'>
            <h3 className='text-2xl font-semibold mb-4'>Leave a Review</h3>
            {reviewError && (
              <p className='text-red-500 mb-4'>{reviewError}</p>
            )}
            <form onSubmit={handleReviewSubmit} className='bg-gray-100 rounded-lg p-4'>
              <textarea
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                className='w-full p-2 border border-gray-300 rounded mb-4'
                rows='4'
                placeholder='Write your review...'
              ></textarea>
              <div className='flex items-center mb-4'>
                <span className='mr-2'>Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`text-xl cursor-pointer ${
                      newReview.rating >= star ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  />
                ))}
              </div>
              <button
                type='submit'
                className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded'
              >
                Submit Review
              </button>
            </form>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false); // Cleanup function to reset animation state
  }, []);

  if (loading) {
    return (
      <div className='container mx-auto text-center'>
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      </div>
    );
  }
  if (error) {
    return <p className='container mx-auto text-center text-red-500'>Error: {error}</p>;
  }
  if (!listing) {
    return <p className='container mx-auto text-center'>No listing available</p>;
  }

  return (
    <div className='container mx-auto'>
      {renderListingDetails()}
    </div>
  );
};

export default Listing;
