import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const { serviceName } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: null,
    userId: currentUser.id,
    serviceName: serviceName,
    hostelName: '',
    description: '',
    address: '',
    photos: [],
    answers: {},
    isApprovalNeeded: false,
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
          photo6,
          isApprovalNeeded,
        } = listingData.serviceHome;

        const preparedAnswers = {};
        listingData.answer.forEach((item) => {
          preparedAnswers[item.answer.question_id] = item.answer.ans;
        });

        setFormData({
          id,
          userId: currentUser.id,
          serviceName,
          hostelName,
          description,
          address,
          photos: [photo1, photo2, photo3, photo4, photo5, photo6].filter(photo => photo !== ""),
          answers: preparedAnswers,
          isApprovalNeeded,
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
      console.log('Form Data before submit:', formData); // Debugging

      // Prepare update listing data
      const updateListingData = {
        id: formData.id,
        userId: formData.userId,
        serviceName: formData.serviceName,
        hostelName: formData.hostelName,
        address: formData.address,
        description: formData.description,
        photo1: formData.photos[0] || "",
        photo2: formData.photos[1] || "",
        photo3: formData.photos[2] || "",
        photo4: formData.photos[3] || "",
        photo5: formData.photos[4] || "",
        photo6: formData.photos[5] || "",
        isApprovalNeeded: formData.isApprovalNeeded,
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
        const errorText = await updateListingResponse.text();
        throw new Error(`Failed to update listing: ${errorText}`);
      }

      // Prepare answers payload
      const answersPayload = Object.keys(formData.answers).map((questionId) => ({
        question_id: parseInt(questionId),
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
        body: JSON.stringify({ newAnswers: answersPayload }),
      });

      if (!addAnswersResponse.ok) {
        const errorText = await addAnswersResponse.text();
        throw new Error(`Failed to add answers: ${errorText}`);
      }

      navigate(`/`); // Redirect after successful update
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
            {questions.map((question) => {
              if (question.id === 24 || question.id === 25) {
                return (
                  <div key={question.id}>
                    <label className='text-gray-700'>{question.questions}</label>
                    <div className='flex flex-col'>
                      <label>
                        <input
                          type='radio'
                          value='yes'
                          checked={formData.answers[question.id] === 'yes'}
                          onChange={handleQuestionChange(question.id)}
                        />
                        Yes
                      </label>
                      <label>
                        <input
                          type='radio'
                          value='no'
                          checked={formData.answers[question.id] === 'no'}
                          onChange={handleQuestionChange(question.id)}
                        />
                        No
                      </label>
                    </div>
                  </div>
                );
              } else if (question.id === 35) {
                return (
                  <div key={question.id}>
                    <label className='text-gray-700'>{question.questions}</label>
                    <div className='flex flex-col'>
                      <label>
                        <input
                          type='radio'
                          value='dog'
                          checked={formData.answers[question.id] === 'dog'}
                          onChange={handleQuestionChange(question.id)}
                        />
                        Dog
                      </label>
                      <label>
                        <input
                          type='radio'
                          value='cat'
                          checked={formData.answers[question.id] === 'cat'}
                          onChange={handleQuestionChange(question.id)}
                        />
                        Cat
                      </label>
                      <label>
                        <input
                          type='radio'
                          value='bird'
                          checked={formData.answers[question.id] === 'bird'}
                          onChange={handleQuestionChange(question.id)}
                        />
                        Bird
                      </label>
                    </div>
                  </div>
                );
              } else if (question.id === 36) {
                return (
                  <div key={question.id}>
                    <label className='text-gray-700'>{question.questions}</label>
                    <div className='flex flex-col'>
                      <label>
                        <input
                          type='radio'
                          value='small'
                          checked={formData.answers[question.id] === 'small'}
                          onChange={handleQuestionChange(question.id)}
                        />
                        Small
                      </label>
                      <label>
                        <input
                          type='radio'
                          value='medium'
                          checked={formData.answers[question.id] === 'medium'}
                          onChange={handleQuestionChange(question.id)}
                        />
                        Medium
                      </label>
                      <label>
                        <input
                          type='radio'
                          value='large'
                          checked={formData.answers[question.id] === 'large'}
                          onChange={handleQuestionChange(question.id)}
                        />
                        Large
                      </label>
                    </div>
                  </div>
                );
              } else {
                return (
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
                );
              }
            })}
          </div>
        </div>

        <button
          type='submit'
          className='bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold'
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Listing'}
        </button>
      </form>
    </main>
  );
}
