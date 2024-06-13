import  { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar } from 'react-icons/fi';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

// eslint-disable-next-line no-unused-vars
const InputGroup = styled.div`
    display: flex;
    align-items: center;
    box-shadow: 0px 1px 18px 0px rgba(21, 44, 91, 0.1);
    border-radius: 5px;
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

// eslint-disable-next-line no-unused-vars
const InputGroupAddon = styled.div`
    padding: 6px 15px;
    cursor: pointer;
`;

const SelectElement = styled.select`
    height: 50px;
    padding: 6px 15px;
    border: 1px solid #e1e1e1;
    border-radius: 5px;
    background: transparent;
    color: #bbb5a5;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    box-shadow: none;
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

// eslint-disable-next-line no-unused-vars
const Icon = styled(FiCalendar)`
    margin-right: 5px;
    font-size: 20px;
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
    const [checkOutDate, setCheckOutDate] = useState(new Date());
    const navigate = useNavigate();

    const handleContactClick = () => {
        navigate('/payment');
    };

    return (
        <BookingFormWrapper>
            <FormElement label="Check - In" icon={FiCalendar}>
                <DatepickerWrapper
                    selected={checkInDate}
                    onChange={(date) => setCheckInDate(date)}
                    dateFormat="MM/dd/yyyy"
                    className="form-control"
                    wrapperClassName="react-datepicker-wrapper"
                    popperClassName="react-datepicker-popper"
                    customInput={<Input type="text" readOnly />}
                />
            </FormElement>

            <FormElement label="Check - Out" icon={FiCalendar}>
                <DatepickerWrapper
                    selected={checkOutDate}
                    onChange={(date) => setCheckOutDate(date)}
                    dateFormat="MM/dd/yyyy"
                    className="form-control"
                    wrapperClassName="react-datepicker-wrapper"
                    popperClassName="react-datepicker-popper"
                    customInput={<Input type="text" readOnly />}
                />
            </FormElement>

            <FormElement label="Guests">
                <SelectElement>
                    <option>02</option>
                    <option>01</option>
                    <option>03</option>
                    <option>04</option>
                    <option>05</option>
                    <option>06</option>
                </SelectElement>
            </FormElement>

            <FormElement label="Children">
                <SelectElement>
                    <option>01</option>
                    <option>02</option>
                    <option>03</option>
                    <option>04</option>
                    <option>05</option>
                    <option>06</option>
                </SelectElement>
            </FormElement>

            <FormElement>
                <Button type="submit">Check Availability</Button>
            </FormElement>

            <FormElement>
                <Button onClick={handleContactClick}>Contact</Button>
            </FormElement>
        </BookingFormWrapper>
    );
};

// eslint-disable-next-line react/prop-types
const FormElement = ({ label, icon: IconComponent, children }) => (
    <SelectSub>
        <Span>
            {IconComponent && <IconComponent />}
            {label && `${label}`}
        </Span>
        <FormGroup>{children}</FormGroup>
    </SelectSub>
);

export default BookingForm;
