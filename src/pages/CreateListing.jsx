/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import FormInput from '../components/FormInput';
import ImageUploader from '../components/ImageUploader';
import QuestionInput from '../components/questioninput';

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
  const [approvalNeeded, setApprovalNeeded] = useState(false); // State for approval needed

  // Fetch questions based on ServiceName
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
        isApprovalNeeded: approvalNeeded, // Updated here
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
      <h1 className='text-4xl font-bold text-center my-8 text-gray-800'>Create a Listing</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <div className='flex flex-col gap-4'>
          <FormInput
            id='hostelName'
            placeholder='Hostel Name'
            value={formData.hostelName}
            onChange={handleChange}
            required
            minLength={5}
            maxLength={62}
          />
          <textarea
            placeholder='Description'
            className='border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <FormInput
            id='address'
            placeholder='Full Address'
            value={formData.address}
            onChange={handleChange}
            required
          />
          <FormInput
            id='phoneNumber'
            placeholder='Phone Number'
            value={formData.phoneNumber}
            onChange={handleChange}
            required
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
          <div className='mt-4'>
            <label className='font-semibold text-gray-800'>Approval Needed:</label>
            <div className='flex gap-4'>
              <label className='flex items-center'>
                <input
                  type='radio'
                  name='approvalNeeded'
                  value='true'
                  checked={approvalNeeded === true}
                  onChange={() => setApprovalNeeded(true)}
                  className='mr-2'
                />
                Yes
              </label>
              <label className='flex items-center'>
                <input
                  type='radio'
                  name='approvalNeeded'
                  value='false'
                  checked={approvalNeeded === false}
                  onChange={() => setApprovalNeeded(false)}
                  className='mr-2'
                />
                No
              </label>
            </div>
          </div>
        </div>
        <ImageUploader
          files={files}
          setFiles={setFiles}
          handleImageSubmit={handleImageSubmit}
          imageUploadError={imageUploadError}
          uploading={uploading}
          handleRemoveImage={handleRemoveImage}
          imageUrls={formData.imageUrls}
        />
        {questions.length > 0 && (
          <div className='mt-6'>
            <h2 className='text-xl font-semibold text-gray-800'>Questions</h2>
            <ul className='list-disc ml-5'>
              {questions.map((question) => (
                <QuestionInput
                  key={question.id}
                  question={question}
                  value={formData.answers[question.id] || ''}
                  onChange={handleQuestionChange(question.id)}
                />
              ))}
            </ul>
          </div>
        )}
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
