/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const ListingContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  width: 100%;
  max-width: 330px;
  cursor: pointer;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Content = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
  color: #4a5568; /* slate-700 */
`;

const Address = styled.p`
  font-size: 0.875rem;
  color: #718096; /* gray-600 */
  display: flex;
  align-items: center;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: #4a5568; /* slate-500 */
  line-clamp: 2;
`;

const HostelName = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568; /* slate-500 */
`;

const ListingItem = ({ listing }) => {
  const {
    id,
    userId,
    serviceName,
    hostelName,
    address,
    description,
    photo1,
    photo2,
    photo3,
    photo4,
    photo5,
    photo6,
  } = listing;
  
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);

  return (
    <ListingContainer>
      <Link 
        to={`/listing/${serviceName}/${userId}`} 
        state={{ 
          id, 
          serviceName, 
          hostelName, 
          address, 
          description, 
          photo1, 
          photo2, 
          photo3, 
          photo4, 
          photo5, 
          photo6 
        }}
      >
        <Image
          src={photo1 || 'https://via.placeholder.com/595x400'}
          alt='Listing cover'
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/595x400'; // Placeholder image or default image URL
          }}
        />
        <Content>
          <Title className='truncate'>{serviceName}</Title>
          <Address>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <span className='ml-1'>{address || 'Address not provided'}</span>
          </Address>
          <Description className='line-clamp-2'>
            {description || 'No description available'}
          </Description>
          <HostelName>{hostelName}</HostelName>
        </Content>
      </Link>
    </ListingContainer>
  );
};

export default ListingItem;
