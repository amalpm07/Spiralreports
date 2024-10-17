// eslint-disable-next-line no-unused-vars
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styleComponets/CategoryMetaNav.css';
import DogBoardingIcon from '../assets/pet-boarding.png'; 
import DogGroomingIcon from '../assets/pet-Groomimg.jpg'; 
import DogTrainingIcon from '../assets/pet-Training.png'; 
import DogStoreIcon from '../assets/pet-Store.jpg'; 
import DogTaxiIcon from '../assets/pet-Taxi.jpg'; 
import MoreIcon from '../assets/more.png'; 

const CategoryMetaNav = () => {
  const navigate = useNavigate();

  const handleClick = (category) => {
    navigate(`/pet/${category}`);
  };

  return (
    <div className="category-meta-nav">
      <div className="container">
        {columns.map((column, index) => (
          <MetaNavColumn key={index} {...column} onClick={handleClick} />
        ))}
      </div>
    </div>
  );
};

const columns = [
  {
    link: "boarding", // Change this to relative path
    icon: DogBoardingIcon, 
    alt: "Dog Boarding",
    text: "Pet Boarding"
  },
  {
    link: "training",
    icon: DogTrainingIcon,
    alt: "Pet Training",
    text: "Pet Training"
  },
  {
    link: "grooming",
    icon: DogGroomingIcon,
    alt: "Pet Grooming",
    text: "Pet Grooming"
  },
  {
    link: "store",
    icon: DogStoreIcon,
    alt: "Pet Store",
    text: "Pet Store"
  },
  {
    link: "taxi",
    icon: DogTaxiIcon,
    alt: "Pet Taxi",
    text: "Pet Taxi"
  },
  {
    link: "more",
    icon: MoreIcon,
    alt: "More",
    text: "More"
  }
];

const MetaNavColumn = ({ link, icon, alt, text, onClick }) => (
  <div className="meta-nav-column">
    <div
      className="meta-nav-card"
      aria-label={text}
      onClick={() => onClick(link)} // Call the onClick function with the category
    >
      <img src={icon} alt={alt} className="meta-nav-card-image" />
      <div className="meta-nav-card-content">
        <p className="meta-nav-card-text">{text}</p>
      </div>
    </div>
  </div>
);

MetaNavColumn.propTypes = {
  link: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CategoryMetaNav;
