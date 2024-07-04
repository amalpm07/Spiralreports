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

  const renderServiceHomes = () => (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Service Homes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {serviceHomes.map(home => (
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
                  <FaGoogle className={home.isGoogleVerified ? 'text-gray-800' : 'text-gray-300'} />
                  {home.isGoogleVerified && <FaCheckCircle className="text-green-500" />}
                </div>
                <div className="flex items-center space-x-1">
                  <FaFacebook className={home.isFacebookVerified ? 'text-gray-800' : 'text-gray-300'} />
                  {home.isFacebookVerified && <FaCheckCircle className="text-green-500" />}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {/* Banner Image */}
      <div className="bg-gray-800 text-white text-center py-8">
        <h1 className="text-4xl font-bold">Welcome to Our Service Homes</h1>
        <p className="mt-2 text-lg">Find the best service homes near you.</p>
      </div>
      {/* Category Navigation */}
      <CategoryMetaNav />
      {/* Render Service Homes */}
      {renderServiceHomes()}
    </div>
  );
};

export default Home;
