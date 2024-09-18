import { useState, useEffect } from 'react';
import ListingItem from '../components/ListingItem';
import { useSelector } from 'react-redux';

const Search = () => {
  const [location, setLocation] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [visibleListings, setVisibleListings] = useState(3); // Initially show 3 listings
  const [searchClicked, setSearchClicked] = useState(false); // State to track search button click

  const fetchListings = async () => {
    setLoading(true);
    try {
      let url = 'https://hibow.in/api/Provider/SearchServiceHomeByLocationAndServicenName';

      // Construct the query parameters based on state
      const params = {};
      if (location.trim() !== '') {
        params.serviceHomeLocation = encodeURIComponent(location);
      }
      if (services.length > 0) {
        params.serviceName = services.join(',');
      }
      const queryParams = new URLSearchParams(params).toString();

      // Append query parameters to the URL
      if (queryParams !== '') {
        url = `${url}?${queryParams}`;
      }

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // No Token header since user authentication is not needed
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setListings(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (id === 'location') {
      setLocation(value);
    }

    if (checked) {
      setServices((prevServices) => [...prevServices, id]);
    } else {
      setServices((prevServices) => prevServices.filter(service => service !== id));
    }
  };

  const handleSearch = () => {
    setSearchClicked(true); // Set searchClicked to true on search button click
    fetchListings();
  };

  useEffect(() => {
    if (searchClicked) {
      fetchListings(); // Fetch listings only if searchClicked is true
    }
  }, [searchClicked]); // Depend on searchClicked state to trigger useEffect

  const handleShowMore = () => {
    setVisibleListings((prev) => prev + 3); // Increase visible listings by 3
  };

  return (
    <div className='flex flex-col md:flex-row bg-gray-100 min-h-screen'>
      {/* Search Form */}
      <div className='p-7 bg-white border-b-2 md:border-r-2 md:min-h-screen md:w-1/3'>
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className='flex flex-col gap-6'>
          <h2 className='text-2xl font-semibold text-[#755AA6] mb-4'>Search</h2>
          <div className='flex flex-col mb-4'>
            <label htmlFor='location' className='font-medium text-gray-700 mb-1'>Location:</label>
            <input
              type='text'
              id='location'
              placeholder='Enter location...'
              className='border rounded-lg p-3 w-full text-gray-900'
              value={location}
              onChange={handleChange}
            />
          </div>
          <div className='mb-4'>
            <span className='block font-medium text-gray-700 mb-1'>Services:</span>
            <div className='flex flex-wrap gap-4'>
              {['boarding', 'grooming', 'training'].map(service => (
                <label key={service} className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    id={service}
                    checked={services.includes(service)}
                    onChange={handleChange}
                    className='form-checkbox'
                  />
                  <span>{service.charAt(0).toUpperCase() + service.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            type='submit' // Change type to submit to trigger form submit
            className='bg-[#755AA6] text-white p-3 rounded-lg uppercase hover:bg-[#6a4d8e] transition'
          >
            Search
          </button>
        </form>
      </div>

      {/* Listings */}
      <div className='flex-1 p-6'>
        <h1 className='text-3xl font-semibold text-[#755AA6] border-b-2 pb-2 mb-4'>Listing Results</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {loading && (
            <p className='text-xl text-gray-700 text-center col-span-full'>Loading...</p>
          )}
          {!loading && listings.length === 0 && (
            <p className='text-xl text-gray-700 text-center col-span-full'>No ServiceHome found!</p>
          )}
          {!loading &&
            listings.slice(0, visibleListings).map(listing => (
              <ListingItem key={listing.id} listing={listing} />
            ))}
        </div>
        {!loading && listings.length > visibleListings && (
          <button
            className='bg-[#755AA6] text-white p-3 rounded-lg uppercase hover:bg-[#6a4d8e] transition mt-6 mx-auto block'
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
