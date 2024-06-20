import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import 'react-datepicker/dist/react-datepicker.css';
// index.js or App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import Booking from './pages/Booking';
import Payment from './pages/Payment'
import Showmybookings from './pages/showmybookings'
import Showmylisting from './pages/showmylisting'
import BookingDetailsPage from './pages/BookingDetailsPage'
export default function App() {
  return (
    <BrowserRouter>
      <Header />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/about' element={<About />} />
        <Route path='/search' element={<Search />} />
        <Route path='/showmybookings' element={<Showmybookings />} />
        <Route path='/showmylisting' element={<Showmylisting/>} />
        <Route path='/listing/:listingId' element={<Listing />} />
        <Route path="/booking/:id" element={<BookingDetailsPage />} />
        <Route path="/listing/:selectedType/:id" element={<Listing />} />        
        <Route path='/booking' element={<Booking />} />
        <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route
            path='/update-listing/:listingId'
            element={<UpdateListing />}
          />
        <Route element={<PrivateRoute />}>
      
        </Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}