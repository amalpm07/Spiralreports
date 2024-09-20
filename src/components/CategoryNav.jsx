import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styleComponets/CategoryMetaNav.css';
import DogBoardingIcon from '../assets/pet-boarding.png'; 
import DogGroomingIcon from '../assets/pet-Groomimg.jpg'; 
import DogTrainingIcon from '../assets/pet-Training.png'; 
import DogStoreIcon from '../assets/pet-Store.jpg'; 
import DogTaxiIcon from '../assets/pet-Taxi.jpg'; 
import MoreIcon from '../assets/more.png'; // Add your "More" icon here

const CategoryMetaNav = () => (
  <div className="category-meta-nav">
    <div className="container">
      {columns.map((column, index) => (
        <MetaNavColumn key={index} {...column} />
      ))}
    </div>
  </div>
);

const columns = [
  {
    link: "/petBoarding",
    icon: DogBoardingIcon, 
    alt: "Dog Boarding",
    text: "Pet Boarding"
  },
  {
    link: "/pet-sitting",
    icon: DogTrainingIcon,
    alt: "Pet Sitting",
    text: "Pet Training"
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
  {
    link: "/more",
    icon: MoreIcon, // Make sure to import this icon
    alt: "More",
    text: "More"
  }
];

const MetaNavColumn = ({ link, icon, alt, text }) => (
  <div className="meta-nav-column">
    <Link
      to={link}
      className="meta-nav-card"
      aria-label={text}
    >
      <img src={icon} alt={alt} className="meta-nav-card-image" />
      <div className="meta-nav-card-content">
        <p className="meta-nav-card-text">{text}</p>
      </div>
    </Link>
  </div>
);

MetaNavColumn.propTypes = {
  link: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired, // All icons are images
  alt: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default CategoryMetaNav;
