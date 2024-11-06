/* eslint-disable react/prop-types */

const PricingCard = ({ title, price, storage, users, sendUp, onSelectPlan }) => {
  return (
    <div className="PricingCard">
      <header>
        <p className="card-title">{title}</p>
        <h1 className="card-price">${price}</h1>
      </header>
      <div className="card-features">
        <div className="card-storage">{storage}</div>
        <div className="card-users-allowed">{users} users in total</div>
        <div className="card-send-up">Send up to {sendUp} GB</div>
      </div>
      <button className="card-btn" onClick={() => onSelectPlan(title)}>
        SELECT
      </button>
     </div>
  );
};

export default PricingCard;
