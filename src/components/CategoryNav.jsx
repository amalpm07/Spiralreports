import PropTypes from 'prop-types';
import '../styleComponets/CategoryMetaNav.css';

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
    link: "",
    imgUrl: "https://content.petbacker.com/images/cms/icons/service-type/pet-boarding.png",
    alt: "pet boarding near me",
    text: "Dog Boarding"
  },
  {
    link: "",
    imgUrl: "https://content.petbacker.com/images/cms/icons/service-type/cat-boarding.png",
    alt: "cat boarding near me",
    text: "Pet Sitting"
  },
  {
    link: "",
    imgUrl: "https://content.petbacker.com/images/cms/icons/service-type/pet-grooming-1.png",
    alt: "pet grooming near me",
    text: "Pet Grooming"
  },
  {
    link: "",
    imgUrl: "https://content.petbacker.com/images/cms/icons/service-type/dog-walking.png",
    alt: "dog walking near me",
    text: "Pet Store"
  },
  {
    link: "",
    imgUrl: "https://content.petbacker.com/images/cms/icons/service-type/pet-taxi.png",
    alt: "pet taxi near me",
    text: "Pet Taxi"
  },
  {
    link: "",
    imgUrl: "https://content.petbacker.com/images/cms/icons/service-type/more.png",
    alt: "pet service near me",
    text: "More"
  }
];

const Column = ({ link, imgUrl, alt, text }) => (
  <div className="column">
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="card"
      aria-label={text}
    >
      <img src={imgUrl} alt={alt} className="card-image" />
      <div className="card-content">
        <p className="card-text">{text}</p>
      </div>
    </a>
  </div>
);

Column.propTypes = {
  link: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default CategoryMetaNav;
