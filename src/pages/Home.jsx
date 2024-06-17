import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryMetaNav from '../components/CategoryNav'; // Fixed import name

const Home = () => {
  const [serviceHomes, setServiceHomes] = useState([]);

  useEffect(() => {
    const fetchServiceHomes = async () => {
      try {
        const res = await fetch('https://hibow.in/api/Provider/GetAllServiceHomes');
        const data = await res.json();
        console.log('Service Homes Data:', data);
        setServiceHomes(data);
      } catch (error) {
        console.log('Error fetching service homes:', error);
      }
    };

    fetchServiceHomes();
  }, []);

  return (
    <div>
      {/* Banner Section */}
      <div className="relative bg-gray-800">
        <img
          className="w-full h-64 object-cover"
          src="/path/to/your/banner.jpg"  // Replace with your actual path
          alt="Banner"
        />
        <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Welcome to Service Homes</h1>
            <p className="mt-4 text-lg text-gray-300">Find your ideal service home here</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <CategoryMetaNav />

      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-3xl font-bold text-slate-700 my-6">Service Homes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {serviceHomes.map((home) => (
            <Link
              key={home.id}
              to={`/listing/${home.serviceName}/${home.userId}`}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <img className="w-full h-48 object-cover" src={home.photo1} alt={home.serviceName} />
              <div className="p-4">
                <p className="text-gray-700 text-base mb-4">
                  {home.description}
                </p>
                <p className="text-gray-600 text-sm">{home.address}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
