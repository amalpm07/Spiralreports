/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import '../styleComponets/PetBoarding.css';
import { FaGoogle, FaFacebook, FaCheckCircle } from 'react-icons/fa';

// Pagination settings
const servicesPerPage = 3; // Number of services to display per page

const PetBoarding = () => {
  const [services, setServices] = useState([]);
  const [currentUser, setCurrentUser] = useState({ guid: 'your-guid-here' });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [ratingFilter, setRatingFilter] = useState(0);
  const [reviewCountFilter, setReviewCountFilter] = useState(0);
  const [priceFilter, setPriceFilter] = useState(0); // New filter for price

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://hibow.in/api/Provider/SearchServiceHomeByLocationAndServicenName', {
          params: { 
            ServiceName: 'boarding',
            page: currentPage + 1, // Adjust page number as needed
            limit: servicesPerPage,
            rating: ratingFilter, // Apply rating filter
            reviewCount: reviewCountFilter, // Apply review count filter
            price: priceFilter // Apply price filter
          },
          headers: {
            'Content-Type': 'application/json',
            'Token': currentUser.guid
          }
        });

        // Log the API response to verify its structure
        console.log('API Response:', response.data);

        const servicesData = response.data;
        setServices(servicesData);
        setTotalPages(Math.ceil(servicesData.length / servicesPerPage) || 0);
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to fetch services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [currentPage, currentUser.guid, ratingFilter, reviewCountFilter, priceFilter]);

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  // Handle filter changes
  const handleRatingChange = (event) => {
    setRatingFilter(Number(event.target.value));
  };

  const handleReviewCountChange = (event) => {
    setReviewCountFilter(Number(event.target.value));
  };

  const handlePriceChange = (event) => {
    setPriceFilter(Number(event.target.value));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex">
        {/* Filter Sidebar */}
        <div className="w-1/4 p-4 bg-gray-100 border-r border-gray-200">
          <h3 className="text-lg font-bold mb-4">Filter Services</h3>
          <div className="mb-4">
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
            <select id="rating" onChange={handleRatingChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
              <option value="0">Any</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="reviewCount" className="block text-sm font-medium text-gray-700">Minimum Reviews</label>
            <input
              type="number"
              id="reviewCount"
              onChange={handleReviewCountChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Maximum Price</label>
            <input
              type="number"
              id="price"
              onChange={handlePriceChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              min="0"
              placeholder="Enter max price"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-3/4 pl-4">
          {/* Carousel Banner */}
          <div className="carousel-banner">
            {/* Uncomment the Slider component when ready */}
            {/* <Slider {...bannerSliderSettings}>
              <div><img src={banner1} alt="Banner 1" className="banner-image" /></div>
              <div><img src={banner2} alt="Banner 2" className="banner-image" /></div>
              <div><img src={banner3} alt="Banner 3" className="banner-image" /></div>
            </Slider> */}
          </div>

          {/* Services Section */}
          <div className="services-section">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Pet Boarding Facilities</h2>
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 mb-8">
              {services.length > 0 ? (
                services.map((service) => (
                  <Link
                    key={service.id}
                    to={`/listing/${service.serviceName}/${service.userId}`} // Adjust the URL as needed
                    className="group block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative w-full h-48">
                      <img
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                        src={service.photo1 || 'https://via.placeholder.com/300'} // Fallback image if photo1 is missing
                        alt={service.hostelName}
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-gray-900 font-semibold group-hover:text-blue-600">
                        {service.hostelName}
                      </p>
                      <p className="mt-1 text-sm text-gray-600 truncate">
                        {service.address}
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <FaGoogle className={service.isGoogleVerified ? "text-gray-800" : "text-gray-300"} />
                          {service.isGoogleVerified && <FaCheckCircle className="text-green-500" />}
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaFacebook className={service.isFacebookVerified ? "text-gray-800" : "text-gray-300"} />
                          {service.isFacebookVerified && <FaCheckCircle className="text-green-500" />}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p>No services available at the moment.</p>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                activeClassName={'active'}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetBoarding;
