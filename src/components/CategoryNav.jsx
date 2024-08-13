import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styleComponets/CategoryMetaNav.css';
import DogBoardingIcon from '../assets/pet-boarding.png'; 
import DogGroomingIcon from '../assets/pet-Groomimg.jpg'; 
import DogTrainingIcon from '../assets/pet-Training.png'; 
import DogStoreIcon from '../assets/pet-Store.jpg'; 
import DogTaxiIcon from '../assets/pet-Taxi.jpg'; 

const CategoryMetaNav = () => (
  <div className="category-meta-nav">
    <div className="container">
      {columns.map((column, index) => (
        <Column key={index} {...column} />
      ))}
    </div>
  </div>
);

const columns = [
  {
    link: "/pet-Boarding",
    icon: DogBoardingIcon, 
    alt: "Dog Boarding",
    text: "Pet Boarding"
  },
  {
    link: "/pet-sitting",
    icon: DogTrainingIcon,
    alt: "Pet Sitting",
    text: "Pet Sitting"
  },
  {
    link: "/pet-grooming",
    icon: DogGroomingIcon,
    alt: "Pet Grooming",
    text: "Pet Grooming"
  },
  {
    link: "/pet-store",
    icon: DogStoreIcon,
    alt: "Pet Store",
    text: "Pet Store"
  },
  {
    link: "/pet-taxi",
    icon: DogTaxiIcon,
    alt: "Pet Taxi",
    text: "Pet Taxi"
  },
];

const Column = ({ link, icon, alt, text }) => (
  <div className="column">
    <Link
      to={link}
      className="card"
      aria-label={text}
    >
      <img src={icon} alt={alt} className="card-image" />
      <div className="card-content">
        <p className="card-text">{text}</p>
      </div>
    </Link>
  </div>
);

Column.propTypes = {
  link: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired, // All icons are images
  alt: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default CategoryMetaNav;
