/* eslint-disable no-undef */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams here
import Spinner from 'react-bootstrap/Spinner';
import useFetchListing from '../Hooks/useFetchListing';
import ListingDetails from '../components/ListingDetails';
import { useSelector } from 'react-redux'; // Import useSelector to access the Redux store

const Listing = () => {
  const { selectedType, id } = useParams();
  const navigate = useNavigate();
  const { listing, loading, error, reviews, questions } = useFetchListing(selectedType, id);
  const [newReview, setNewReview] = React.useState({ text: '', rating: 0 });
  const [reviewError, setReviewError] = React.useState(null);

  // Access currentUser from Redux store
  const { currentUser } = useSelector((state) => state.user);

  const handleBookNowClick = () => {
    const acceptedPetTypes = listing?.answer?.find((item) => item.answer.question_id === 33)?.answer.ans.split(', ') || [];
    const acceptedPetSizes = listing?.answer?.find((item) => item.answer.question_id === 34)?.answer.ans.split(', ') || [];

    const listingDetails = {
      ...listing,
      answers: listing?.answer || [],
      acceptedPetTypes,
      acceptedPetSizes,
    };

    navigate(currentUser ? '/bookings' : '/booking', { state: { listing: listingDetails } });
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
          serviceHomeId: listing?.serviceHome?.id,
          customerId: currentUser.id,
          customerName: currentUser.userName,
          reviewMessage: newReview.text,
          stars: newReview.rating,
          postedDate: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error('Failed to submit review');
      const data = await res.json();
      setReviews((prevReviews) => [...prevReviews, data]);
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
      if (!res.ok) throw new Error('Failed to delete review');
      setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

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
    <ListingDetails
      listing={listing}
      reviews={reviews}
      questions={questions}
      handleBookNowClick={handleBookNowClick}
      handleReviewSubmit={handleReviewSubmit}
      newReview={newReview}
      setNewReview={setNewReview}
      reviewError={reviewError}
      handleDeleteReview={handleDeleteReview}
      currentUser={currentUser}
    />
  );
};

export default Listing;
