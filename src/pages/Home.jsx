/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import CategoryMetaNav from '../components/CategoryNav';
SwiperCore.use([Navigation, Autoplay, Pagination]);

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* image carousel */}
      <Swiper
        navigation
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className='my-8 max-w-6xl mx-auto'
      >
        {/* Adding images to the carousel */}
        <SwiperSlide>
          <div
            style={{
              background: 'url(/images/carousel1.jpg) center no-repeat',
              backgroundSize: 'cover',
            }}
            className='h-[500px]'
          ></div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            style={{
              background: 'url(/images/carousel2.jpg) center no-repeat',
              backgroundSize: 'cover',
            }}
            className='h-[500px]'
          ></div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            style={{
              background: 'url(/images/carousel3.jpg) center no-repeat',
              backgroundSize: 'cover',
            }}
            className='h-[500px]'
          ></div>
        </SwiperSlide>
        {/* New Image from Pexels */}
        <SwiperSlide>
          <div
            style={{
              background: 'url(https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg) center no-repeat',
              backgroundSize: 'cover',
            }}
            className='h-[500px]'
          ></div>
        </SwiperSlide>
        {/* New Image from provided URL */}
        <SwiperSlide>
          <div
            style={{
              background: 'url(https://t3.ftcdn.net/jpg/06/93/34/28/240_F_693342898_x4sRRem5Jet4IoUYXqAo3KTWawtA5A5R.jpg) center no-repeat',
              backgroundSize: 'cover',
            }}
            className='h-[500px]'
          ></div>
        </SwiperSlide>
        {/* Another New Image from provided URL */}
        <SwiperSlide>
          <div
            style={{
              background: 'url(https://t3.ftcdn.net/jpg/07/01/93/94/240_F_701939441_W17piTgrQWkKPR40Qcj3lyEtLqJsapFe.jpg) center no-repeat',
              backgroundSize: 'cover',
            }}
            className='h-[500px]'
          ></div>
        </SwiperSlide>
      </Swiper>
<CategoryMetaNav/>
      {/* top section */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          <br />
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>

      {/* listing results for offer, sale and rent */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
