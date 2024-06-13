// CompanyFooter.jsx


// eslint-disable-next-line no-unused-vars
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon, MDBBtn, MDBInput } from 'mdb-react-ui-kit';
import '../styleComponets/styledComponents.css';

export default function CompanyFooter() {
  return (
    <MDBFooter color='dark' className='text-center text-lg-start text-white'>
      <MDBContainer className='p-4'>
        <MDBRow>
          <MDBCol lg='4' className='mb-4 mb-md-0'>
            <h5 className='text-uppercase'>About Us</h5>
            <p>
              [Your company description goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit.]
            </p>
          </MDBCol>
          <MDBCol lg='4' className='mb-4 mb-md-0'>
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
          </MDBCol>
          <MDBCol lg='4' className='mb-4 mb-md-0'>
            <h5 className='text-uppercase'>Contact Us</h5>
            <ul className='list-unstyled mb-0'>
              <li>
                <MDBIcon icon='map-marker-alt' /> Address: 123 Company St, City, Country
              </li>
              <li>
                <MDBIcon icon='phone' /> Phone: +123 456 7890
              </li>
              <li>
                <MDBIcon icon='envelope' /> Email: info@example.com
              </li>
            </ul>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
      </div>
    </MDBFooter>
  );
}
