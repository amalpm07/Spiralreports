import { useState } from 'react';
import { FaPaw, FaStar, FaTrash, FaCcVisa, FaCcMastercard, FaPaypal, FaCcAmex } from 'react-icons/fa';
import placeholderProfilePic from '../assets/avatar.jpg';
import dogImg from '../assets/dog.png';
import catImg from '../assets/cat.jpg';
import birdImg from '../assets/bird.png';
import '../styleComponets/listing.css'; // Assume this file contains the relevant styles

const ListingDetails = ({ listing, reviews, questions, handleBookNowClick, handleReviewSubmit, newReview, setNewReview, reviewError, handleDeleteReview, currentUser }) => {
  const [selectedImage, setSelectedImage] = useState(listing?.serviceHome?.photo1);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'} />
    ));
  };

  const galleryImages = Object.keys(listing?.serviceHome || {})
    .filter((key) => key.startsWith('photo') && listing.serviceHome[key])
    .map((key) => ({
      original: listing.serviceHome[key],
      thumbnail: listing.serviceHome[key],
    }));

  const renderListingDetails = () => {
    const acceptedPetTypes = listing?.answer?.find((item) => item.answer.question_id === 33)?.answer.ans.split(', ') || [];
    const acceptedPetSizes = listing?.answer?.find((item) => item.answer.question_id === 34)?.answer.ans.split(', ') || [];
    const petSizeIcons = {
      '1-5kg': <FaPaw className='text-xl' />,
      '5-10kg': <FaPaw className='text-xl' />,
      '10-20kg': <FaPaw className='text-xl' />,
    };

    return (
      <div className='listing-details'>
        <div className='profile-section'>
          <img src={listing?.providerProfilePhoto || placeholderProfilePic} alt='Provider Profile' className='profile-pic' />
          <div className='profile-info'>
            <p className='provider-name'>{listing?.serviceHome?.hostelName}</p>
            <p className='provider-address'>{listing?.serviceHome?.address}</p>
          </div>
        </div>
        <p className='description'>
          <span className='description-label'>Description - </span>
          {listing?.serviceHome?.description}
        </p>
        <div className='image-gallery-container'>
          <div className='thumbnail-container'>
            {galleryImages.map((image) => (
              <img
                key={image.original}
                src={image.thumbnail}
                alt='Thumbnail'
                className={`thumbnail ${selectedImage === image.original ? 'selected' : ''}`}
                onClick={() => setSelectedImage(image.original)}
              />
            ))}
          </div>
          <div className='image-viewer'>
            <img src={selectedImage} alt='Selected' />
          </div>
        </div>
        {currentUser?.usertype !== 'Provider' && (
          <div className='service-details-container'>
            <div className='service-container'>
              <div className='services-header'>
                <h3>Our Services & Rates</h3>
              </div>
              <div className='services-body'>
                <div className='service-item'>
                  <h4>Booking</h4>
                  <p>Book a session with us.</p>
                  <p className='service-price'>Free</p>
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
                <FaPaypal size={24} className='payment-icon' />
                <FaCcAmex size={24} className='payment-icon' />
              </div>
            </div>
            <div className='details-sections'>
              <div className='questions-section'>
                <ul className='questions-list'>
                  {questions.map((question) => {
                    const answer = listing?.answer?.find((item) => item.answer.question_id === question.id)?.answer.ans || '';
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
                                  ) : type === 'cat' ? (
                                    <img src={catImg} alt={type} className='pet-icon' />
                                  ) : type === 'bird' ? (
                                    <img src={birdImg} alt={type} className='pet-icon' />
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
            </div>
          </div>
        )}
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
                    className={`rating-star ${newReview.rating >= star ? 'rated' : 'unrated'}`}
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

  return renderListingDetails();
};

export default ListingDetails;
