/* eslint-disable react/prop-types */
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar } from 'react-icons/fi';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// Popup component for success message
const SuccessPopup = ({ onClose }) => (
    <div className="popup">
        <p>Booking Successful!</p>
        <button onClick={onClose}>Close</button>
    </div>
);

const BookingFormWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    box-shadow: 0px 10px 40px 0px rgba(50, 50, 50, 0.1);
    background-color: #fff;
    border-radius: 5px;
    width: 100%;
    max-width: 1200px;
    margin: auto;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
    }
`;

const SelectSub = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px;
    align-items: center;
    flex: 1;
    min-width: 200px;

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const FormGroup = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
`;

const Input = styled.input`
    border: 1px solid #e1e1e1;
    padding: 6px 15px;
    border-radius: 5px;
    height: 50px;
    background: transparent;
    box-shadow: none;
    font-style: normal;
    width: 100%;
`;

const Button = styled.button`
    padding: 10px 20px;
    background-color: #00d690;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.5s;
    width: 100%;
    max-width: 200px;
    margin: 10px;

    &:hover {
        background-color: #00b57d;
    }
`;

const Span = styled.span`
    display: block;
    margin-bottom: 5px;
    color: #666666;
    font-size: 18px;
    font-weight: 300;
    display: flex;
    align-items: center;
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

const BookingForm = () => {
    const [checkInDate, setCheckInDate] = useState(new Date());
    const [checkOutDate, setCheckOutDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
    const [showSuccess, setShowSuccess] = useState(false); // State to control popup visibility

    const location = useLocation();
    const navigate = useNavigate();
    const listing = location.state?.listing;
    const currentUser = useSelector((state) => state.user.currentUser);

    const handleProceedClick = async () => {
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
        };

        try {
            const response = await fetch('https://hibow.in/api/Booking/BookAService', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            });

            if (response.ok) {
                setShowSuccess(true); // Show success popup
                // Optionally navigate to home page after a delay
                setTimeout(() => {
                    navigate('/'); // Navigate to home page after 2 seconds
                }, 2000);
            } else {
                console.error('Failed to submit booking:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting booking:', error);
        }
    };

    return (
        <BookingFormWrapper>
            <FormElement label="Check - In" icon={FiCalendar}>
                <DatepickerWrapper
                    selected={checkInDate}
                    onChange={date => setCheckInDate(date)}
                    dateFormat="MM/dd/yyyy"
                    className="form-control"
                    customInput={<Input type="text" readOnly />}
                />
            </FormElement>

            <FormElement label="Check - Out" icon={FiCalendar}>
                <DatepickerWrapper
                    selected={checkOutDate}
                    onChange={date => setCheckOutDate(date)}
                    dateFormat="MM/dd/yyyy"
                    className="form-control"
                    customInput={<Input type="text" readOnly />}
                />
            </FormElement>

            <FormElement>
                <Button onClick={handleProceedClick}>Proceed</Button>
            </FormElement>

            {/* Popup for success message */}
            {showSuccess && <SuccessPopup onClose={() => setShowSuccess(false)} />}
        </BookingFormWrapper>
    );
};

const FormElement = ({ label, icon: IconComponent, children }) => (
    <SelectSub>
        {label && (
            <Span>
                {IconComponent && <IconComponent style={{ marginRight: 5 }} />}
                {label}
            </Span>
        )}
        <FormGroup>{children}</FormGroup>
    </SelectSub>
);

FormElement.propTypes = {
    label: PropTypes.string,
    icon: PropTypes.elementType,
    children: PropTypes.node.isRequired,
};

export default BookingForm;
