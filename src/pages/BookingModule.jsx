/* eslint-disable react/no-unescaped-entities */
import  { useState } from 'react';
import '../styleComponets/styledComponents.css';

const BookingModule = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="col module module-115">
      {/* Section 1: Mobile and Tablet View */}
      <div className="section-mobile">
        <h3>
          <span style={{ color: '#9b89b9' }}><strong>Book with </strong></span>
          <span style={{ color: '#9b89b9' }}><strong>Pet</strong></span>
          <span style={{ color: '#644b8e' }}><strong>Backer</strong></span>
        </h3>
        <div className="wrapper">
          <div className="carousel uk-visible@s slick-initialized slick-slider">
            {/* Carousel Items */}
            <div className="slick-list draggable">
              <div className="slick-track">
                {carouselItems.map((item, index) => (
                  <div
                    key={index}
                    className={`uk-card uk-card-default slick-slide ${
                      index === 0 ? 'slick-current slick-active' : 'slick-cloned'
                    }`}
                  >
                    <div className="uk-card-body">
                      <div className="book-title">
                        <p><strong>{item.title}</strong></p>
                        <p dangerouslySetInnerHTML={{ __html: item.description }} />
                        {item.additionalContent && <br />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Desktop View */}
      <div className="section-desktop">
        <h3>Book with PetBacker</h3>
        <div className="flex-row grid">
          {borderedBoxes.map((box, index) => (
            <div key={index} className="col md-one-third">
              <div className="bordered-box" style={{ marginBottom: index === 0 ? '' : 'auto' }}>
                <p>{box.title}</p>
                <p dangerouslySetInnerHTML={{ __html: box.description }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Book Now Button */}
      <div className="section-buttons">
        <a
          href="https://web.petbacker.com/services?lang=&location=www.petbacker.com&utm_medium=cms&utm_content=%2Findia%2Fboarding%2Fkerala%2Fkochi%2Fdolittle-pet-centre-home-based-pet-hotel&_ga=2.40980000.362316411.1719314926-22783058.1716285532"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            id="bookwith"
            className="btn-primary-fill btn-large"
            onClick={openModal}
          >
            Make a Request
          </button>
        </a>
      </div>

      {/* Section 4: Modal */}
      {modalOpen && (
        <div id="bookwithModal" className="modal" onClick={closeModal}>
          <div className="modalbook-content" onClick={(e) => e.stopPropagation()}>
            <span id="bookwithclose" className="close" onClick={closeModal}>
              ×
            </span>
            <h2>What's next?</h2>
            <p>More than 5 pet lovers will send you a message within minutes to a few hours with their quote and details.</p>
            <div style={{ textAlign: 'left' }}>
              <a
                href="https://web.petbacker.com/services?lang=&location=www.petbacker.com&utm_medium=cms&utm_content=%2Findia%2Fboarding%2Fkerala%2Fkochi%2Fdolittle-pet-centre-home-based-pet-hotel"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button style={{ padding: '10px 25px', borderRadius: 5, border: 'none', color: '#fff', background: '#FF8F11', margin: '10px 0', fontWeight: 'bold' }}>
                  Next
                </button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Dummy Data
const carouselItems = [
  {
    title: 'Reservation Guarantee',
    description: 'If your Pet Sitter, Walker or Groomer has to <a href="/help-center/cancellation/reservation-guarantee" tabindex="0">cancel</a> at the last minute, we’ll work with you to find a new one.',
  },
  {
    title: 'Secure Payment',
    description: 'Escrow Payment & <span style="color:#a17ddc;">Refundable</span> before job starts. Pay safely and securely on PetBacker—no tips necessary.',
  },
  {
    title: 'Free Protection',
    description: 'Pet safety is our top priority. Every stay booked through PetBacker is covered by <a href="/premium-protection-coverage" tabindex="0">premium protection.</a>',
  },
  {
    title: '24/7 Support',
    description: 'Team to support any unexpected events (e.g. sick), even <span style="color:#a17ddc;">SPOT checks</span> to ensure quality.',
  },
  {
    title: 'Top Quality',
    description: 'All bookings on PetBacker are entitled to leave a transparent <span style="color:#a17ddc;">verified review</span>.',
  },
  {
    title: 'Royalty Rewards',
    description: 'Each Spend is entitled for <span style="color:#a17ddc;">Discount</span> credits on PetBacker.',
  },
];

const borderedBoxes = [
  {
    title: 'Reservation Guarantee',
    description: 'If your Pet Sitter, Walker or Groomer has to <a href="/help-center/cancellation/reservation-guarantee">cancel</a> at the last minute, we’ll work with you to find a new one.',
  },
  {
    title: 'Secure Payment',
    description: 'Escrow Payment & <span style="color:#a17ddc;">Refundable</span> before job starts. Pay safely and securely on PetBacker—no tips necessary.',
  },
  {
    title: 'Free Protection',
    description: 'Pet safety is our top priority. Every stay booked through PetBacker is covered by <a href="/premium-protection-coverage">premium protection.</a>',
  },
  {
    title: '24/7 Support',
    description: 'Team to support any unexpected events (e.g. sick), even <span style="color:#a17ddc;">SPOT checks</span> to ensure quality.',
  },
  {
    title: 'Top Quality',
    description: 'All bookings on PetBacker are entitled to leave a transparent <span style="color:#a17ddc;">verified review</span>.',
  },
  {
    title: 'Royalty Rewards',
    description: 'Each Spend is entitled for <span style="color:#a17ddc;">Discount</span> credits on PetBacker.',
  },
];

export default BookingModule;
