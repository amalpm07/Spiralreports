import { useState } from "react";
import PropTypes from "prop-types";
import { MdMessage } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import '../styleComponets/contact.css';
import contact from '../assets/contact.svg';

const Button = ({ isOutline, icon, text, ...rest }) => {
  return (
    <button
      {...rest}
      className={`contactForm-button ${isOutline ? 'contactForm-outline_btn' : 'contactForm-primary_btn'}`}
    >
      {icon && <span className="contactForm-icon">{icon}</span>}
      {text}
    </button>
  );
};

Button.propTypes = {
  isOutline: PropTypes.bool,
  icon: PropTypes.element,
  text: PropTypes.string.isRequired,
};

Button.defaultProps = {
  isOutline: false,
  icon: null,
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    text: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
  };

  return (
    <section className="contactForm-container">
      <div className="contactForm-contact_form">
        <div className="contactForm-top_btn">
          <Button text="VIA SUPPORT CHAT" icon={<MdMessage fontSize="24px" />} />
          <Button text="VIA CALL" icon={<FaPhoneAlt fontSize="24px" />} />
        </div>
        <div className="contactForm-email_btn">
          <Button isOutline={true} text="VIA EMAIL FORM" icon={<HiMail fontSize="24px" />} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="contactForm-form_control">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>
          <div className="contactForm-form_control">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="contactForm-form_control">
            <label htmlFor="text">Message</label>
            <textarea
              name="text"
              rows="8"
              value={formData.text}
              onChange={handleChange}
              placeholder="Enter your message"
            />
          </div>
          <div className="contactForm-submit_btn">
            <Button text="SUBMIT" />
          </div>
        </form>
      </div>
      <div className="contactForm-contact_image">
        <img src={contact} alt="Contact" />
      </div>
    </section>
  );
};

export default ContactForm;
