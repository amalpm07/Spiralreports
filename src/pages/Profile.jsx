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
  padding: 2rem;
  max-width: 600px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  border: 3px solid #e5e7eb;
`;

const EditIcon = styled.span`
  position: absolute;
  bottom: 0;
  right: 50%;
  transform: translateX(50%);
  background: #e5e7eb;
  color: #1e293b;
  border-radius: 50%;
  padding: 0.5rem;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  background-color: #1e293b;
  color: white;
  border-radius: 0.375rem;
  padding: 0.75rem 1.5rem;
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #374151;
  }
  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const LinkButton = styled(Link)`
  display: inline-block;
  background-color: #10b981;
  color: white;
  border-radius: 0.375rem;
  padding: 0.75rem 1.5rem;
  text-transform: uppercase;
  font-weight: 600;
  text-align: center;
  transition: background-color 0.3s;
  &:hover {
    background-color: #047857;
  }
`;

const ActionButton = styled.span`
  cursor: pointer;
  font-weight: 600;
  &:hover {
    opacity: 0.75;
  }
`;

const MessageText = styled.p`
  color: ${({ error }) => (error ? '#dc2626' : '#16a34a')};
  margin-top: 1rem;
  text-align: center;
`;

const ListingContainer = styled.div`
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
  margin-bottom: 1rem;
`;

const ListingImage = styled.img`
  height: 3rem;
  width: 3rem;
  border-radius: 0.375rem;
  object-fit: cover;
`;

const ListingDetails = styled.div`
  flex: 1;
  margin-left: 1rem;
`;

const ListingActions = styled.div`
  display: flex;
  gap: 1rem;
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
      const res = await fetch(`https://hibow.in/api/User/LoginDelete?userid=${currentUser.id}`, {
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
              <EditIcon onClick={() => fileRef.current.click()}>
                ✎
              </EditIcon>
            </AvatarContainer>

            <p className='text-sm self-center'>
              {fileUploadError ? (
                <span>Error uploading image (image must be less than 2 MB)</span>
              ) : filePerc > 0 && filePerc < 100 ? (
                <span>{`Uploading ${filePerc}%`}</span>
              ) : filePerc === 100 ? (
                <span>Image successfully uploaded!</span>
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
            <LinkButton
              to='/create-listing'
            >
              Create Service
            </LinkButton>
          </Form>
        )}
      </Formik>
      <div className='flex justify-between mt-5'>
        <ActionButton onClick={handleDeleteUser}>
          Delete account
        </ActionButton>
        <ActionButton onClick={handleSignOut}>
          Sign out
        </ActionButton>
      </div>
      <MessageText error={!!error}>{error ? error : updateSuccess ? 'User updated successfully!' : ''}</MessageText>
      <button onClick={handleShowListings} className='text-green-700 w-full mt-5'>
        Show your Services
      </button>
      <MessageText error={showListingsError}>{showListingsError ? 'Error showing listings' : ''}</MessageText>
      {userListings && userListings.length > 0 && (
        <ListingContainer>
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Services</h1>
          {userListings.map((listing) => (
            <ListingCard key={listing._id}>
              <Link to={`/listing/${listing._id}`}>
                <ListingImage src={listing.imageUrls[0]} alt='listing cover' />
              </Link>
              <ListingDetails>
                <Link className='text-slate-700 font-semibold hover:underline' to={`/listing/${listing._id}`}>
                  <p>{listing.name}</p>
                </Link>
              </ListingDetails>
              <ListingActions>
                <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </ListingActions>
            </ListingCard>
          ))}
        </ListingContainer>
      )}
    </ProfileContainer>
  );
}
