import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import ShowMyBookings from './pages/ShowMyBookings';
import ShowMyListing from './pages/ShowMyListing';
import BookingDetailsPage from './pages/BookingDetailsPage';
import PremiumSubscription from './pages/PremiumSubscription '; // Corrected import path
import BookingModule from './pages/BookingModule';
const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/about' element={<About />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/update-listing/:listingId' element={<UpdateListing />} />
          <Route path='/listing/:listingId' element={<Listing />} />
          <Route path='/listing/:selectedType/:id' element={<Listing />} />
          <Route path='/search' element={<Search />} />
          <Route path='/BookingModule' element={<BookingModule />} />
          <Route path='/booking' element={<Booking />} />
          <Route path='/payment' element={<Payment />} />
          <Route path='/showmybookings' element={<ShowMyBookings />} />
          <Route path='/showmylisting' element={<ShowMyListing />} />
          <Route path='/booking/:id' element={<BookingDetailsPage />} />
          <Route path='/premium-subscription' element={<PremiumSubscription />} />
          <Route element={<PrivateRoute />} /> {/* Protected routes */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
