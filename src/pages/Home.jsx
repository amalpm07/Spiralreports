/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGoogle, FaFacebook, FaCheckCircle, FaStar } from 'react-icons/fa';
import CategoryMetaNav from '../components/CategoryNav';
import styled from 'styled-components';
import banner from '../assets/banner3.png';

// Styled-components for responsiveness and improved design
const BannerSection = styled.section`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: auto;

  img {
    width: 100%;
    height: 50vh;
    object-fit: cover;
    filter: brightness(60%);
    transition: transform 0.6s ease-in-out;

    @media (min-width: 768px) {
      height: 60vh;
    }

    @media (min-width: 1024px) {
      height: 70vh;
    }

    &:hover {
      transform: scale(1.1);
    }
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }

  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    z-index: 2;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    animation: fadeInContent 1s ease-out;

    h1 {
      font-size: 1.5rem;
      margin: 0;
      background: linear-gradient(45deg, #755AA6, #6a4b85);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
      padding: 0.5rem;
      border-radius: 5px;
      animation: fadeInText 1s ease-out;

      @media (min-width: 576px) {
        font-size: 2rem;
      }

      @media (min-width: 768px) {
        font-size: 2.5rem;
      }

      @media (min-width: 1024px) {
        font-size: 3rem;
      }
    }

    p {
      font-size: 0.875rem;
      margin-top: 0.5rem;
      background: rgba(0, 0, 0, 0.6);
      padding: 0.5rem;
      border-radius: 5px;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
      animation: fadeInText 1s ease-out;

      @media (min-width: 576px) {
        font-size: 1rem;
      }

      @media (min-width: 768px) {
        font-size: 1.25rem;
      }

      @media (min-width: 1024px) {
        font-size: 1.5rem;
      }
    }

    .cta-button {
      background: #755AA6;
      color: white;
      padding: 12px 24px;
      border-radius: 50px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      text-transform: uppercase;
      font-weight: bold;
      text-decoration: none;
      display: inline-block;
      margin-top: 1rem;
      transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
      position: relative;
      z-index: 3;

      &:hover {
        background: #6a4b85;
        transform: scale(1.05);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
      }

      &:active {
        background: #755AA6;
        transform: scale(1);
      }

      @media (max-width: 768px) {
        padding: 10px 20px;
        font-size: 0.875rem;
      }

      @media (max-width: 480px) {
        padding: 8px 16px;
        font-size: 0.75rem;
      }
    }
  }

  @keyframes fadeInContent {
    from {
      opacity: 0;
      transform: translate(-50%, -45%) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  @keyframes fadeInText {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 767px) {
    .content {
      animation: none;
    }
  }
`;

const ServiceHomesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Home = () => {
  const [serviceHomes, setServiceHomes] = useState([]);

  useEffect(() => {
    const fetchServiceHomes = async () => {
      try {
        const res = await fetch('/api/Provider/GetAllServiceHomes');
        if (!res.ok) {
          throw new Error('Failed to fetch service homes');
        }
        const data = await res.json();
        const serviceHomesData = data.map(item => ({
          ...item.serviceHome,
          charge: item.charge,
          stars: item.stars,
        }));
        setServiceHomes(serviceHomesData);
       
        
      } catch (error) {
        console.error('Error fetching service homes:', error);
      }
    };

    fetchServiceHomes();
  }, []);

  return (
    <div>
      {/* Banner Section */}
      <BannerSection>
        <img src={banner} alt="Banner" />
        <div className="overlay"></div>
        <div className="content">
          <h1>"Discover a New World for Your Pet"</h1>
          <p>"Experience the ultimate in pet care and comfort. Where every pet's journey begins with love and exceptional service."</p>
          <Link to="/premium-subscription" className="cta-button">
            Explore Premium
          </Link>
        </div>
      </BannerSection>

      {/* Main Content */}
      <CategoryMetaNav />

      <ServiceHomesContainer>
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Service Homes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {serviceHomes.map((home) => (
            <Link
              key={home.id}
              to={`/listing/${home.serviceName}/${home.userId}`}
              className="group block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative w-full h-48">
                <img
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                  src={home.photo1}
                  alt={home.serviceName}
                />
              </div>
              <div className="p-4">
                <p className="text-gray-900 font-semibold group-hover:text-blue-600">
                  {home.hostelName}
                </p>
                <p className="mt-1 text-sm text-gray-600 truncate">
                  {home.address}
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <FaGoogle className={home.isGoogleVerified ? "text-gray-800" : "text-gray-300"} />
                    {home.isGoogleVerified && <FaCheckCircle className="text-green-500" />}
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaFacebook className={home.isFacebookVerified ? "text-gray-800" : "text-gray-300"} />
                    {home.isFacebookVerified && <FaCheckCircle className="text-green-500" />}
                  </div>
                </div>

                {/* Display charge and stars */}
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-gray-700 font-bold">
                    ₹{home.charge}/night
                  </p>
                  <div className="flex items-center">
                    {Array.from({ length: home.stars }).map((_, index) => (
                      <FaStar key={index} className="text-yellow-500" />
                    ))}
                    {Array.from({ length: 5 - home.stars }).map((_, index) => (
                      <FaStar key={index} className="text-gray-300" />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </ServiceHomesContainer>
    </div>
  );
};

export default Home;
