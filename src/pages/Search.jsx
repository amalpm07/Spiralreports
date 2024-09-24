import { useState, useEffect, useCallback } from 'react';
import ListingItem from '../components/ListingItem';
import '../styleComponets/search.css';

const Search = () => {
  const [location, setLocation] = useState('');
  const [service, setService] = useState('');
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [visibleListings, setVisibleListings] = useState(3);
  const [error, setError] = useState(null);
  const [searchTriggered, setSearchTriggered] = useState(false);

  const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']; // Sample locations

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = 'https://hibow.in/api/Provider/SearchServiceHomeByLocationAndServicenName';
      const params = new URLSearchParams();

      if (location.trim()) {
        params.append('serviceHomeLocation', encodeURIComponent(location));
      }
      if (service) {
        params.append('serviceName', service);
      }

      const res = await fetch(`${url}?${params}`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setListings(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch listings. Please try again later.');
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [location, service]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;
    if (id === 'location') {
      setLocation(value);
    } else if (checked) {
      setService(id);
    }
  };

  const handleSearch = () => {
    setSearchTriggered(true);
    fetchListings();
  };

  useEffect(() => {
    if (searchTriggered) {
      fetchListings();
    }
  }, [searchTriggered, fetchListings]);

  const handleShowMore = () => {
    setVisibleListings((prev) => prev + 3);
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
      <div className="p-8 bg-white border-r-2 md:min-h-screen md:w-1/3 shadow-lg">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-[#755AA6] mb-4">Search</h2>
          
          <div className="flex flex-col mb-4">
            <label htmlFor="location" className="font-medium text-gray-700 mb-1">Location:</label>
            <select
              id="location"
              className="border rounded-lg p-3 w-full text-gray-900 transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#755AA6]"
              value={location}
              onChange={handleChange}
              aria-label="Location"
            >
              <option value="" disabled>Select a location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
              <option value="custom">Other (please specify)</option>
            </select>
            {location === 'custom' && (
              <input
                type="text"
                placeholder="Enter custom location..."
                className="border rounded-lg p-3 w-full mt-2 text-gray-900 transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#755AA6]"
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Custom Location"
              />
            )}
          </div>
          
          <div className="mb-4">
            <span className="block font-medium text-gray-700 mb-1">Services:</span>
            <div className="flex flex-wrap gap-4">
              {['boarding', 'grooming', 'training'].map(serviceName => (
                <label key={serviceName} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={serviceName}
                    checked={service === serviceName}
                    onChange={handleChange}
                    className="form-checkbox"
                    aria-label={serviceName}
                  />
                  <span className="text-gray-800">{serviceName.charAt(0).toUpperCase() + serviceName.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            className="bg-[#755AA6] text-white p-3 rounded-lg uppercase hover:bg-[#6a4d8e] transition duration-300 shadow-md"
          >
            Search
          </button>
        </form>
      </div>

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-semibold text-[#755AA6] border-b-2 pb-2 mb-4">Listing Results</h1>
        {loading && <p className="text-xl text-gray-700 text-center">Loading...</p>}
        {error && <p className="text-xl text-red-600 text-center">{error}</p>}
        {!loading && listings.length === 0 && !error && (
          <p className="text-xl text-gray-700 text-center">No ServiceHome found!</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && listings.slice(0, visibleListings).map(listing => (
            <ListingItem key={listing.id} listing={listing} />
          ))}
        </div>
        {!loading && listings.length > visibleListings && (
          <button
            className="bg-[#755AA6] text-white p-3 rounded-lg uppercase hover:bg-[#6a4d8e] transition duration-300 mt-6 mx-auto block shadow-md"
            onClick={handleShowMore}
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
