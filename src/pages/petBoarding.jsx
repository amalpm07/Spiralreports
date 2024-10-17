/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import ListingItem from '../components/ListingItem';
import useLocationData from '../Hooks/useLocationData';
import '../styleComponets/search.css';

const SearchForm = ({ onSearch, error }) => {
  const { countries, states, districts, fetchStates, fetchDistricts } = useLocationData();
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');

  const handleCountryChange = (e) => {
    const value = e.target.value;
    setCountry(value);
    setState('');
    setDistrict('');
    fetchStates(value);
  };

  const handleStateChange = (e) => {
    const selectedState = states.find(s => s.state_Name === e.target.value);
    setState(selectedState ? selectedState : '');
    setDistrict('');
    if (selectedState) {
      fetchDistricts(selectedState.id);
    }
  };

  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const location = district || state.state_Name;
    onSearch({ location, services: [state.state_Name] }); // Adjust to include state name if needed
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-6">
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
          value={state.state_Name || ''}
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
          onChange={handleDistrictChange}
          aria-label="District"
        >
          <option value="" disabled>Select a district</option>
          {districts.map((d) => (
            <option key={d.id} value={d.district_Name}>{d.district_Name}</option>
          ))}
        </select>
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

const SearchResults = ({ listings, loading, error, currentPage, listingsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(listings.length / listingsPerPage);

  return (
    <div className="flex-1 p-8">
      <h1 className="text-3xl font-semibold text-[#755AA6] border-b-2 pb-2 mb-4">Results</h1>
      {loading && <p className="text-xl text-gray-700 text-center">Loading...</p>}
      {error && <p className="text-xl text-red-600 text-center">{error}</p>}
      {!loading && listings.length === 0 && !error && (
        <p className="text-xl text-gray-700 text-center">No Service Home found!</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && listings.slice((currentPage - 1) * listingsPerPage, currentPage * listingsPerPage).map((listing) => (
          <ListingItem key={listing.id} listing={listing} />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index + 1)}
            className={`mx-1 p-2 rounded-lg ${currentPage === index + 1 ? 'bg-[#755AA6] text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

const Search = () => {
  const { serviceName } = useParams(); // Get the service name from URL
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 6;

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = 'https://hibow.in/api/Provider/SearchServiceHomeByLocationAndServicenName';
      const params = new URLSearchParams();

      const location = searchParams?.district || searchParams?.location;

      if (location) {
        params.append('serviceHomeLocation', location);
      }
      params.append('serviceName', serviceName || 'boarding'); // Use serviceName from URL

      const res = await fetch(`${url}?${params}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setListings(data);
      setCurrentPage(1); // Reset to first page on new fetch
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch listings. Please try again later.');
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams, serviceName]); // Include serviceName in the dependency array

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleSearch = (params) => {
    setSearchParams(params);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
          currentPage={currentPage} 
          listingsPerPage={listingsPerPage}
          onPageChange={handlePageChange} 
        />
      </div>
    </div>
  );
};

export default Search;
