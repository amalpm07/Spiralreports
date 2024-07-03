/* eslint-disable no-undef */
// Import necessary modules from React and other libraries
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';  // Import date picker component
import 'react-datepicker/dist/react-datepicker.css';  // Import date picker styles
import { FiCalendar } from 'react-icons/fi';  // Import calendar icon from react-icons
import styled, { createGlobalStyle } from 'styled-components';  // Import styled-components for styling
import { useNavigate, useLocation } from 'react-router-dom';  // Import hooks from react-router-dom
import PropTypes from 'prop-types';  // Import PropTypes for prop validation
import { useSelector } from 'react-redux';  // Import useSelector hook from react-redux
import { useSpring, animated } from 'react-spring';  // Import animation hooks from react-spring

// Global styles for consistent styling across the application
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
    background-color: #f8f9fa;
    margin: 0;
    padding: 0;
  }
`;

// Styled components for custom styled elements
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
 position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
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
  margin-right: 10px;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-top: 10px;
    width: calc(100% - 20px);
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #00d690;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s;
  margin: 10px 0;
  width: 100%;
  max-width: 200px;

  &:hover {
    background-color: #00b57d;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Span = styled.span`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  color: #666666;
  font-size: 18px;
  font-weight: 300;

  @media (max-width: 768px) {
    margin-bottom: 5px;
  }
`;

const DatepickerWrapper = styled(DatePicker)`
  width: 100%;

  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker {
    font-family: 'Roboto', sans-serif;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .react-datepicker__header {
    background-color: #00d690;
    border-bottom: none;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    padding-top: 10px;
  }

  .react-datepicker__current-month {
    font-size: 18px;
    color: #fff;
    font-weight: bold;
  }

  .react-datepicker__day-name,
  .react-datepicker__day {
    color: #333;
  }

  .react-datepicker__day--selected {
    background-color: #00d690 !important;
    color: #fff;
  }

  .react-datepicker__day--keyboard-selected {
    background-color: rgba(0, 214, 144, 0.8) !important;
    color: #fff;
  }

  .react-datepicker__day--disabled {
    color: #ccc;
  }

  .react-datepicker__day--today {
    font-weight: bold;
  }

  .react-datepicker__month-container {
    padding: 10px;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
`;

const PopupContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 10px 40px rgba(50, 50, 50, 0.1);
  text-align: center;
`;

const CloseButton = styled(Button)`
  background-color: #f44336;
  &:hover {
    background-color: #e53935;
  }
`;

// Main BookingForm Component
const BookingForm = () => {
  // State variables using useState hook
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [showSuccess, setShowSuccess] = useState(false);
  const [questions, setQuestions] = useState([]);  // State for questions fetched from API
  const [answers, setAnswers] = useState({});  // State for storing answers to questions
  const [dateError, setDateError] = useState('');  // State for handling date validation error
  const location = useLocation();  // Hook to access current location
  const navigate = useNavigate();  // Hook for navigation using react-router-dom
  const listing = location.state?.listing;  // Extracting listing from location state
  const currentUser = useSelector((state) => state.user.currentUser);  // Selecting current user from Redux store

  // useEffect hook to fetch questions from API on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('https://hibow.in/api/Booking/GetTheListofQuestions?serviceName=boarding');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data);  // Update questions state with fetched data
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();  // Call fetchQuestions function on component mount
  }, []);  // Empty dependency array ensures useEffect runs only once on mount

  // Function to handle proceed button click event
  const handleProceedClick = async () => {
    try {
      // Validate check-out date is after check-in date
      if (checkOutDate <= checkInDate) {
        setDateError('Check-out date must be after check-in date');
        return;
      }

      const currentDate = new Date();  // Get current date and time
      // Construct booking data object
      const bookingData = {
        customer_id: currentUser.id,
        customerName: currentUser?.userName || "Guest",
        providerId: listing?.serviceHome?.userId,
        serviceName: listing?.serviceHome?.serviceName,
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
          customer_id: currentUser.id,
          ans: String(answers[questionId]),
        }))
      };

      console.log('Booking data:', bookingData);  // Log booking data to console

      // Send POST request to book service
      const bookingRes = await fetch('https://hibow.in/api/Booking/BookAService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      if (!bookingRes.ok) {
        const bookingError = await bookingRes.text();  // Parse error response
        throw new Error(`Failed to book service: ${bookingError.message}`);
      }

      const bookingResult = await bookingRes.json();  // Parse booking response
      console.log('Booking response:', bookingResult);  // Log booking response

      // Create array of answers data from answers state object
      const answersData = Object.keys(answers).map((questionId) => ({
        id: 0,
        question_id: parseInt(questionId),
        customer_id: currentUser.id,
        ans: String(answers[questionId]),
      }));

      console.log('Answers data:', answersData);  // Log answers data

      // Send POST request to add answers
      const answersRes = await fetch('https://hibow.in/api/User/AddAnswers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answersData)
      });

      if (!answersRes.ok) {
        // eslint-disable-next-line no-unused-vars
        const answersError = await answersRes.text();  // Parse error response
        throw new Error(`Failed to book service: ${bookingError.message}`);
      }

      const answersResult = await answersRes.text();  // Parse answers response
      console.log('Answers response:', answersResult);  // Log answers response

      // Navigate to payment page if booking and adding answers successful
      if (bookingResult.id && answersResult.includes('Successfully added')) {
        navigate('/payment', { state: { bookingResponse: bookingResult } });
      } else {
        throw new Error('Booking or adding answers failed');
      }
    } catch (error) {
      console.error('Error during booking:', error.message);  // Log error message to console
      throw new Error(`Failed to book service: ${bookingError.message}`);
    }
  };

  // Function to handle answer change for text input questions
  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer
    }));
  };

  // Function to handle checkbox change for checkbox questions
  const handleCheckboxChange = (questionId, option) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: option
    }));
  };
  
  // useEffect hook to modify answer for the 4th question when questions array changes
  useEffect(() => {
    const fourthQuestion = questions[3];  // Assuming questions[3] is the 4th question
    if (fourthQuestion) {
      const fourthQuestionId = fourthQuestion.id;  // Get question ID of the 4th question
      const newAnswer = "Modified answer for the 4th question";  // New answer for the 4th question
      handleAnswerChange(fourthQuestionId, newAnswer);  // Call handleAnswerChange function with new answer
    }
  }, [questions]);  // useEffect runs when questions array changes

  // Return JSX for BookingForm component
  return (
    <BookingFormWrapper>
      <GlobalStyle />  {/* Apply global styles */}
      {/* JSX for Check-In date picker */}
      <FormElement label="Check - In" icon={FiCalendar}>
        <DatepickerWrapper
          selected={checkInDate}
          onChange={date => {
            setCheckInDate(date);
            if (date >= checkOutDate) {
              setCheckOutDate(new Date(date.setDate(date.getDate() + 1)));
            }
            setDateError('');
          }}
          dateFormat="MM/dd/yyyy"
          className="form-control"
          customInput={<Input type="text" readOnly />}  // Custom input component for date picker
        />
      </FormElement>

      {/* JSX for Check-Out date picker */}
      <FormElement label="Check - Out" icon={FiCalendar}>
        <DatepickerWrapper
          selected={checkOutDate}
          onChange={date => {
            setCheckOutDate(date);
            if (date <= checkInDate) {
              setDateError('Check-out date must be after check-in date');
            } else {
              setDateError('');
            }
          }}
          dateFormat="MM/dd/yyyy"
          className="form-control"
          customInput={<Input type="text" readOnly />}  // Custom input component for date picker
        />
        {/* Display error message if dateError state is not empty */}
        {dateError && <p style={{ color: 'red' }}>{dateError}</p>}
      </FormElement>

      {/* Mapping over questions array to render form elements */}
      {questions && questions.map((question, index) => (
        <React.Fragment key={question.id}>
          <FormElement label={question.questions} />
          {/* Render checkbox group for index 0 and 3 */}
          {index === 0 ? (
              // Render radio buttons for index 0 questions
              // Render radio buttons for index 0 questions
<CheckboxGroup>
  <label>
    <input
      type="radio"
      checked={answers[question.id] === 'dog'}
      onChange={() => handleCheckboxChange(question.id, 'dog')}
    />
    DOG
  </label>
  <label>
    <input
      type="radio"
      checked={answers[question.id] === 'cat'}
      onChange={() => handleCheckboxChange(question.id, 'cat')}
    />
    CAT
  </label>
  <label>
    <input
      type="radio"
      checked={answers[question.id] === 'bird'}
      onChange={() => handleCheckboxChange(question.id, 'bird')}
    />
    BIRD
  </label>
</CheckboxGroup>

            ) : index === 3 ? (
              // Render radio buttons for index 3 questions
              <CheckboxGroup>
                <label>
                  <input
                    type="radio"
                    checked={answers[question.id] === 'Small'}
                    onChange={() => handleCheckboxChange(question.id, 'Small')}
                  />
                  Small
                </label>
                <label>
                  <input
                    type="radio"
                    checked={answers[question.id] === 'Medium'}
                    onChange={() => handleCheckboxChange(question.id, 'Medium')}
                  />
                  Medium
                </label>
                <label>
                  <input
                    type="radio"
                    checked={answers[question.id] === 'Large'}
                    onChange={() => handleCheckboxChange(question.id, 'Large')}
                  />
                  Large
                </label>
              </CheckboxGroup>
            ) : (
              // Default to text input for other questions
              <Input
                type="text"
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              />
            )}
        </React.Fragment>
      ))}

      {/* JSX for Proceed button */}
      <FormElement>
        <Button onClick={handleProceedClick}>Proceed</Button>
      </FormElement>

      {/* Display SuccessPopup component if showSuccess state is true */}
      {showSuccess && <SuccessPopup onClose={() => setShowSuccess(false)} />}
    </BookingFormWrapper>
  );
};

// Functional component for form elements with label, icon, and children props
const FormElement = ({ label, icon: IconComponent, children }) => (
  <FormGroup>
    {/* Render label and optional icon */}
    {label && (
      <Span>
        {IconComponent && <IconComponent style={{ marginRight: 5 }} />}
        {label}
      </Span>
    )}
    {children} {/* Render children components */}
  </FormGroup>
);

// PropTypes validation for FormElement component props
FormElement.propTypes = {
  label: PropTypes.string,  // label prop should be a string
  icon: PropTypes.elementType,  // icon prop should be a valid React component
  children: PropTypes.node,  // children prop should be a valid React node
};

// SuccessPopup component for displaying success message with animation
const SuccessPopup = ({ onClose }) => {
  const animation = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(-50px)' },  // Animation from 50px above final position
  });

  return (
    <Popup>
      <animated.div style={animation}>
        {/* JSX for success message popup */}
        <PopupContent>
          <p>Booking Successful!</p>
          {/* Button to close popup */}
          <CloseButton onClick={onClose}>Close</CloseButton>
        </PopupContent>
      </animated.div>
    </Popup>
  );
};

// PropTypes validation for SuccessPopup component props
SuccessPopup.propTypes = {
  onClose: PropTypes.func.isRequired,  // onClose prop is required and should be a function
};

export default BookingForm;  // Export BookingForm component as default