import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryMetaNav from '../components/CategoryNav';
import { FaGoogle, FaFacebook, FaCheckCircle } from 'react-icons/fa';

const Home = () => {
  const [serviceHomes, setServiceHomes] = useState([]);

  useEffect(() => {
    const fetchServiceHomes = async () => {
      try {
        const res = await fetch('https://hibow.in/api/Provider/GetAllServiceHomes');
        if (!res.ok) {
          throw new Error('Failed to fetch service homes');
        }
        const data = await res.json();
        const serviceHomesData = data.map(item => item.serviceHome);
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
      <section className="relative bg-gray-800">
        <img
          className="w-full h-64 object-cover"
          src="/path/to/your/banner.jpg" // Replace with your actual path
          alt="Banner"
        />
        <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <div className="relative">
            <h1 className="text-4xl font-bold">Welcome to Service Homes</h1>
            <p className="mt-4 text-lg">Find your ideal service home here</p>
            <Link
              to="/premium-subscription"
              className="absolute mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-lg shadow-md transition duration-300"
              style={{ top: '70px', left: '50%', transform: 'translateX(-50%)' }} // Adjust the top value as needed
            >
              Explore Premium
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <CategoryMetaNav />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Service Homes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {serviceHomes.map((home) => (
            <Link
              key={home.id} // Ensure the key is unique
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
                {/* Verification Status */}
                <div className="mt-2 flex items-center space-x-2">
                  {/* Google Verification */}
                  <div className="flex items-center space-x-1">
                    <FaGoogle className={home.isGoogleVerified ? "text-gray-800" : "text-gray-300"} />
                    {home.isGoogleVerified ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : null}
                  </div>
                  {/* Facebook Verification */}
                  <div className="flex items-center space-x-1">
                    <FaFacebook className={home.isFacebookVerified ? "text-gray-800" : "text-gray-300"} />
                    {home.isFacebookVerified ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : null}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
