/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { FaMapMarkerAlt, FaDog, FaCat, FaPaw, FaStar, FaTrash } from 'react-icons/fa';
import Spinner from 'react-bootstrap/Spinner'; // Import Spinner component
import '../styleComponets/listing.css';
import { useSelector } from 'react-redux';
import dogImg from '../assets/dog.png';
import placeholderProfilePic from '../assets/avatar.jpg';
import ServicesAndRates from '../components/ServicesAndRates ';
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
      <div className={`listing-container ${isMounted ? 'slide-in-left' : ''}`}>
        {/* Profile */}
        <div className='profile-section'>
          <img
            src={listing?.providerProfilePhoto || placeholderProfilePic}
            alt='Provider Profile'
            className='profile-pic'
          />
          <div className='profile-info'>
            <p className='provider-name'>{listing?.serviceHome.hostelName}</p>
            <p className='provider-address'>{listing?.serviceHome.address}</p>
          </div>
        </div>

        <p className='description'>
          <span className='description-label'>Description - </span>
          {listing?.serviceHome.description}
        </p>

        <div className='photo-gallery'>
          {Object.keys(listing?.serviceHome)
            .filter((key) => key.startsWith('photo') && listing.serviceHome[key])
            .map((key, index) => (
              <div
                key={index}
                className='photo-item'
                style={{
                  backgroundImage: `url(${listing?.serviceHome[key]})`,
                }}
              />
            ))}
        </div>
        <div className='questions-section'>
          <ul className='questions-list'>
            {questions.map((question) => {
              const answer = listing?.answer.find(
                (item) => item.answer.question_id === question.id
              )?.answer.ans;
              return (
                <li key={question.id} className='question-item'>
                  <strong>{question.questions}:</strong>
                  <div className='question-answer'>
                    {question.id === 33 && (
                      <div className='pet-types'>
                        {acceptedPetTypes.map((type) => (
                          <span key={type} className='pet-type'>
                            {type === 'dog' ? (
                              <img src={dogImg} alt={type} className='pet-icon' />
                            ) : (
                              <span className='no-icon'>No icon</span>
                            )}
                            <span className='pet-type-label'>{type}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {question.id === 34 && (
                      <div className='pet-sizes'>
                        {acceptedPetSizes.map((size) => (
                          <span key={size} className='pet-size'>
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

        <div className='booking-section'>
          {currentUser?.usertype !== 'Provider' && (
            <button
              onClick={handleBookNowClick}
              className='book-now-button'
            >
              Book Now
            </button>
          )}
        </div>

        <div className='reviews-section'>
          <h2 className='reviews-title'>Reviews</h2>
          {reviews.length === 0 ? (
            <p className='no-reviews'>No reviews yet.</p>
          ) : (
            <ul className='reviews-list'>
              {reviews.map((review, index) => (
                <li key={index} className='review-item'>
                  <div className='review-stars'>
                    {renderStars(review.stars)}
                  </div>
                  <p className='review-text'>{review.reviewMessage}</p>
                  <p className='review-date'>
                    Posted on {new Date(review.postedDate).toLocaleDateString()}
                  </p>
                  {currentUser?.id === review.customerId && (
                    <span className='delete-review'>
                      <FaTrash
                        className='delete-review-icon'
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
          <div className='leave-review-section'>
            <h3 className='leave-review-title'>Leave a Review</h3>
            {reviewError && (
              <p className='review-error'>{reviewError}</p>
            )}
            <form onSubmit={handleReviewSubmit} className='review-form'>
              <textarea
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                className='review-textarea'
                rows='4'
                placeholder='Write your review...'
              ></textarea>
              <div className='rating-section'>
                <span className='rating-label'>Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`rating-star ${
                      newReview.rating >= star ? 'rated' : 'unrated'
                    }`}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  />
                ))}
              </div>
              <button
                type='submit'
                className='submit-review-button'
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
      <div className='loading-container'>
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      </div>
    );
  }
  if (error) {
    return <p className='error-message'>Error: {error}</p>;
  }
  if (!listing) {
    return <p className='no-listing'>No listing available</p>;
  }

  return (
    <div className='listing-container'>
      {renderListingDetails()}
    </div>
  );
};

export default Listing;
