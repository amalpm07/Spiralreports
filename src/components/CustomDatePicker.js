import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomDatePicker = styled(DatePicker)`
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
    padding-bottom: 10px;
    text-align: center;
  }

  .react-datepicker__current-month {
    font-size: 18px;
    color: #fff;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .react-datepicker__day-name,
  .react-datepicker__day {
    color: #333;
    width: 30px;
    line-height: 30px;
    margin: 0;
    border-radius: 50%;
    &:hover {
      background-color: #f0f0f0;
    }
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
    pointer-events: none; /* Disable click events */
  }

  .react-datepicker__day--today {
    font-weight: bold;
  }

  .react-datepicker__month-container {
    padding: 10px;
  }

  @media (max-width: 768px) {
    .react-datepicker-popper {
      width: 100% !important;
      max-width: 100%;
    }
  }
`;

export default CustomDatePicker;
