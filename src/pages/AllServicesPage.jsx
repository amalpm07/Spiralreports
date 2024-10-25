import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../styleComponets/AllServicesPage.css'; // Link to your CSS file for styling

// Import images
import petBoardingIcon from '../assets/pet-boarding.png';
import petGroomingIcon from '../assets/pet-Groomimg.jpg';
import petTrainingIcon from '../assets/pet-Training.png';
import petStore from '../assets/pet-Store.jpg';
import petTaxiIcon from '../assets/pet-Taxi.jpg';

// Utility function for cache busting
const addCacheBuster = (url) => {
  return `${url}?v=${import.meta.env.VITE_APP_VERSION}`;
};

const services = [
  {
    icon: addCacheBuster(petBoardingIcon),
    title: 'Pet Boarding',
    description: 'Perfect if your pet needs overnight pet care.',
    link: '/petBoarding'
  },
  {
    icon: addCacheBuster(petStore),
    title: 'Pet Store',
    description: 'For pet products.',
    link: '/petStore'
  },
  {
    icon: addCacheBuster(petTaxiIcon),
    title: 'Pet Taxi',
    description: 'When your pet needs help going somewhere.',
    link: '/petTaxi'
  },
  {
    icon: addCacheBuster(petGroomingIcon),
    title: 'Pet Grooming',
    description: 'Give your pet a new look.',
    link: '/petGrooming'
  },
  {
    icon: addCacheBuster(petTrainingIcon),
    title: 'Pet Training',
    description: 'For training pets to be in their best behavior.',
    link: '/petTraining'
  },
];

const AllServicesPage = () => {
  return (
    <div className="all-services-page">
      <div className="intro-section">
        {/* <h5 className="intro-text">More than 5 pet lovers will send you a message with their quote and details.</h5> */}
      </div>
      <div className="services-container">
        {services.map((service, index) => (
          <Link key={index} to={service.link} className="service-card-link">
            <div className="service-card">
              <div className="service-card-image-wrapper">
                <img src={service.icon} alt={service.title} className="service-card-image" />
              </div>
              <div className="service-card-content">
                <h6 className="service-card-title">{service.title}</h6>
                <p className="service-card-description">{service.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllServicesPage;
