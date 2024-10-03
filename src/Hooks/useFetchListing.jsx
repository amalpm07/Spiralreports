/* eslint-disable react-hooks/exhaustive-deps */
// src/Hooks/useFetchListing.jsx
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

const useFetchListing = (selectedType, id) => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [review, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  const fetchReviews = useCallback(async (serviceHomeId) => {
    try {
      const res = await fetch(`https://hibow.in/api/User/GetCustomerReviewByProviderServiceHomeId?serviceHomeId=${serviceHomeId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Token': currentUser?.guid || '',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch reviews');
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    }
  }, [currentUser]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`https://hibow.in/api/Provider/GetListingByUserIdAndServiceName?serviceName=${selectedType}&userId=${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch listing');
      const data = await res.json();
      setListing(data);
      fetchReviews(data?.serviceHome?.id); // Fetch reviews on successful listing fetch
    } catch (error) {
      console.error('Error fetching listing:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`https://hibow.in/api/Booking/GetTheListofQuestions?serviceName=profile${selectedType}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    if (id && selectedType) {
      fetchListing();
      fetchQuestions();
    }
  }, [selectedType, id]);

  return { listing, loading, error, review, questions };
};

export default useFetchListing; // Ensure this line is present
