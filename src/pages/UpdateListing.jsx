import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const { serviceName } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: null,
    hostelName: '',
    description: '',
    address: '',
    photos: [], // Updated to handle array of photos
    answers: {}, // Updated to store answers for questions dynamically
  });

  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListingAndQuestions = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch listing data
        const listingResponse = await fetch(
          `https://hibow.in/api/Provider/GetListingByUserIdAndServiceName?serviceName=${serviceName}&userId=${currentUser.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Token: currentUser.guid,
            },
          }
        );

        if (!listingResponse.ok) {
          throw new Error('Failed to fetch listing');
        }

        const listingData = await listingResponse.json();
        const {
          id,
          hostelName,
          description,
          address,
          photo1,
          photo2,
          photo3,
          photo4,
          photo5,
          photo6
        } = listingData.serviceHome;

        const preparedAnswers = {};
        listingData.answer.forEach((item) => {
          preparedAnswers[item.answer.question_id] = item.answer.ans;
        });

        setFormData({
          id,
          hostelName,
          description,
          address,
          photos: [photo1, photo2, photo3, photo4, photo5, photo6].filter(photo => photo !== ""),
          answers: preparedAnswers,
        });

        // Fetch questions data
        const questionsResponse = await fetch(
          `https://hibow.in/api/Booking/GetTheListofQuestions?serviceName=profile${serviceName}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Token: currentUser.guid,
            },
          }
        );

        if (!questionsResponse.ok) {
          throw new Error('Failed to fetch questions');
        }

        const questionsData = await questionsResponse.json();
        setQuestions(questionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchListingAndQuestions();
  }, [serviceName, currentUser.id, currentUser.guid]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleQuestionChange = (questionId) => (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      answers: {
        ...formData.answers,
        [questionId]: value,
      },
    });
  };

  const handlePhotoDelete = (index) => {
    const updatedPhotos = [...formData.photos];
    updatedPhotos.splice(index, 1);
    setFormData({
      ...formData,
      photos: updatedPhotos,
    });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    // Assuming you want to limit to 6 photos, adjust as necessary
    const newPhotos = files.map(file => URL.createObjectURL(file)).slice(0, 6);
    setFormData({
      ...formData,
      photos: [...formData.photos, ...newPhotos],
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
      setError(null);
  
      // Prepare update listing data
      const updateListingData = {
        id: formData.id,
        hostelName: formData.hostelName,
        description: formData.description,
        address: formData.address,
        photos: formData.photos,
      };
  
      // Update Listing API call
      const updateListingResponse = await fetch('https://hibow.in/api/Provider/EditServiceHomeDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Token: currentUser.guid,
        },
        body: JSON.stringify(updateListingData),
      });
  
      if (!updateListingResponse.ok) {
        throw new Error('Failed to update listing');
      }
  
      // Prepare answers payload
      const answersPayload = Object.keys(formData.answers).map((questionId) => ({
        question_id: parseInt(questionId), // Ensure question_id is parsed as integer if required by API
        customer_id: currentUser.id,
        ans: formData.answers[questionId],
      }));
  
      // Add Answers API call
      const addAnswersResponse = await fetch('https://hibow.in/api/User/AddAnswers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Token: currentUser.guid,
        },
        body: JSON.stringify({ newAnswers: answersPayload }), // Ensure to wrap in 'newAnswers' if required by API
      });
  
      if (!addAnswersResponse.ok) {
        throw new Error('Failed to add answers');
      }
  
      navigate(`/`); // Redirect to home page after successful update
    } catch (error) {
      setError(error.message || 'Failed to update listing');
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
    <main className='p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg'>
      <h1 className='text-4xl font-bold text-center my-8 text-gray-800'>
        Update Listing
      </h1>
      {error && <p className='text-red-500'>{error}</p>}
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label htmlFor='hostelName' className='text-gray-700'>
              Hostel Name
            </label>
            <input
              type='text'
              id='hostelName'
              placeholder='Hostel Name'
              className='border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none w-full'
              maxLength='62'
              value={formData.hostelName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor='address' className='text-gray-700'>
              Address
            </label>
            <input
              type='text'
              id='address'
              placeholder='Address'
              className='border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none w-full'
              maxLength='80'
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor='description' className='text-gray-700'>
            Description
          </label>
          <textarea
            id='description'
            placeholder='Description'
            className='border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none h-36 w-full'
            maxLength='300'
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div>
          <h2 className='text-2xl font-semibold'>Photos</h2>
          <div className='grid grid-cols-1 gap-4'>
            {formData.photos.map((photo, index) => (
              <div key={`photo-${index}`} className='flex items-center gap-4'>
                <img src={photo} alt={`Photo ${index + 1}`} className='w-32 h-32 object-cover rounded-lg' />
                <button
                  type='button'
                  onClick={() => handlePhotoDelete(index)}
                  className='bg-red-500 text-white py-2 px-4 rounded-lg font-semibold'
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <input
            type='file'
            id='photoUpload'
            accept='image/*'
            multiple
            onChange={handlePhotoUpload}
            className='mt-4'
          />
        </div>

        <div>
          <h2 className='text-2xl font-semibold'>Questions</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {questions.map((question) => (
              <div key={question.id}>
                <label htmlFor={`question-${question.id}`} className='text-gray-700'>
                  {question.questions}
                </label>
                <input
                  type='text'
                  id={`question-${question.id}`}
                  className='border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none w-full'
                  value={formData.answers[question.id] || ''}
                  onChange={handleQuestionChange(question.id)}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type='submit'
          className='bg-blue-500 text-white py-3 rounded-lg font-semibold mt-6 disabled:opacity-50 w-full'
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Listing'}
        </button>
      </form>
    </main>
  );
}
