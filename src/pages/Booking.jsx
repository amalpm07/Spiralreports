import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCalendar } from 'react-icons/fi';
import styled, { createGlobalStyle } from 'styled-components';
import CustomDatePicker from '../components/CustomDatePicker';

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

const Checkbox = styled.input`
  margin-right: 10px;
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

const ProgressBar = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const ProgressBarFill = styled.div`
  height: 10px;
  background-color: #00d690;
  width: ${(props) => props.progress}%;
`;

const BookingForm = () => {
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [dateError, setDateError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSection, setCurrentSection] = useState(1); // Track current section

  const location = useLocation();
  const navigate = useNavigate();
  const listing = location.state?.listing;
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

  const handleProceedToQuestions = () => {
    setCurrentSection(2); // Move to the questions section
  };

  const handleProceedClick = async () => {
    try {
      if (checkOutDate <= checkInDate) {
        setDateError('Check-out date must be after check-in date');
        return;
      }

      const currentDate = new Date();
      const bookingData = {
        customerid: currentUser.id,
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
          customer_id: currentUser.id,
          ans: String(answers[questionId]),
        }))
      };

      const bookingRes = await fetch('https://hibow.in/api/Booking/BookAService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Token': currentUser.guid
        },
        body: JSON.stringify(bookingData)
      });

      if (!bookingRes.ok) {
        throw new Error('Failed to book service');
      }

      const bookingResult = await bookingRes.json();

      const answersData = {
        newAnswers: Object.keys(answers).map((questionId) => ({
          id: 0,
          question_id: parseInt(questionId),
          customer_id: currentUser.id,
          ans: String(answers[questionId]),
        }))
      };

      const answersRes = await fetch('https://hibow.in/api/User/AddAnswers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Token': currentUser.guid
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
    let updatedAnswers = [...(answers[e.target.name] || [])];
    
    if (isChecked) {
      updatedAnswers.push(value);
    } else {
      updatedAnswers = updatedAnswers.filter(item => item !== value);
    }

    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [e.target.name]: updatedAnswers
    }));
  };

  return (
    <BookingFormWrapper>
      <GlobalStyle />

      <ProgressBar>
        <ProgressBarFill progress={currentSection === 1 ? 50 : 100} />
      </ProgressBar>

      {currentSection === 1 && (
        <>
          <FormGroup>
            <Span><FiCalendar /> Check-In</Span>
            <CustomDatePicker
              selected={checkInDate}
              onChange={(date) => {
                setCheckInDate(date);
                if (date >= checkOutDate) {
                  setCheckOutDate(new Date(date.setDate(date.getDate() + 1)));
                }
                setDateError('');
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
            <Button onClick={handleProceedToQuestions}>Next</Button>
          </FormGroup>
        </>
      )}

      {currentSection === 2 && (
        <>
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
                      <label>
                        <Checkbox
                          type="checkbox"
                          name={question.id}
                          checked={answers[question.id]?.includes('dog') || false}
                          onChange={(e) => handleCheckboxChange(e, 'dog')}
                        />
                        Dog
                      </label>
                      <label>
                        <Checkbox
                          type="checkbox"
                          name={question.id}
                          checked={answers[question.id]?.includes('cat') || false}
                          onChange={(e) => handleCheckboxChange(e, 'cat')}
                        />
                        Cat
                      </label>
                      <label>
                        <Checkbox
                          type="checkbox"
                          name={question.id}
                          checked={answers[question.id]?.includes('bird') || false}
                          onChange={(e) => handleCheckboxChange(e, 'bird')}
                        />
                        Bird
                      </label>
                    </>
                  ) : index === 2 ? (
                    <>
                      <label>
                        <Checkbox
                          type="checkbox"
                          name={question.id}
                          checked={answers[question.id]?.includes('Young') || false}
                          onChange={(e) => handleCheckboxChange(e, 'Young')}
                        />
                        Young
                      </label>
                      <label>
                        <Checkbox
                          type="checkbox"
                          name={question.id}
                          checked={answers[question.id]?.includes('Adult') || false}
                          onChange={(e) => handleCheckboxChange(e, 'Adult')}
                        />
                        Adult
                      </label>
                      <label>
                        <Checkbox
                          type="checkbox"
                          name={question.id}
                          checked={answers[question.id]?.includes('Senior') || false}
                          onChange={(e) => handleCheckboxChange(e, 'Senior')}
                        />
                        Senior
                      </label>
                    </>
                  ) : index === 3 ? (
                    <>
                      <label>
                        <Checkbox
                          type="checkbox"
                          name={question.id}
                          checked={answers[question.id]?.includes('Small ') || false}
                          onChange={(e) => handleCheckboxChange(e, 'Small ')}
                        />
                        Small 
                      </label>
                      <label>
                        <Checkbox
                          type="checkbox"
                          name={question.id}
                          checked={answers[question.id]?.includes('Medium ') || false}
                          onChange={(e) => handleCheckboxChange(e, 'Medium ')}
                        />
                        Medium 
                      </label>
                      <label>
                        <Checkbox
                          type="checkbox"
                          name={question.id}
                          checked={answers[question.id]?.includes('Large ') || false}
                          onChange={(e) => handleCheckboxChange(e, 'Large ')}
                        />
                        Large 
                      </label>
                    </>
                  ):(
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
