/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    hostelName: '',
    description: '',
    address: '',
    phoneNumber: '',
    ServiceName: '',
    answers: {},
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!formData.ServiceName) return;

      try {
        const response = await fetch(
          `https://hibow.in/api/Booking/GetTheListofQuestions?serviceName=profile${formData.ServiceName}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Token': currentUser.guid,
            },
          }
        );
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [formData.ServiceName, currentUser.guid]);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = Array.from(files).map(storeImage);

      Promise.all(promises)
        .then((urls) => {
          setFormData((prev) => ({
            ...prev,
            imageUrls: [...prev.imageUrls, ...urls],
          }));
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError('Image upload failed (2 MB max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = `${new Date().getTime()}_${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (['boarding', 'training', 'grooming'].includes(id)) {
      setFormData((prev) => ({ ...prev, ServiceName: id }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleQuestionChange = (questionId) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (formData.imageUrls.length < 1) {
        throw new Error('You must upload at least one image');
      }
  
      setLoading(true);
      setError(null);
  
      const {
        hostelName,
        ServiceName,
        address,
        phoneNumber,
        description,
        imageUrls,
        answers,
      } = formData;
  
      const serviceHomePayload = {
        id: 0,
        userId: currentUser.id,
        ServiceName,
        hostelName,
        address,
        phoneNumber,
        description,
        ...imageUrls.reduce((acc, url, index) => {
          acc[`photo${index + 1}`] = url;
          return acc;
        }, {}),
      };
  
      const answersPayload = {
        Answers: Object.keys(answers).map((questionId) => ({
          question_id: parseInt(questionId, 10),
          customer_id: currentUser.id,
          ans: String(answers[questionId]),
        })),
      };
  
      const headers = {
        'Content-Type': 'application/json',
        'Token': currentUser.guid,
      };
  
      const [serviceHomeRes, addAnswersRes] = await Promise.all([
        fetch('https://hibow.in/api/Provider/AddServiceHomeDetails', {
          method: 'POST',
          headers,
          body: JSON.stringify(serviceHomePayload),
        }),
        fetch('https://hibow.in/api/User/AddAnswers', {
          method: 'POST',
          headers,
          body: JSON.stringify(answersPayload),
        }),
      ]);
  
      const serviceHomeData = await serviceHomeRes.json();
      const addAnswersData = await addAnswersRes.json();
  
      console.log('Service Home Response:', serviceHomeData);
      console.log('Add Answers Response:', addAnswersData);
  
      // Adjusting the success condition
      const isServiceHomeSuccess = serviceHomeData && serviceHomeData.id; // Assuming existence of id means success
      const isAnswersSuccess = addAnswersData && addAnswersData.message === 'Answers added successfully!!';
  
      if (isServiceHomeSuccess && isAnswersSuccess) {
        alert('Listing created successfully!');
        navigate(`/`);
      } else {
        const errorMessage = serviceHomeData.message || addAnswersData.message || 'Unknown error occurred';
        setError(errorMessage);
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      setError(error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  

  return (
    <main className='p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg'>
      <h1 className='text-4xl font-bold text-center my-8 text-gray-800'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <div className='flex flex-col gap-4'>
          <input
            type='text'
            placeholder='Hostel Name'
            className='border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none'
            id='hostelName'
            maxLength='62'
            minLength='5'
            required
            onChange={handleChange}
            value={formData.hostelName}
          />
          <textarea
            placeholder='Description'
            className='border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Full Address'
            className='border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
          <input
            type='text'
            placeholder='Phone Number'
            className='border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none'
            id='phoneNumber'
            required
            onChange={handleChange}
            value={formData.phoneNumber}
          />
          <div className='flex flex-wrap gap-4 mt-4'>
            {['boarding', 'training', 'grooming'].map((service) => (
              <div className='flex items-center gap-2' key={service}>
                <input
                  type='checkbox'
                  id={service}
                  className='w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                  onChange={handleChange}
                  checked={formData.ServiceName === service}
                />
                <span className='text-gray-700 capitalize'>{service}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <p className='font-semibold text-gray-800'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 bg-[#6d4c7d] text-white rounded uppercase hover:bg-[#755AA6] disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-600 text-sm'>
            {imageUploadError}
          </p>
          {formData.imageUrls.length > 0 && (
            <div className='flex flex-wrap gap-4 mt-4'>
              {formData.imageUrls.map((url, index) => (
                <div key={url} className='flex flex-col items-center'>
                  <img
                    src={url}
                    alt='listing'
                    className='w-20 h-20 object-cover rounded-lg shadow'
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveImage(index)}
                    className='mt-2 text-red-600 hover:text-red-800'
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
          {questions.length > 0 && (
            <div className='mt-6'>
              <h2 className='text-xl font-semibold text-gray-800'>Questions</h2>
              <ul className='list-disc ml-5'>
                {questions.map((question) => (
                  <li key={question.id} className='mb-2'>
                    <div className='text-gray-700'>{question.questions}</div>
                    <div className='flex flex-col gap-2 mt-2'>
                      <input
                        type='text'
                        id={question.id}
                        value={formData.answers[question.id] || ''}
                        onChange={handleQuestionChange(question.id)}
                        className='p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none'
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
          disabled={loading || uploading}
          className='p-3 bg-[#755AA6] text-white rounded-lg uppercase hover:bg-[#6d4c7d] disabled:opacity-80 mt-6'
        >
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
        {error && <p className='text-red-600 text-sm'>Error: {error}</p>}
      </form>
    </main>
  );
}
