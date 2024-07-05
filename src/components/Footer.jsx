/* eslint-disable react/no-unescaped-entities */
// CompanyFooter.jsx

// eslint-disable-next-line no-unused-vars
import { MDBFooter, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import '../styleComponets/styledComponents.css';

export default function CompanyFooter() {
  return (
    <MDBFooter color='dark' className='text-center text-lg-start text-white'>
      <MDBContainer className='p-4'>
        <MDBRow>
          <MDBCol lg='4' className='mb-4 mb-md-0'>
            <h5 className='text-uppercase'>About Us</h5>
            <p>
              Welcome to Orpita Services Pvt Ltd, your go-to source for all things pet-related. We're dedicated to providing you the very best of pet care products and services, with a focus on quality, customer service, and uniqueness.
            </p>
          </MDBCol>
          {/* <MDBCol lg='4' className='mb-4 mb-md-0'>
            <h5 className='text-uppercase'>Links</h5>
            <ul className='list-unstyled mb-0'>
              <li>
                <a href='#' className='text-white'>Home</a>
              </li>
              <li>
                <a href='#' className='text-white'>About</a>
              </li>
              <li>
                <a href='#' className='text-white'>Services</a>
              </li>
              <li>
                <a href='#' className='text-white'>Contact</a>
              </li>
            </ul>
          </MDBCol> */}
          <MDBCol lg='4' className='mb-4 mb-md-0'>
            <h5 className='text-uppercase'>Contact Us</h5>
            <ul className='list-unstyled mb-0'>
              <li>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Address: No 2/619 Plot No 203, Engineers Avenue, First Main Road, Keelkattalai, Chennai
              </li>
              <li>
                <FontAwesomeIcon icon={faPhone} /> Phone: +91 73389 28378
              </li>
              <li>
                <FontAwesomeIcon icon={faEnvelope} /> Email: admin@leashbench.com
              </li>
            </ul>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        &copy; {new Date().getFullYear()} Orpita Services Pvt Ltd All rights reserved.
      </div>
    </MDBFooter>
  );
}