// hooks/useLocationData.js
import { useState, useEffect } from 'react';

const useLocationData = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [error, setError] = useState(null);

  const fetchCountries = async () => {
    try {
      const res = await fetch('https://hibow.in/api/Country');
      console.log("Response status:", res.status); // Log response status
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      
      const data = await res.json();
      // console.log("Fetched data:", data); // Log fetched data

      // Check if the data is an object and convert it to an array
      if (Array.isArray(data)) {
        setCountries(data);
      } else if (typeof data === 'object') {
        setCountries([data]); // Wrap in an array
      } else {
        throw new Error('Countries data is not a valid array or object.');
      }
    } catch (error) {
      setError('Failed to fetch countries: ' + error.message);
    }
  };
console.log(countries);

  const fetchStates = async (countryId) => {
    if (!countryId) return;
    try {
      const res = await fetch(`https://hibow.in/api/Country/State?countryID=${countryId}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setStates(data);
      } else {
        throw new Error('States data is not an array.');
      }
    } catch (error) {
      setError('Failed to fetch states: ' + error.message);
    }
  };

  const fetchDistricts = async (stateId) => {
    if (!stateId) return;
    try {
      const res = await fetch(`https://hibow.in/api/Country/District?stateID=${stateId}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setDistricts(data);
      } else {
        throw new Error('Districts data is not an array.');
      }
    } catch (error) {
      setError('Failed to fetch districts: ' + error.message);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return { countries, states, districts, fetchStates, fetchDistricts, error };
};

export default useLocationData;
