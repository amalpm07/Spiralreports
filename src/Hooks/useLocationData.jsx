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
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      
      // Check if data is an object and has a country_Name property
      if (data && data.country_Name) {
        setCountries([data]); // Wrap the object in an array
      } else {
        throw new Error('Countries data is not an array or valid object.');
      }
    } catch (error) {
      setError('Failed to fetch countries: ' + error.message);
    }
  };

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
