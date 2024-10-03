/* eslint-disable react/prop-types */
// components/Search.js
import { useState, useEffect, useCallback } from 'react';
import ListingItem from '../components/ListingItem';
import useLocationData from '../Hooks/useLocationData';
import '../styleComponets/search.css';

const SearchForm = ({ onSearch, error }) => {
  const { countries, states, districts, fetchStates, fetchDistricts } = useLocationData();
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [service, setService] = useState('');

  const handleCountryChange = (e) => {
    const value = e.target.value;
    setCountry(value);
    setState('');
    setDistrict('');
    fetchStates(value);
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    setState(value);
    setDistrict('');
    fetchDistricts(value);
  };

  const handleServiceChange = (e) => {
    setService(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const location = district || state; // Use state if district is empty
    onSearch({ district: location, service });
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-[#755AA6] mb-4">Search</h2>
      {error && <p className="text-red-600">{error}</p>}

      {/* Country Selection */}
      <div className="flex flex-col mb-4">
        <label htmlFor="country" className="font-medium text-gray-700 mb-1">Country:</label>
        <select
          id="country"
          className="border rounded-lg p-3 w-full text-gray-900 transition duration-300"
          value={country}
          onChange={handleCountryChange}
          aria-label="Country"
        >
          <option value="" disabled>Select a country</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>{c.country_Name}</option>
          ))}
        </select>
      </div>

      {/* State Selection */}
      <div className="flex flex-col mb-4">
        <label htmlFor="state" className="font-medium text-gray-700 mb-1">State:</label>
        <select
          id="state"
          className="border rounded-lg p-3 w-full text-gray-900 transition duration-300"
          value={state}
          onChange={handleStateChange}
          aria-label="State"
        >
          <option value="" disabled>Select a state</option>
          {states.map((s) => (
            <option key={s.id} value={s.state_Name}>{s.state_Name}</option>
          ))}
        </select>
      </div>

      {/* District Selection */}
      <div className="flex flex-col mb-4">
        <label htmlFor="district" className="font-medium text-gray-700 mb-1">District:</label>
        <select
          id="district"
          className="border rounded-lg p-3 w-full text-gray-900 transition duration-300"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          aria-label="District"
        >
          <option value="" disabled>Select a district</option>
          {districts.map((d) => (
            <option key={d.id} value={d.district_Name}>{d.district_Name}</option>
          ))}
        </select>
      </div>

      {/* Service Selection */}
      <div className="mb-4">
        <span className="block font-medium text-gray-700 mb-1">Services:</span>
        <div className="flex flex-wrap gap-4">
          {['boarding', 'grooming', 'training'].map((serviceName) => (
            <label key={serviceName} className="flex items-center gap-2">
              <input
                type="radio"
                value={serviceName}
                checked={service === serviceName}
                onChange={handleServiceChange}
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
  );
};

const SearchResults = ({ listings, loading, error, visibleListings, onShowMore }) => (
  <div className="flex-1 p-8">
    <h1 className="text-3xl font-semibold text-[#755AA6] border-b-2 pb-2 mb-4">Listing Results</h1>
    {loading && <p className="text-xl text-gray-700 text-center">Loading...</p>}
    {error && <p className="text-xl text-red-600 text-center">{error}</p>}
    {!loading && listings.length === 0 && !error && (
      <p className="text-xl text-gray-700 text-center">No ServiceHome found!</p>
    )}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {!loading && listings.slice(0, visibleListings).map((listing) => (
        <ListingItem key={listing.id} listing={listing} />
      ))}
    </div>
    {!loading && listings.length > visibleListings && (
      <button
        className="bg-[#755AA6] text-white p-3 rounded-lg uppercase hover:bg-[#6a4d8e] transition duration-300 mt-6 mx-auto block shadow-md"
        onClick={onShowMore}
      >
        Show More
      </button>
    )}
  </div>
);

const Search = () => {
  const [listings, setListings] = useState([]);
  const [visibleListings, setVisibleListings] = useState(3);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState(null);
  const [error, setError] = useState(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = 'https://hibow.in/api/Provider/SearchServiceHomeByLocationAndServicenName';
      const params = new URLSearchParams();

      const location = searchParams?.district || searchParams?.state; // Use state if district is null

      if (location) {
        params.append('serviceHomeLocation', location); // Use state name now
      }
      if (searchParams?.service) {
        params.append('serviceName', searchParams.service);
      }

      const res = await fetch(`${url}?${params}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setListings(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch listings. Please try again later.');
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchParams) {
      fetchListings();
    }
  }, [searchParams, fetchListings]);

  const handleSearch = (params) => {
    setSearchParams(params);
    setVisibleListings(3); // Reset visible listings on new search
  };

  const handleShowMore = () => {
    setVisibleListings((prev) => prev + 3);
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
      <div className="p-8 bg-white border-r-2 md:min-h-screen md:w-1/3 shadow-lg">
        <SearchForm onSearch={handleSearch} error={error} />
      </div>
      <div className="flex-1">
        <SearchResults 
          listings={listings} 
          loading={loading} 
          error={error} 
          visibleListings={visibleListings} 
          onShowMore={handleShowMore} 
        />
      </div>
    </div>
  );
};

export default Search;
