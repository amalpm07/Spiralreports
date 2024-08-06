
import '../styleComponets/ServiceProviderList.css';

const petBoardingList = ({ providers }) => {
  return (
    <div className="provider-list">
      <h2>Pet Boarding Service Providers</h2>
      <ul>
        {providers.map(provider => (
          <li key={provider.id} className="provider-item">
            <h3>{provider.name}</h3>
            <p>{provider.description}</p>
            <p><strong>Location:</strong> {provider.location}</p>
            <p><strong>Contact:</strong> {provider.contact}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default petBoardingList;
