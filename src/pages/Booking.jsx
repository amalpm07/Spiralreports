import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar } from 'react-icons/fi';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useSpring, animated } from 'react-spring';

// Global styles for consistent styling
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
    background-color: #f8f9fa;
    margin: 0;
    padding: 0;
  }
`;

// Styled Components
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
  margin-bottom: 20px;

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
    margin-bottom: 10px;
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
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [showSuccess, setShowSuccess] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [dateError, setDateError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const listing = location.state?.listing;
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('https://hibow.in/api/Booking/GetTheListofQuestions?serviceName=boarding');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleProceedClick = async () => {
    try {
      if (checkOutDate <= checkInDate) {
        setDateError('Check-out date must be after check-in date');
        return;
      }
  
      const currentDate = new Date();
      const bookingData = {
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
          id: 0, // Assuming this needs to be set to 0 for new answers
          question_id: parseInt(questionId), // Ensure question_id is an integer
          customer_id: currentUser.id,
          ans: String(answers[questionId]),
        }))
      };
  
      const [bookingRes, answersRes] = await Promise.all([
        fetch('https://hibow.in/api/Booking/BookAService', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bookingData)
        }),
        fetch('https://hibow.in/api/User/AddAnswers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            Object.keys(answers).map((questionId) => ({
              id: 0, // Assuming this needs to be set to 0 for new answers
              question_id: parseInt(questionId), // Ensure question_id is an integer
              customer_id: currentUser.id,
              ans: String(answers[questionId]),
            }))
          )
        })
      ]);
  
      if (!bookingRes.ok || !answersRes.ok) {
        throw new Error('Failed to book service or add answers');
      }
  
      const bookingResult = await bookingRes.json();
      const answersResult = await answersRes.text();
  
      console.log('Booking response:', bookingResult);
      console.log('Answers response:', answersResult);
  
      // Check if the responses contain the expected properties or success indicators
      if (bookingResult && bookingResult.id && answersResult.includes('Successfully added')) {
        // Redirect to payment page
        navigate('/payment', { state: { bookingResponse: bookingResult } });
      } else {
        throw new Error('Booking or adding answers failed');
      }
    } catch (error) {
      console.error('Error during booking:', error);
      // Handle error state or feedback to the user
    }
  };
  
  
  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer
    }));
  };

  const handleCheckboxChange = (questionId, option) => {
    setAnswers(prevAnswers => {
      const questionAnswers = prevAnswers[questionId] || {};
      return {
        ...prevAnswers,
        [questionId]: {
          ...questionAnswers,
          [option]: !questionAnswers[option]
        }
      };
    });
  };

  return (
    <BookingFormWrapper>
      <GlobalStyle />
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
          customInput={<Input type="text" readOnly />}
        />
      </FormElement>

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
          customInput={<Input type="text" readOnly />}
        />
        {dateError && <p style={{ color: 'red' }}>{dateError}</p>}
      </FormElement>

      {questions && questions.map((question, index) => (
        <FormElement key={question.id} label={question.questions}>
          {index === 0 || index === 3 ? (
            <CheckboxGroup>
              <label>
                <input
                  type="checkbox"
                  checked={!!answers[question.id]?.['Option 1']}
                  onChange={() => handleCheckboxChange(question.id, 'Option 1')}
                />
                Option 1
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={!!answers[question.id]?.['Option 2']}
                  onChange={() => handleCheckboxChange(question.id, 'Option 2')}
                />
                Option 2
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={!!answers[question.id]?.['Option 3']}
                  onChange={() => handleCheckboxChange(question.id, 'Option 3')}
                />
                Option 3
              </label>
            </CheckboxGroup>
          ) : (
            <Input
              type="text"
              value={answers[question.id] || ''}
              onChange={e => handleAnswerChange(question.id, e.target.value)}
            />
          )}
        </FormElement>
      ))}

      <FormElement>
        <Button onClick={handleProceedClick}>Proceed</Button>
      </FormElement>

      {showSuccess && <SuccessPopup onClose={() => setShowSuccess(false)} />}
    </BookingFormWrapper>
  );
};

const FormElement = ({ label, icon: IconComponent, children }) => (
  <FormGroup>
    {label && (
      <Span>
        {IconComponent && <IconComponent style={{ marginRight: 5 }} />}
        {label}
      </Span>
    )}
    {children}
  </FormGroup>
);

FormElement.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.elementType,
  children: PropTypes.node.isRequired,
};

const SuccessPopup = ({ onClose }) => {
  const animation = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(-50px)' },
  });

  return (
    <Popup>
      <animated.div style={animation}>
        <PopupContent>
          <p>Booking Successful!</p>
          <CloseButton onClick={onClose}>Close</CloseButton>
        </PopupContent>
      </animated.div>
    </Popup>
  );
};

SuccessPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default BookingForm;
