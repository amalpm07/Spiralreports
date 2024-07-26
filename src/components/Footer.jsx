import React from 'react';
import '../styleComponets/footer.css';
import { FaFacebook, FaTwitter, FaLinkedin, FaPinterest } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';
const Footer = () => {
    return (
        <footer className="new_footer_area bg_color">
            <div className="new_footer_top">
                <div className="container">
                    <div className="row">
                        <GetInTouch />
                        <Download />
                        <Help />
                        <TeamSolutions />
                    </div>
                </div>
                <div className="footer_bg">
                    <div className="footer_bg_one"></div>
                    <div className="footer_bg_two"></div>
                </div>
            </div>
            <div className="footer_bottom">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-sm-7">
                            <p className="mb-0 f_400">© 2024 Orpita Services Pvt Ltd All rights reserved.</p>
                        </div>
                        <div className="col-lg-6 col-sm-5 text-right">
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

const GetInTouch = () => {
  return (
    <div className="col-lg-3 col-md-6">
        <div className="f_widget company_widget wow fadeInLeft" data-wow-delay="0.2s">
            <h3 className="f-title f_600 t_color f_size_18">Contact Us</h3>
            <p>Address: No 2/619 Plot No 203, Engineers Avenue, First Main Road, Keelkattalai, Chennai</p>
            <p>Phone: +91 73389 28378</p>
            <p>Email: <a href="mailto:admin@leashbench.com">admin@leashbench.com</a></p>
            <form action="#" className="f_subscribe_two mailchimp" method="post" noValidate>
              <Link to="/contact">
              <button className="btn btn_get btn_get_two" type="submit">contact us</button></Link>
                
                <p className="mchimp-errmessage" style={{ display: 'none' }}></p>
                <p className="mchimp-sucmessage" style={{ display: 'none' }}></p>
            </form>
        </div>
    </div>
);

}

const Download = () => {
  return (
    <div className="col-lg-3 col-md-6">
        <div className="f_widget about-widget pl_70 wow fadeInLeft" data-wow-delay="0.4s">
            <h3 className="f-title f_600 t_color f_size_18">Services</h3>
            <ul className="list-unstyled f_list">
                <li><a href="#">Pet Boarding</a></li>
                <li><a href="#">Pet Grooming</a></li>
                <li><a href="#">Pet Sitting</a></li>
                <li><a href="#">Pet Taxi</a></li>
                <li><a href="#">Pet Store</a></li>
            </ul>
        </div>
    </div>
);

}

const Help = () => {
    return (
        <div className="col-lg-3 col-md-6">
            <div className="f_widget about-widget pl_70 wow fadeInLeft" data-wow-delay="0.6s">
                <h3 className="f-title f_600 t_color f_size_18">Help</h3>
                <ul className="list-unstyled f_list">
                    <li><a href="#">FAQ</a></li>
                    <li><a href="#">Term & conditions</a></li>
                    <li><a href="#">Reporting</a></li>
                    <li><a href="#">Documentation</a></li>
                    <li><a href="#">Support Policy</a></li>
                    <li><a href="#">Privacy</a></li>
                </ul>
            </div>
        </div>
    );
}

const TeamSolutions = () => {
  return (
    <div className="col-lg-3 col-md-6">
        <div className="f_widget social-widget pl_70 wow fadeInLeft" data-wow-delay="0.8s">
            <h3 className="f-title f_600 t_color f_size_18">Team Solutions</h3>
            <div className="f_social_icon">
                <a href="#" className="f_social_icon_item"><FaFacebook size={50} /></a>
                <a href="#" className="f_social_icon_item"><FaTwitter size={50} /></a>
                <a href="#" className="f_social_icon_item"><FaLinkedin size={50} /></a>
                <a href="#" className="f_social_icon_item"><FaPinterest size={50} /></a>
            </div>
        </div>
    </div>
);

}

export default Footer;
