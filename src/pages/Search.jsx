import React, { useState, useEffect } from 'react';
import ListingItem from '../components/ListingItem';
import { useSelector } from 'react-redux';

const Search = () => {
  const [location, setLocation] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
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
          'Token': currentUser.guid,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setListings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setListings([]);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (id === 'location') {
      setLocation(value);
    }

    if (checked) {
      setServices([...services, id]);
    } else {
      setServices(services.filter(service => service !== id));
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
    setVisibleListings(prev => prev + 3); // Increase visible listings by 3
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Location:
            </label>
            <input
              type='text'
              id='location'
              placeholder='Enter location...'
              className='border rounded-lg p-3 w-full'
              value={location}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Services:
            </label>
            <label>
              <input
                type='checkbox'
                id='boarding'
                checked={services.includes('boarding')}
                onChange={handleChange}
              />
              Boarding
            </label>
            <label>
              <input
                type='checkbox'
                id='grooming'
                checked={services.includes('grooming')}
                onChange={handleChange}
              />
              Grooming
            </label>
            <label>
              <input
                type='checkbox'
                id='training'
                checked={services.includes('training')}
                onChange={handleChange}
              />
              Training
            </label>
          </div>
          <button
            type='submit' // Change type to submit to trigger form submit
            className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
          >
            Search
          </button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          Listing results:
        </h1>
        <div className='p-4 grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No ServiceHome found!</p>
          )}
          {!loading &&
            listings.slice(0, visibleListings).map(listing => (
              <ListingItem key={listing.id} listing={listing} />
            ))}
        </div>
        {!loading && listings.length > visibleListings && (
          <button
            className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 mt-4 mx-auto block'
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
