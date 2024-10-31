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
  
          // Make API call to update listing
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
  
          // Prepare answers data for submission
          const answersPayload = Object.entries(formData.answers).map(([questionId, answer]) => ({
              question_id: parseInt(questionId),
              customer_id: currentUser.id,
              ans: answer,
          }));
  
          // Make API call to add answers
          const addAnswersResponse = await fetch('https://hibow.in/api/User/AddAnswers', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Token: currentUser.guid,
              },
              body: JSON.stringify({ Answers: answersPayload }),
          });
  
          if (!addAnswersResponse.ok) {
              const errorText = await addAnswersResponse.text();
              throw new Error(`Failed to add answers: ${errorText}`);
          }
  
          // Navigate to another page on success
          navigate(`/`);
      } catch (error) {
          setError(error.message || 'Failed to update listing');
      } finally {
          setLoading(false);
      }
  };
  

    return (
        <main className='p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg'>
            <h1 className='text-3xl font-bold mb-4'>Update Listing</h1>
            {error && <div className='text-red-500'>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label htmlFor='hostelName' className='block text-gray-700'>Hostel Name</label>
                    <input
                        type='text'
                        id='hostelName'
                        value={formData.hostelName}
                        onChange={handleChange}
                        className='border border-gray-300 p-2 rounded-lg w-full'
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='description' className='block text-gray-700'>Description</label>
                    <textarea
                        id='description'
                        value={formData.description}
                        onChange={handleChange}
                        className='border border-gray-300 p-2 rounded-lg w-full'
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='address' className='block text-gray-700'>Address</label>
                    <input
                        type='text'
                        id='address'
                        value={formData.address}
                        onChange={handleChange}
                        className='border border-gray-300 p-2 rounded-lg w-full'
                    />
                </div>

                <h2 className='text-xl font-semibold mb-2'>Photos</h2>
                <div className='flex flex-wrap'>
                    {formData.photos.map((photo, index) => (
                        <div key={index} className='relative w-1/3 p-1'>
                            <img src={photo} alt={`Uploaded Preview ${index + 1}`} className='w-full h-auto rounded-lg' />
                            <button
                                type='button'
                                onClick={() => handlePhotoDelete(index)}
                                className='absolute top-0 right-0 bg-red-600 text-white py-1 px-2 rounded-lg hover:bg-red-700 transition duration-200'
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
                <input
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={handlePhotoUpload}
                    className='mt-4 border border-gray-300 p-2 rounded-lg'
                />

                <h2 className='text-2xl font-semibold mt-6'>Questions</h2>
                {questions.map((question) => (
                    <div key={question.id} className='mb-4'>
                        <label className='text-gray-700 font-semibold'>{question.questions}</label>
                        <div className='flex flex-col'>
                            {question.id === 24 || question.id === 25 ? (
                                <>
                                    <label className='flex items-center'>
                                        <input
                                            type='radio'
                                            value='Yes'
                                            checked={formData.answers[question.id] === 'Yes'}
                                            onChange={handleQuestionChange(question.id)}
                                            className='mr-2'
                                        />
                                        Yes
                                    </label>
                                    <label className='flex items-center'>
                                        <input
                                            type='radio'
                                            value='No'
                                            checked={formData.answers[question.id] === 'No'}
                                            onChange={handleQuestionChange(question.id)}
                                            className='mr-2'
                                        />
                                        No
                                    </label>
                                </>
                            ) : question.id === 35 ? (
                                <>
                                    <label className='flex items-center'>
                                        <input
                                            type='radio'
                                            value='Dog'
                                            checked={formData.answers[question.id] === 'Dog'}
                                            onChange={handleQuestionChange(question.id)}
                                            className='mr-2'
                                        />
                                        Dog
                                    </label>
                                    <label className='flex items-center'>
                                        <input
                                            type='radio'
                                            value='Cat'
                                            checked={formData.answers[question.id] === 'Cat'}
                                            onChange={handleQuestionChange(question.id)}
                                            className='mr-2'
                                        />
                                        Cat
                                    </label>
                                    <label className='flex items-center'>
                                        <input
                                            type='radio'
                                            value='Bird'
                                            checked={formData.answers[question.id] === 'Bird'}
                                            onChange={handleQuestionChange(question.id)}
                                            className='mr-2'
                                        />
                                        Bird
                                    </label>
                                </>
                            ) : question.id === 36 ? (
                                <>
                                    <label className='flex items-center'>
                                        <input
                                            type='radio'
                                            value='Small'
                                            checked={formData.answers[question.id] === 'Small'}
                                            onChange={handleQuestionChange(question.id)}
                                            className='mr-2'
                                        />
                                        Small
                                    </label>
                                    <label className='flex items-center'>
                                        <input
                                            type='radio'
                                            value='Medium'
                                            checked={formData.answers[question.id] === 'Medium'}
                                            onChange={handleQuestionChange(question.id)}
                                            className='mr-2'
                                        />
                                        Medium
                                    </label>
                                    <label className='flex items-center'>
                                        <input
                                            type='radio'
                                            value='Large'
                                            checked={formData.answers[question.id] === 'Large'}
                                            onChange={handleQuestionChange(question.id)}
                                            className='mr-2'
                                        />
                                        Large
                                    </label>
                                </>
                            ) : (
                                <input
                                    type='text'
                                    id={`question-${question.id}`}
                                    className='border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-full'
                                    value={formData.answers[question.id] || ''}
                                    onChange={handleQuestionChange(question.id)}
                                />
                            )}
                        </div>
                    </div>
                ))}

                <button
                    type='submit'
                    className='bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200'
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Listing'}
                </button>
            </form>
        </main>
    );
}
