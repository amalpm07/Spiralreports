/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { FaStar, FaTrash, FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex } from 'react-icons/fa';
import placeholderProfilePic from '../assets/avatar.jpg';
import dogImg from '../assets/dog.png';  
import catImg from '../assets/cat.jpg';   
import birdImg from '../assets/bird.png'; 
import petSizeImg from '../assets/petsize.jpg'; 
import potty from '../assets/potty.png';
import loc from '../assets/loc.png';
import wolk from '../assets/wolk.png';
import '../styleComponets/listing.css';

const ListingDetails = ({
  listing,
  reviews = [],
  questions,
  handleBookNowClick,
  handleReviewSubmit,
  newReview,
  setNewReview,
  reviewError,
  handleDeleteReview,
  currentUser,
}) => {
  const [selectedImage, setSelectedImage] = useState(listing?.serviceHome?.photo1);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup
  const reviewSectionRef = useRef(null);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const handleScroll = () => {
      const reviewsSection = reviewSectionRef.current;
      if (!reviewsSection) return;

      const reviewsTop = reviewsSection.getBoundingClientRect().top + window.scrollY;

      if (window.scrollY > reviewsTop - 20) {
        setIsButtonVisible(true);
      } else {
        setIsButtonVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'} />
    ));
  };

  const galleryImages = Object.keys(listing?.serviceHome || {})
    .filter((key) => key.startsWith('photo') && listing.serviceHome[key])
    .map((key) => listing.serviceHome[key]);

  const acceptedPetTypes = listing?.answer?.find((item) => item.answer.question_id === 35)?.answer.ans.split(', ') || [];
  const acceptedPetSizes = listing?.answer?.find((item) => item.answer.question_id === 36)?.answer.ans.split(', ') || [];
  const PottyBreak = listing?.answer?.find((item) => item.answer.question_id === 37)?.answer.ans.split(', ') || [];
  const location = listing?.answer?.find((item) => item.answer.question_id === 38)?.answer.ans.split(', ') || [];
  const petwolk = listing?.answer?.find((item) => item.answer.question_id === 39)?.answer.ans.split(', ') || [];

  const petSizeClasses = {
    small: 'small-pet-icon',
    medium: 'medium-pet-icon',
    large: 'large-pet-icon',
  };

  const handleTextareaClick = () => {
    if (!currentUser) { // Check if user is logged in
      setIsPopupVisible(true); // Show popup if not
    }
  };

  const handlePopupYes = () => {
    setIsPopupVisible(false);
    navigate('/sign-in'); // Navigate to sign-in page
  };

  const handlePopupNo = () => {
    setIsPopupVisible(false); // Close the popup
  };

  return (
    <div className='listing-details'>
      {/* Profile Section */}
      <div className='profile-section'>
        <img src={listing?.providerProfilePhoto || placeholderProfilePic} alt='Provider Profile' className='profile-pic' />
        <div className='profile-info'>
          <p className='provider-name'>{listing?.serviceHome?.hostelName}</p>
          <p className='provider-address'>{listing?.serviceHome?.address}</p>
        </div>
      </div>

      {/* Description */}
      <p className='description'>
        <span className='description-label'>Description - </span>
        {listing?.serviceHome?.description}
      </p>

      {/* Image Gallery and Service Container */}
      <div className='parent-container'>
        <div className='image-gallery-container'>
          <div className='thumbnail-container'>
            {galleryImages.map((image) => (
              <img
                key={image}
                src={image}
                alt='Thumbnail'
                className={`thumbnail ${selectedImage === image ? 'selected' : ''}`}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
          <div className='image-viewer'>
            <img src={selectedImage} alt='Selected' />
          </div>
        </div>

        {currentUser?.usertype !== 'Provider' && (
          <div className='service-container'>
            <div className='services-header'>
              <h3>Our Services & Rates</h3>
            </div>
            <div className='services-body'>
              <div className='service-item'>
                <h4>Booking</h4>
                <p>Book a session with us.</p>
                <button className='btn-book' onClick={handleBookNowClick}>Book Now</button>
              </div>
            </div>
            <div className='services-info'>
              <p>
                Book with us to enjoy Premium Insurance, 24/7 support, booking guarantee, safe cashless payments, photo updates, and more!
              </p>
            </div>
            <div className='payment-methods'>
              <FaCcVisa size={24} className='payment-icon' />
              <FaCcMastercard size={24} className='payment-icon' />
              <FaCcPaypal size={24} className='payment-icon' />
              <FaCcAmex size={24} className='payment-icon' />
            </div>
          </div>
        )}
      </div>

      {/* Questions Section */}
      <div className='details-sections'>
        <div className='questions-section'>
          <ul className='questions-list'>
            {questions.map((question) => {
              const answer = listing?.answer?.find((item) => item.answer.question_id === question.id)?.answer.ans || '';
              return (
                <li key={question.id} className='question-item'>
                  <strong>{question.questions}:</strong>
                  <div className='question-answer'>
                    {question.id === 35 && (
                      <div className='pet-types'>
                        {acceptedPetTypes.length === 0 ? (
                          <p>No accepted pet types available.</p>
                        ) : (
                          acceptedPetTypes.map((type) => (
                            <span key={type} className='pet-type'>
                              {type === 'dog' && <img src={dogImg} alt={type} className='pet-icon large-pet-icon' />}
                              {type === 'cat' && <img src={catImg} alt={type} className='pet-icon large-pet-icon' />}
                              {type === 'bird' && <img src={birdImg} alt={type} className='pet-icon large-pet-icon' />}
                              <span className='pet-type-label'>{type}</span>
                            </span>
                          ))
                        )}
                      </div>
                    )}
                    {question.id === 36 && (
  <div className='pet-sizes'>
    {acceptedPetSizes.map((size) => (
      <span key={size} className='pet-size'>
        <img 
          src={petSizeImg} 
          alt={`${size} Pet`} 
          className={`pet-size-img ${petSizeClasses[size]}`} 
          style={{ width: size === 'small' ? '20px' : size === 'medium' ? '30px' : '40px' }} 
        /> 
        {size}
      </span>
    ))}
  </div>
)}

                    {question.id === 37 && (
                      <div className='pet-potty'>
                        {PottyBreak.map((size) => (
                          <span key={size} className='pet-size'>
                            <img 
                              src={potty} 
                              alt={`${size} Pet`} 
                              className='pet-icon' 
                            /> 
                            {size}
                          </span>
                        ))}
                      </div>
                    )}
                    {question.id === 38 && (
                      <div className='pet-potty'>
                        {location.map((size) => (
                          <span key={size} className='pet-size'>
                            <img 
                              src={loc} 
                              alt={`${size} Pet`} 
                              className='pet-icon' 
                            /> 
                            {size}
                          </span>
                        ))}
                      </div>
                    )}
                    {question.id === 39 && (
                      <div className='pet-potty'>
                        {petwolk.map((size) => (
                          <span key={size} className='pet-size'>
                            <img 
                              src={wolk} 
                              alt={`${size} Pet`} 
                              className='pet-wolk' 
                            /> 
                            {size}
                          </span>
                        ))}
                      </div>
                    )}
                    {question.id !== 35 && question.id !== 36 && question.id !== 37 && question.id !== 38 && question.id !== 39 && <span>{answer}</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Reviews Section */}
      <div className='reviews-section' ref={reviewSectionRef}>
        <h2 className='reviews-title'>Reviews</h2>
        {reviews.length === 0 ? (
          <p className='no-reviews'>No reviews yet.</p>
        ) : (
          <ul className='reviews-list'>
            {reviews.map((review, index) => (
              <li key={index} className='review-item'>
                <div className='review-stars'>{renderStars(review.stars)}</div>
                <p className='review-text'>{review.reviewMessage}</p>
                <p className='review-date'>Posted on {new Date(review.postedDate).toLocaleDateString()}</p>
                {currentUser?.id === review.customerId && (
                  <span className='delete-review'>
                    <FaTrash className='delete-review-icon' onClick={() => handleDeleteReview(review.id)} />
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Leave Review Section */}
      {currentUser?.usertype !== 'Provider' && (
        <div className='leave-review-section'>
          <h3 className='leave-review-title'>Leave a Review</h3>
          {reviewError && <p className='review-error'>{reviewError}</p>}
          <form onSubmit={handleReviewSubmit} className='review-form'>
            <textarea
              onClick={handleTextareaClick} // Call the handler on click
              value={newReview.text}
              onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
              className='review-textarea'
              rows='4'
              placeholder='Write your review...'
            />
            <div className='rating-section'>
              <span className='rating-label'>Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`rating-star ${newReview.rating >= star ? 'rated' : 'unrated'}`}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                />
              ))}
            </div>
            <button type='submit' className='submit-review-button'>Submit Review</button>
          </form>
        </div>
      )}

 {/* Popup for Sign In Prompt */}
{isPopupVisible && (
  <div className='popup-overlay'>
    <div className='popup'>
      <h4>Please Sign In</h4>
      <p>You need to be signed in to leave a review.</p>
      <div className='button-container'> {/* New button container */}
        <button onClick={handlePopupYes}>Yes</button>
        <button onClick={handlePopupNo}>No</button>
      </div>
    </div>
  </div>
)}



      {/* Booking Button after Reviews Section */}
      {isButtonVisible && currentUser?.usertype !== 'Provider' && (
        <div className='unique-booking-button-container'>
          <button className='unique-book-now-button' onClick={handleBookNowClick}>
            Book Now
          </button>
        </div>
      )}
    </div>
  );
};

export default ListingDetails;
