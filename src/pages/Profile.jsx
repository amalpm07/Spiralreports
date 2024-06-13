import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  padding: 3rem;
  max-width: 800px;
  margin: auto;
  background: #f9fafb;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const AvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`;

const Avatar = styled.img`
  border-radius: 50%;
  height: 8rem;
  width: 8rem;
  cursor: pointer;
  margin-top: 1rem;
  object-fit: cover;
  border: 3px solid #1e293b;
`;

const EditIcon = styled.span`
  position: absolute;
  bottom: 0;
  right: 50%;
  transform: translateX(50%);
  background: #1e293b;
  color: white;
  border-radius: 50%;
  padding: 0.5rem;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  background-color: #1e293b;
  color: white;
  border-radius: 0.375rem;
  padding: 0.75rem;
  text-transform: uppercase;
  &:hover {
    opacity: 0.95;
  }
  &:disabled {
    opacity: 0.8;
  }
`;

const DeleteButton = styled.span`
  color: #dc2626;
  cursor: pointer;
  &:hover {
    opacity: 0.75;
  }
`;

const SignOutButton = styled.span`
  color: #ef4444;
  cursor: pointer;
  &:hover {
    opacity: 0.75;
  }
`;

const ErrorText = styled.p`
  color: #dc2626;
  margin-top: 1.25rem;
`;

const SuccessText = styled.p`
  color: #16a34a;
  margin-top: 1.25rem;
`;

const ListingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const ListingCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      () => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmDelete) return;
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/auth/User?userName=${currentUser?.username ?? ''}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`https://hibow.in/User/LoginDelete?userid=${currentUser.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to logout');
      }

      const data = await res.json();
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      console.error('Sign-out error:', error);
    }
  };

  useEffect(() => {
    console.log('Current User:', currentUser);
  }, [currentUser]);

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (!data.success) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data.listings);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <ProfileContainer>
      <h1 className='text-4xl font-semibold text-center my-7'>Profile</h1>
      <Formik
        initialValues={{
          username: currentUser.userName,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setFormData(values);
          try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(values),
            });
            const data = await res.json();
            if (!res.ok) {
              dispatch(updateUserFailure(data.message));
              return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
          } catch (error) {
            dispatch(updateUserFailure(error.message));
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className='flex flex-col gap-6'>
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type='file'
              ref={fileRef}
              hidden
              accept='image/*'
            />
            <AvatarContainer>
              <Avatar
                onClick={() => fileRef.current.click()}
                src={formData?.avatar || currentUser?.avatar || ''}
                alt='profile'
              />
              <EditIcon onClick={() => fileRef.current.click()}>✎</EditIcon>
            </AvatarContainer>

            <p className='text-sm self-center'>
              {fileUploadError ? (
                <span className='text-red-700'>Error uploading image (image must be less than 2 MB)</span>
              ) : filePerc > 0 && filePerc < 100 ? (
                <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
              ) : filePerc === 100 ? (
                <span className='text-green-700'>Image successfully uploaded!</span>
              ) : (
                ''
              )}
            </p>
            <div>
              <Field type='text' name='username' placeholder='Username' className='border p-3 rounded-lg w-full' />
              <ErrorMessage name='username' component='div' className='text-red-600' />
            </div>

            <SubmitButton type='submit' disabled={isSubmitting || loading}>
              {loading ? 'Loading...' : 'Update'}
            </SubmitButton>
            <Link
              className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
              to='/create-listing'
            >
              Create Service
            </Link>
          </Form>
        )}
      </Formik>
      <div className='flex justify-between mt-5'>
        <DeleteButton onClick={handleDeleteUser}>
          Delete account
        </DeleteButton>
        <SignOutButton onClick={handleSignOut}>
          Sign out
        </SignOutButton>
      </div>
      <ErrorText>{error ? error : ''}</ErrorText>
      <SuccessText>{updateSuccess ? 'User updated successfully!' : ''}</SuccessText>
      <button onClick={handleShowListings} className='text-green-700 w-full mt-5'>
        Show your Services
      </button>
      <ErrorText>{showListingsError ? 'Error showing listings' : ''}</ErrorText>
      {userListings && userListings.length > 0 && (
        <ListingContainer>
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Services</h1>
          {userListings.map((listing) => (
            <ListingCard key={listing._id}>
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt='listing cover' className='h-16 w-16 object-cover' />
              </Link>
              <Link className='text-slate-700 font-semibold hover:underline flex-1 truncate' to={`/listing/${listing._id}`}>
                <p>{listing.name}</p>
              </Link>
              <div className='flex flex-col items-center'>
                <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </ListingCard>
          ))}
        </ListingContainer>
      )}
    </ProfileContainer>
  );
}
