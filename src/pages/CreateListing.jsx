import { useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imageUrls: [],
    hostelName: '',
    description: '',
    address: '',
    ServiceName: '',
    offer: false,
    answers: {},
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `https://hibow.in/api/Booking/GetTheListofQuestions?serviceName=profile${formData.ServiceName}`
        );
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    if (formData.ServiceName) {
      fetchQuestions();
    }
  }, [formData.ServiceName]);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === 'boarding' || id === 'training' || id === 'grooming') {
      setFormData({
        ...formData,
        ServiceName: id,
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1) {
        throw new Error('You must upload at least one image');
      }

      setLoading(true);
      setError(null);

      // eslint-disable-next-line no-unused-vars
      const { hostelName, ServiceName, address, description, imageUrls, answers } = formData;

      let selectedType = '';
      if (formData.ServiceName === 'boarding') {
        selectedType = 'boarding';
      } else if (formData.ServiceName === 'training') {
        selectedType = 'training';
      } else if (formData.ServiceName === 'grooming') {
        selectedType = 'grooming';
      }

      const photos = imageUrls.reduce((acc, url, index) => {
        acc[`photo${index + 1}`] = url;
        return acc;
      }, {});

      for (let i = imageUrls.length; i < 6; i++) {
        photos[`photo${i + 1}`] = '';
      }

      const serviceHomePayload = {
        id: 0,
        userId: currentUser.id,
        ServiceName: selectedType,
        hostelName,
        address,
        description,
        ...photos,
      };

      const answersPayload = Object.keys(answers).map((questionId) => ({
        id: 0,
        question_id: questionId,
        customer_id: currentUser.id,
        ans: String(answers[questionId]),
      }));

      const [serviceHomeRes, addAnswersRes] = await Promise.all([
        fetch('https://hibow.in/api/Provider/AddServiceHomeDetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(serviceHomePayload),
        }),
        fetch('https://hibow.in/api/User/AddAnswers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(answersPayload),
        }),
      ]);

      const serviceHomeData = await serviceHomeRes.json();
      const addAnswersData = await addAnswersRes.json();

      if (!serviceHomeRes.ok || !serviceHomeData.success) {
        throw new Error(
          serviceHomeData.message || 'Failed to add service home details'
        );
      }

      if (!addAnswersRes.ok || !addAnswersData.success) {
        throw new Error(addAnswersData.message || 'Failed to add answers');
      }

      navigate(`/`);

    } catch (error) {
      setError(error.message);
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
            placeholder='hostalName'
            className='border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none'
            id='hostelName'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.hostelName}
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className='flex flex-wrap gap-4 mt-4'>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='boarding'
                className='w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                onChange={handleChange}
                checked={formData.ServiceName === 'boarding'}
              />
              <span className='text-gray-700'>Boarding</span>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='training'
                className='w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                onChange={handleChange}
                checked={formData.ServiceName === 'training'}
              />
              <span className='text-gray-700'>Training</span>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='grooming'
                className='w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                onChange={handleChange}
                checked={formData.ServiceName === 'grooming'}
              />
              <span className='text-gray-700'>Grooming</span>
            </div>
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
              className='p-3 bg-green-600 text-white rounded uppercase hover:bg-green-700 disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-600 text-sm'>{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 && (
            <div className='flex flex-wrap gap-4 mt-4'>
              {formData.imageUrls.map((url, index) => (
                <div key={url} className='flex flex-col items-center'>
                  <img
                    src={url}
                    alt='listing image'
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
                      <label className='block'>
                        <input
                          type='text'
                          id={`${question.id}`}
                          value={formData.answers[question.id] || ''}
                          onChange={handleQuestionChange(question.id)}
                          className='p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none'
                        />
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
          disabled={loading || uploading}
          className='p-3 bg-blue-600 text-white rounded-lg uppercase hover:bg-blue-700 disabled:opacity-80 mt-6'
        >
          {loading ? 'Creating...' : 'Create listing'}
        </button>
        {error && <p className='text-red-600 text-sm'>{error}</p>}
      </form>
    </main>
  );
}
