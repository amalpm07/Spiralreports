/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCalendar } from 'react-icons/fi';
import styled, { createGlobalStyle } from 'styled-components';
import CustomDatePicker from '../components/CustomDatePicker';

// Styled components
const Checkbox = ({ checked, onChange, label }) => {
  return (
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
};

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
  background-color: #007bff; /* Default background color */
  color: #fff; /* Default text color */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s;
  margin: 10px 0;
  width: 100%;
  max-width: 200px;

  &:hover {
    background-color: #0056b3; /* Background color on hover */
  }

  &:disabled {
    background-color: #cccccc; /* Background color when disabled */
    color: #666666; /* Text color when disabled */
    cursor: not-allowed;
  }
`;

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
  const listing = location.state?.listing; // Initialize listing
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);

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

  const handleProceedTodatepicker = () => {
    if (!email || !phoneNumber) {
      setError('Please enter both email and phone number');
      return;
    }

    setCurrentSection(2);
  };

  const handleProceedToQuestions = () => {
    setCurrentSection(3);
  };

  const handleProceedClick = async () => {
    try {
      if (checkOutDate <= checkInDate) {
        setDateError('Check-out date must be after check-in date');
        return;
      }
  
      const currentDate = new Date();
      let bookingData = {
        customerName: currentUser?.userName || "Guest",
        providerId: listing?.serviceHome?.userId,
        serviceName: listing?.serviceHome?.serviceName || "Default Service Name",
        bookingDate: currentDate.toISOString(),
        serviceFromDate: checkInDate.toISOString(),
        serviceToDate: checkOutDate.toISOString(),
        charge: listing?.answer.find(item => item.answer.question_id === 38)?.answer.ans,
        isCancelled: false,
        isConfirmed: false,
        isCompleted: false,
        isActive: true,
        cancelledBy: "",
        answers: Object.keys(answers).map((questionId) => ({
          id: 0,
          question_id: parseInt(questionId),
          customer_id: currentUser?.id || 0, // Use 0 for guest user
          ans: String(answers[questionId]),
        }))
      };
  
      if (!currentUser) {
        const userAdd = {
          email,
          phoneNumber
        };
  
        const addUserRes = await fetch('https://hibow.in/api/User/Add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userAdd)
        });
  
        if (!addUserRes.ok) {
          throw new Error('Failed to add user');
        }
  
        const userData = await addUserRes.json();
        dispatch({ type: 'SET_CURRENT_USER', payload: userData }); // Update currentUser state with the fetched user data
  
        // Update bookingData with the guest user's details
        bookingData = {
          ...bookingData,
          customer_id: userData.id, // Assuming userData.id is provided by the API response
        };
      }
  
      const bookingRes = await fetch('https://hibow.in/api/Booking/BookAService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingModel: bookingData,
          userType: currentUser ? "Customer" : "guest" // Set userType based on currentUser existence
        })
      });
  
      if (!bookingRes.ok) {
        throw new Error('Failed to book service');
      }
  
      const bookingResult = await bookingRes.json();
  
      const answersData = {
        newAnswers: Object.keys(answers).map((questionId) => ({
          id: 0,
          question_id: parseInt(questionId),
          customer_id: currentUser?.id ||  userData.id, // Use 0 for guest user
          ans: String(answers[questionId]),
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
  
      const answersResult = await answersRes.text();
  
      navigate('/payment', { state: { bookingResponse: bookingResult } });
  
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer
    }));
  };

  const handleCheckboxChange = (e, value) => {
    const isChecked = e.target.checked;
    const questionId = e.target.name;

    if (isChecked) {
      const updatedAnswers = {
        ...answers,
        [questionId]: [value],
      };
      setAnswers(updatedAnswers);
    } else {
      const updatedAnswers = {
        ...answers,
        [questionId]: [],
      };
      setAnswers(updatedAnswers);
    }
  };

  return (
    <BookingFormWrapper>
      <GlobalStyle />
      {currentSection === 1 && (
        <>
          <FormGroup>
            <Span>Email</Span>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email"
            />
          </FormGroup>

          <FormGroup>
            <Span>Phone Number</Span>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
            />
          </FormGroup>

          <FormGroup>
            <Button onClick={handleProceedTodatepicker}>Proceed</Button>
          </FormGroup>
        </>
      )}

      {(currentSection === 2) && (
        <>
          <FormGroup>
            <Span><FiCalendar /> Check-In</Span>
            <CustomDatePicker
              selected={checkInDate}
              onChange={(date) => {
                setCheckInDate(date);
                if (date >= checkOutDate) {
                  setDateError('Check-in date must be before check-out date');
                } else {
                  setDateError('');
                }
              }}
              dateFormat="MM/dd/yyyy"
              className="form-control"
              placeholderText="Select check-in date"
              minDate={new Date()} // Disable past dates
            />
          </FormGroup>

          <FormGroup>
            <Span><FiCalendar /> Check-Out</Span>
            <CustomDatePicker
              selected={checkOutDate}
              onChange={(date) => {
                setCheckOutDate(date);
                if (date <= checkInDate) {
                  setDateError('Check-out date must be after check-in date');
                } else {
                  setDateError('');
                }
              }}
              dateFormat="MM/dd/yyyy"
              className="form-control"
              placeholderText="Select check-out date"
              minDate={checkInDate} // Disable past dates and dates before check-in date
            />
            {dateError && <p style={{ color: 'red', marginTop: '5px' }}>{dateError}</p>}
          </FormGroup>
  
          <FormGroup>
            <Button onClick={handleProceedToQuestions} disabled={loading}>Proceed</Button>
          </FormGroup>
        </>
      )}

      {(currentSection === 3) && (
        <>
          <FormGroup>
            {loading ? (
              <p>Loading questions...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : (
              <>
                {questions.map((question, index) => (
                  <FormGroup key={question.id}>
                    <Span>{question.questions}</Span>
                    {index === 0 ? (
                      <>
                        <Checkbox
                          label="Dog"
                          name={question.id}
                          checked={answers[question.id]?.includes('Dog') || false}
                          onChange={(e) => handleCheckboxChange(e, 'Dog')}
                        />
                        <Checkbox
                          label="Cat"
                          name={question.id}
                          checked={answers[question.id]?.includes('Cat') || false}
                          onChange={(e) => handleCheckboxChange(e, 'Cat')}
                        />
                        <Checkbox
                          label="Bird"
                          name={question.id}
                          checked={answers[question.id]?.includes('Bird') || false}
                          onChange={(e) => handleCheckboxChange(e, 'Bird')}
                        />
                      </>
                    ) : index === 2 ? (
                      <>
                        <Checkbox
                          label="Young"
                          name={question.id}
                          checked={answers[question.id]?.includes('Young') || false}
                          onChange={(e) => handleCheckboxChange(e, 'Young')}
                        />
                        <Checkbox
                          label="Adult"
                          name={question.id}
                          checked={answers[question.id]?.includes('Adult') || false}
                          onChange={(e) => handleCheckboxChange(e, 'Adult')}
                        />
                        <Checkbox
                          label="Senior"
                          name={question.id}
                          checked={answers[question.id]?.includes('Senior') || false}
                          onChange={(e) => handleCheckboxChange(e, 'Senior')}
                        />
                      </>
                    ) : index === 3 ? (
                      <>
                        <Checkbox
                          label="Small"
                          name={question.id}
                          checked={answers[question.id]?.includes('Small') || false}
                          onChange={(e) => handleCheckboxChange(e, 'Small')}
                        />
                        <Checkbox
                          label="Medium"
                          name={question.id}
                          checked={answers[question.id]?.includes('Medium') || false}
                          onChange={(e) => handleCheckboxChange(e, 'Medium')}
                        />
                        <Checkbox
                          label="Large"
                          name={question.id}
                          checked={answers[question.id]?.includes('Large') || false}
                          onChange={(e) => handleCheckboxChange(e, 'Large')}
                        />
                      </>
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
                <FormGroup>
                  <Button onClick={handleProceedClick} disabled={loading}>Proceed</Button>
                </FormGroup>
              </>
            )}
          </FormGroup>
        </>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </BookingFormWrapper>
  );
};

BookingForm.propTypes = {
  // Add prop types if required
};

export default BookingForm;
