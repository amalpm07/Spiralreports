/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCalendar } from 'react-icons/fi';
import styled, { createGlobalStyle } from 'styled-components';
import CustomDatePicker from '../components/CustomDatePicker';

// Styled components
const Checkbox = ({ checked, onChange, label, name }) => (
  <label htmlFor={name}>
    <input
      id={name}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      name={name}
      value={label}
    />
    {label}
  </label>
);

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
    background-color: #f8f9fa;
    margin: 0;
    padding: 0;
  }
`;

const BookingFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 0px 10px 40px rgba(50, 50, 50, 0.1);
  background-color: #fff;
  border-radius: 5px;
  width: 100%;
  max-width: 800px;
  margin: 20px auto;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Span = styled.span`
  color: #666666;
  font-size: 18px;
  font-weight: 300;
  margin-bottom: 5px;
`;

const Input = styled.input`
  border: 1px solid #e1e1e1;
  padding: 10px 15px;
  border-radius: 5px;
  height: 50px;
  background: transparent;
  box-shadow: none;
  font-size: 16px;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #00d690;
    box-shadow: 0 0 5px rgba(0, 214, 144, 0.5);
  }

  &::placeholder {
    color: #ccc;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #755AA6; /* New background color */
  color: #fff; /* Text color */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s;
  margin: 10px 0;
  width: 100%;
  max-width: 200px;

  &:hover {
    background-color: #5e4791; /* Slightly darker shade for hover effect */
  }

  &:disabled {
    background-color: #d0bfe0; /* Lighter shade for disabled state */
    color: #a1a1a1; /* Text color when disabled */
    cursor: not-allowed;
  }
`;

// DatePicker component
const DatePicker = ({ selected, onChange, minDate, placeholder }) => (
  <CustomDatePicker
    selected={selected}
    onChange={onChange}
    dateFormat="MM/dd/yyyy"
    className="form-control"
    placeholderText={placeholder}
    minDate={minDate}
  />
);

// BookingForm component
const BookingForm = () => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentSection, setCurrentSection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateError, setDateError] = useState('');
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const location = useLocation();
  const { listing } = location.state || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  const listingDetails = listing || {};
console.log(listingDetails.serviceHome.id);
console.log(listing);

  const acceptedPetTypes = listingDetails.acceptedPetTypes || [];
  const acceptedPetSizes = listingDetails.acceptedPetSizes || [];
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://hibow.in/api/Booking/GetTheListofQuestions?serviceName=boarding', {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleProceedTodatepicker = useCallback(() => {
    if (!email || !phoneNumber) {
      setError('Please enter both email and phone number');
      return;
    }
    setCurrentSection(2);
  }, [email, phoneNumber]);

  const handleProceedToQuestions = useCallback(() => {
    setCurrentSection(2);
  }, []);

  const handleProceedClick = useCallback(async () => {
    try {
        if (checkOutDate <= checkInDate) {
            setDateError('Check-out date must be after check-in date');
            return;
        }

        const currentDate = new Date();
        const charge = listing?.answer.find(item => item.answer.question_id === 40)?.answer.ans;

        let bookingData = {
            customerName: currentUser?.userName || "Guest",
            customerId:currentUser?.id,
            providerId: listing?.serviceHome?.userId,
            serviceName: listing?.serviceHome?.serviceName || "Default Service Name",
            ServiceHomeName:listing?.serviceHome?.hostelName,
            bookingDate: currentDate.toISOString(),
            serviceFromDate: checkInDate.toISOString(),
            serviceToDate: checkOutDate.toISOString(),
            charge: charge,
            isCancelled: false,
            isConfirmed: false,
            isCompleted: false,
            isActive: true,
            cancelledBy: "",
            answers: Object.keys(answers).map((questionId) => ({
                id: 0,
                question_id: parseInt(questionId),
                customer_id: currentUser?.id || 0,
                ans: answers[questionId] || '',
            }))
        };

        // Wrap the bookingData in the expected request format
        const bookingRes = await fetch('https://hibow.in/api/Booking/BookAService', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                BookingModel: bookingData, // Correctly wrap bookingData in BookingModel
                userType: currentUser ? "Customer" : "guest",
            }),
        });

        if (!bookingRes.ok) {
            throw new Error('Failed to book service');
        }

        const bookingResult = await bookingRes.json();

        // Save answers
        const answersData = {
            newAnswers: Object.keys(answers).map((questionId) => ({
                id: 0,
                question_id: parseInt(questionId),
                customer_id: currentUser?.id || 0,
                ans: answers[questionId] || '',
            }))
        };

        const answersRes = await fetch('https://hibow.in/api/User/AddAnswers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answersData)
        });

        if (!answersRes.ok) {
            throw new Error('Failed to add answers');
        }

        // Navigate to the payment page with booking result
        navigate('/payment', { state: { bookingResponse: bookingResult } });

    } catch (error) {
        setError(error.message);
    }
}, [checkInDate, checkOutDate, answers, currentUser, listing, navigate]);

  
  const handleAnswerChange = useCallback((questionId, answer) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer
    }));
  }, []);

  const handleCheckboxChange = (e, value) => {
    const questionId = e.target.name;

    // Only update the answer for the selected checkbox
    if (e.target.checked) {
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [questionId]: value
      }));
    } else {
      // If unchecked, clear the answer for that question
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [questionId]: ''
      }));
    }
  };

  return (
    <BookingFormWrapper>
      <GlobalStyle />

      {currentSection === 1 && (
        <>
          <FormGroup>
            <Span><FiCalendar /> Check-In</Span>
            <DatePicker
              selected={checkInDate}
              onChange={(date) => {
                setCheckInDate(date);
                if (date >= checkOutDate) {
                  setDateError('Check-in date must be before check-out date');
                } else {
                  setDateError('');
                }
              }}
              minDate={new Date()}
              placeholder="Select check-in date"
            />
          </FormGroup>

          <FormGroup>
            <Span><FiCalendar /> Check-Out</Span>
            <DatePicker
              selected={checkOutDate}
              onChange={(date) => {
                setCheckOutDate(date);
                if (date <= checkInDate) {
                  setDateError('Check-out date must be after check-in date');
                } else {
                  setDateError('');
                }
              }}
              minDate={checkInDate}
              placeholder="Select check-out date"
            />
            {dateError && <p style={{ color: 'red', marginTop: '5px' }}>{dateError}</p>}
          </FormGroup>

          <FormGroup>
            <Button onClick={handleProceedToQuestions} disabled={loading}>Next</Button>
          </FormGroup>
        </>
      )}

{currentSection === 2 && (
        <>
          {loading && <p>Loading questions...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {questions.map((question, index) => (
            <FormGroup key={question.id}>
              <Span>{question.questions}</Span>
              {index === 0 && acceptedPetTypes.length > 0 ? (
                acceptedPetTypes.map(pet => (
                  <Checkbox
                    key={pet}
                    label={pet.charAt(0).toUpperCase() + pet.slice(1)}
                    name={question.id}
                    checked={answers[question.id] === pet}
                    onChange={(e) => handleCheckboxChange(e, pet)}
                  />
                ))
              ) : index === 2 ? (
                <>
                  <Checkbox
                    label="Young"
                    name={question.id}
                    checked={answers[question.id] === 'Young'}
                    onChange={(e) => handleCheckboxChange(e, 'Young')}
                  />
                  <Checkbox
                    label="Adult"
                    name={question.id}
                    checked={answers[question.id] === 'Adult'}
                    onChange={(e) => handleCheckboxChange(e, 'Adult')}
                  />
                  <Checkbox
                    label="Senior"
                    name={question.id}
                    checked={answers[question.id] === 'Senior'}
                    onChange={(e) => handleCheckboxChange(e, 'Senior')}
                  />
                </>
              ) :index === 3 && acceptedPetSizes.length > 0 ? (
                acceptedPetSizes.map(size => (
                  <Checkbox
                    key={size}
                    label={size.charAt(0).toUpperCase() + size.slice(1)}
                    name={question.id}
                    checked={answers[question.id] === size}
                    onChange={(e) => handleCheckboxChange(e, size)}
                  />
                ))
              ) : (
                <Input
                  type="text"
                  name={question.id}
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder={`Enter ${question.questions}`}
                />
              )}
            </FormGroup>
          ))}
          <Button onClick={handleProceedClick} disabled={loading}>
            {loading ? 'Processing...' : 'Confirm Booking'}
          </Button>
        </>
      )}
    </BookingFormWrapper>
  );
};

BookingForm.propTypes = {
  // Define prop types if needed
};

export default BookingForm;
