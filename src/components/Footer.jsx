
import {
  MDBFooter,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBCol,
  MDBRow,
  MDBBtn
} from 'mdb-react-ui-kit';

export default function CompanyFooter() {
  return (
    <MDBFooter className='text-center text-lg-start text-muted' color='white' bgColor='dark'>
      <MDBContainer className='p-4'>
        {/* Social Media Section */}
        <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
          <div className='me-5 d-none d-lg-block'>
            <span>Connect with us on social networks:</span>
          </div>

          <div>
        <MDBBtn outline color="light" floating className='m-1' href='https://facebook.com/yourcompany' role='button'>
  <MDBIcon fab icon='facebook-f' />
</MDBBtn>

<MDBBtn outline color="light" floating className='m-1' href='https://twitter.com/yourcompany' role='button'>
  <MDBIcon fab icon='twitter' />
</MDBBtn>

<MDBBtn outline color="light" floating className='m-1' href='https://google.com/yourcompany' role='button'>
  <MDBIcon fab icon='google' />
</MDBBtn>

<MDBBtn outline color="light" floating className='m-1' href='https://instagram.com/yourcompany' role='button'>
  <MDBIcon fab icon='instagram' />
</MDBBtn>

<MDBBtn outline color="light" floating className='m-1' href='https://linkedin.com/company/yourcompany' role='button'>
  <MDBIcon fab icon='linkedin-in' />
</MDBBtn>

<MDBBtn outline color="light" floating className='m-1' href='https://github.com/yourcompany' role='button'>
  <MDBIcon fab icon='github' />
</MDBBtn>

          </div>
        </section>

        {/* Newsletter Section */}
        <section className=''>
          <form action=''>
            <MDBRow className='d-flex justify-content-center'>
              <MDBCol size="auto">
                <p className='pt-2'>
                  <strong>Sign up for our newsletter</strong>
                </p>
              </MDBCol>

              <MDBCol md='5' start>
                <MDBInput contrast type='email' label='Email address' className='mb-4' />
              </MDBCol>

              <MDBCol size="auto">
                <MDBBtn outline color='light' type='submit' className='mb-4'>
                  Subscribe
                </MDBBtn>
              </MDBCol>
            </MDBRow>
          </form>
        </section>

        {/* About Section */}
        <section className='mb-4'>
          <p>
            Welcome to [Your Company], where we strive to deliver the best products and services for our valued customers. 
            Our commitment to quality and customer satisfaction is unparalleled.
          </p>
        </section>

        {/* Links Section */}
        <section className=''>
          <MDBRow>
            <MDBCol lg='3' md='6' className='mb-4 mb-md-0'>
              <h5 className='text-uppercase'>Our Products</h5>

              <ul className='list-unstyled mb-0'>
                <li>
                  <a href='/products/product1' className='text-white'>
                    Product 1
                  </a>
                </li>
                <li>
                  <a href='/products/product2' className='text-white'>
                    Product 2
                  </a>
                </li>
                <li>
                  <a href='/products/product3' className='text-white'>
                    Product 3
                  </a>
                </li>
                <li>
                  <a href='/products/product4' className='text-white'>
                    Product 4
                  </a>
                </li>
              </ul>
            </MDBCol>

            <MDBCol lg='3' md='6' className='mb-4 mb-md-0'>
              <h5 className='text-uppercase'>Customer Support</h5>

              <ul className='list-unstyled mb-0'>
                <li>
                  <a href='/support/contact-us' className='text-white'>
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href='/support/faq' className='text-white'>
                    FAQ
                  </a>
                </li>
                <li>
                  <a href='/support/shipping-info' className='text-white'>
                    Shipping Information
                  </a>
                </li>
                <li>
                  <a href='/support/return-policy' className='text-white'>
                    Return Policy
                  </a>
                </li>
              </ul>
            </MDBCol>

            <MDBCol lg='3' md='6' className='mb-4 mb-md-0'>
              <h5 className='text-uppercase'>About Us</h5>

              <ul className='list-unstyled mb-0'>
                <li>
                  <a href='/about/company' className='text-white'>
                    Company Information
                  </a>
                </li>
                <li>
                  <a href='/about/team' className='text-white'>
                    Our Team
                  </a>
                </li>
                <li>
                  <a href='/about/careers' className='text-white'>
                    Careers
                  </a>
                </li>
                <li>
                  <a href='/about/privacy-policy' className='text-white'>
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </MDBCol>

            <MDBCol lg='3' md='6' className='mb-4 mb-md-0'>
              <h5 className='text-uppercase'>Follow Us</h5>

              <ul className='list-unstyled mb-0'>
                <li>
                  <a href='https://facebook.com/yourcompany' className='text-white'>
                    Facebook
                  </a>
                </li>
                <li>
                  <a href='https://twitter.com/yourcompany' className='text-white'>
                    Twitter
                  </a>
                </li>
                <li>
                  <a href='https://instagram.com/yourcompany' className='text-white'>
                    Instagram
                  </a>
                </li>
                <li>
                  <a href='https://linkedin.com/company/yourcompany' className='text-white'>
                    LinkedIn
                  </a>
                </li>
              </ul>
            </MDBCol>
          </MDBRow>
        </section>
      </MDBContainer>

      {/* Footer Bottom */}
      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © {new Date().getFullYear()} [Your Company]. All Rights Reserved.
        <a className='text-white' href='https://yourcompany.com/'>
          yourcompany.com
        </a>
      </div>
    </MDBFooter>
  );
}
