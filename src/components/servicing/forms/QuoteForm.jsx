import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Sample data for bike manufacturers
const manufacturers = [
  { id: 'honda', name: 'Honda', logo: '/images/manufacturer/honda.png' },
  { id: 'yamaha', name: 'Yamaha', logo: '/images/manufacturer/yamaha.png' },
  { id: 'bajaj', name: 'Bajaj', logo: '/images/manufacturer/bajaj.png' },
  { id: 'tvs', name: 'TVS', logo: '/images/manufacturer/tvs.png' },
  { id: 'royalEnfield', name: 'Royal Enfield', logo: '/images/manufacturer/royal-enfield.png' },
  { id: 'suzuki', name: 'Suzuki', logo: '/images/manufacturer/suzuki.png' },
  { id: 'ktm', name: 'KTM', logo: '/images/manufacturer/ktm.png' },
  { id: 'hero', name: 'Hero', logo: '/images/manufacturer/hero.png' },
  { id: 'jawa', name: 'Jawa', logo: '/images/manufacturer/jawa.png' }
];

// Sample data for bike models by manufacturer
const bikeModels = {
  honda: [
    { id: 'activa', name: 'activa', image: '/images/bikeModels/honda/activa.png' },
    { id: 'shine', name: 'shine', image: '/images/bikeModels/honda/shine.png' },
    { id: 'unicorn', name: 'unicorn', image: '/images/bikeModels/honda/unicorn.png' },
    { id: 'hornet', name: 'hornet', image: '/images/bikeModels/honda/hornet.png' },
    { id: 'dio', name: 'dio', image: '/images/bikeModels/honda/dio.png' },
    { id: 'cb350', name: 'cb350', image: '/images/bikeModels/honda/cb350.png' },
    { id: 'sp160', name: 'sp160', image: '/images/bikeModels/honda/sp160.png' },
    { id: 'activaE', name: 'activaE', image: '/images/bikeModels/honda/activaE.png' }
  ],
  yamaha: [
    { id: 'r15', name: 'r15', image: '/images/bikeModels/yamaha/r15.png' },
    { id: 'fz', name: 'fz', image: '/images/bikeModels/yamaha/fz.png' },
    { id: 'mt15', name: 'mt15', image: '/images/bikeModels/yamaha/mt15.png' },
    { id: 'fascino', name: 'fascino', image: '/images/bikeModels/yamaha/fascino.png' },
    { id: 'ray', name: 'ray', image: '/images/bikeModels/yamaha/ray.png' },
    { id: 'r3', name: 'r3', image: '/images/bikeModels/yamaha/r3.png' }
  ],
  bajaj: [
    { id: 'chetak', name: 'chetak', image: '/images/bikeModels/yamaha/r15.png' },
    { id: 'platina110', name: 'platina110', image: '/images/bikeModels/yamaha/fz.png' },
    { id: 'pulsar125', name: 'pulsar125', image: '/images/bikeModels/yamaha/mt15.png' },
    { id: 'pulsar150', name: 'pulsar150', image: '/images/bikeModels/yamaha/fascino.png' },
    { id: 'pulsarN160', name: 'pulsarN160', image: '/images/bikeModels/yamaha/ray.png' },
    { id: 'pulsarNs200', name: 'pulsarNs200', image: '/images/bikeModels/yamaha/r3.png' }
  ],
  tvs: [
    { id: 'apache160', name: 'apache160', image: '/images/bikeModels/tvs/apache160.png' },
    { id: 'apache200', name: 'apache200', image: '/images/bikeModels/tvs/apache200.png' },
    { id: 'iqube', name: 'iqube', image: '/images/bikeModels/tvs/iqube.png' },
    { id: 'jupiter', name: 'jupiter', image: '/images/bikeModels/tvs/jupiter.png' },
    { id: 'ntorq', name: 'ntorq', image: '/images/bikeModels/tvs/ntorq.png' },
    { id: 'raider125', name: 'raider125', image: '/images/bikeModels/tvs/raider125.png' },
    { id: 'ronin', name: 'ronin', image: '/images/bikeModels/tvs/ronin.png' },
    { id: 'sport', name: 'sport', image: '/images/bikeModels/tvs/sport.png' },
    { id: 'zest', name: 'zest', image: '/images/bikeModels/tvs/zest.png' }
  ],
  royalEnfield : [
    { id: 'bullet350', name: 'bullet350', image: '/images/bikeModels/royalEnfield/bullet350.png' },
    { id: 'classic350', name: 'classic350', image: '/images/bikeModels/royalEnfield/classic350.png' },
    { id: 'classic650', name: 'classic650', image: '/images/bikeModels/royalEnfield/classic650.png' },
    { id: 'continentalGt', name: 'continentalGt', image: '/images/bikeModels/royalEnfield/continentalGt.png' },
    { id: 'guerrilla450', name: 'guerrilla450', image: '/images/bikeModels/royalEnfield/guerrilla450.png' },
    { id: 'himalayan', name: 'himalayan', image: '/images/bikeModels/royalEnfield/himalayan.png' },
    { id: 'hunter350', name: 'hunter350', image: '/images/bikeModels/royalEnfield/hunter350.png' },
    { id: 'interceptor', name: 'interceptor', image: '/images/bikeModels/royalEnfield/interceptor.png' },
    { id: 'meteor350', name: 'meteor350', image: '/images/bikeModels/royalEnfield/meteor350.png' },
    { id: 'scram440', name: 'scram440', image: '/images/bikeModels/royalEnfield/scram440.png' }
  ],
  suzuki : [
    { id: 'access', name: 'access', image: '/images/bikeModels/suzuki/access.png' },
    { id: 'burgman', name: 'burgman', image: '/images/bikeModels/suzuki/burgman.png' },
    { id: 'gixxer', name: 'gixxer', image: '/images/bikeModels/suzuki/gixxer.png' },
  ],
  ktm : [
    { id: 'duke200', name: 'duke200', image: '/images/bikeModels/ktm/duke200.png' },
    { id: 'duke250', name: 'duke250', image: '/images/bikeModels/ktm/duke250.png' },
    { id: 'rc200', name: 'rc200', image: '/images/bikeModels/ktm/rc200.png' },
  ],
  hero: [
    { id: 'hfDeluxe', name: 'hfDeluxe', image: '/images/bikeModels/hero/hfDeluxe.png' },
    { id: 'mavrick440', name: 'mavrick440', image: '/images/bikeModels/hero/mavrick440.png' },
    { id: 'pleasure', name: 'pleasure', image: '/images/bikeModels/hero/pleasure.png' },
    { id: 'splendorPlus', name: 'splendorPlus', image: '/images/bikeModels/hero/splendorPlus.png' },
    { id: 'xoom125', name: 'xoom125', image: '/images/bikeModels/hero/xoom125.png' },
    { id: 'xpulse210', name: 'xpulse210', image: '/images/bikeModels/hero/xpulse210.png' },
    { id: 'xtreme125r', name: 'xtreme125r', image: '/images/bikeModels/hero/xtreme125r.png' }
   ],
   jawa : [
    { id: 'bobber42', name: 'bobber42', image: '/images/bikeModels/jawa/bobber42.png' },
    { id: 'fj42', name: 'fj42', image: '/images/bikeModels/jawa/fj42.png' },
    { id: 'jawa350', name: 'jawa350', image: '/images/bikeModels/jawa/jawa350.png' },    
    { id: 'perak', name: 'perak', image: '/images/bikeModels/jawa/perak.png' },
  ],
};

// Sample data for bike models (for any manufacturer not defined above)
const defaultBikeModels = [
  { id: 'model1', name: 'Model 1', image: '' },
  { id: 'model2', name: 'Model 2', image: '' },
  { id: 'model3', name: 'Model 3', image: '' },
  { id: 'model4', name: 'Model 4', image: '' },
  { id: 'model5', name: 'Model 5', image: '' },
  { id: 'model6', name: 'Model 6', image: '' }
];

// Sample data for fuel types
const fuelTypes = [
  { id: 'petrol', name: 'Petrol', icon: '/images/fuelTypes/petrol.png' },
  { id: 'cng', name: 'CNG', icon: '/images/fuelTypes/cng.png' },
  { id: 'electric', name: 'Electric', icon: '/images/fuelTypes/electric.png' }
];

export default function QuoteForm() {
  const [formData, setFormData] = useState({
    location: 'PUNE',
    bikeSelection: '',
    mobile: '',
    storeCity: '',
    storeLocation: ''
  });
  
  const [activeModal, setActiveModal] = useState(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedFuel, setSelectedFuel] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBikeInputFocus = () => {
    setActiveModal('manufacturer');
  };

  const handleManufacturerSelect = (manufacturer) => {
    setSelectedManufacturer(manufacturer);
    setActiveModal('model');
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setActiveModal('fuel');
  };

  const handleFuelSelect = (fuel) => {
    setSelectedFuel(fuel);
    const bikeSelection = `${selectedManufacturer.name} ${selectedModel.name}, ${fuel.name}`;
    setFormData({ ...formData, bikeSelection });
    setActiveModal(null);
  };

  const handleBackToManufacturer = () => {
    setActiveModal('manufacturer');
  };

  const handleBackToModel = () => {
    setActiveModal('model');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  const getModels = (manufacturerId) => {
    return bikeModels[manufacturerId] || defaultBikeModels;
  };

  // navigating through button 
  const navigate = useNavigate();
  const handleCheckPrices = () => {
    if (selectedManufacturer && selectedModel && selectedFuel && formData.storeLocation) {
      const bikeData = {
        manufacturer: selectedManufacturer.name,
        model: selectedModel.name,
        fuelType: selectedFuel.name,
        image: selectedModel.image,
        manufacturerLogo: selectedManufacturer.logo,
        storeLocation: formData.storeLocation  // Add store location to bikeData
      };

      navigate('/service-packages', { 
        state: { 
          bikeData,
          storeLocation: formData.storeLocation  // Pass store location separately
        }
      });
    } else {
      alert('Please complete all fields before checking services');
    }
  };

  // Modal content components that will replace the form content
  const ManufacturerSelection = () => (
    <div className="bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Select Manufacturer</h2>
        <button 
          onClick={handleCloseModal}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Brands"
            className="w-full p-2 pl-8 border border-gray-300 rounded"
          />
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {manufacturers.map((manufacturer) => (
          <div 
            key={manufacturer.id}
            onClick={() => handleManufacturerSelect(manufacturer)}
            className="flex flex-col items-center p-2 cursor-pointer border border-gray-100 rounded hover:border-gray-300"
          >
            <img src={manufacturer.logo} alt={manufacturer.name} className="mb-1 h-10 object-contain" />
            <span className="text-center text-xs">{manufacturer.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const ModelSelection = () => (
    <div className="bg-white p-4">
      <div className="flex items-center mb-4">
        <button 
          onClick={handleBackToManufacturer}
          className="mr-2 text-gray-600"
          aria-label="Back"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold">Select Model</h2>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Models"
            className="w-full p-2 pl-8 border border-gray-300 rounded"
          />
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {selectedManufacturer && getModels(selectedManufacturer.id).map((model) => (
          <div 
            key={model.id}
            onClick={() => handleModelSelect(model)}
            className="flex flex-col items-center p-2 cursor-pointer"
          >
            <img src={model.image} alt={model.name} className="mb-1 h-16 object-contain" />
            <span className="text-center text-xs">{model.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const FuelTypeSelection = () => (
    <div className="bg-white p-4">
      <div className="flex items-center mb-4">
        <button 
          onClick={handleBackToModel}
          className="mr-2 text-gray-600"
          aria-label="Back"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold">Select Fuel Type</h2>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Fuel Type"
            className="w-full p-2 pl-8 border border-gray-300 rounded"
          />
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {fuelTypes.map((fuel) => (
          <div 
            key={fuel.id}
            onClick={() => handleFuelSelect(fuel)}
            className="flex flex-col items-center p-2 cursor-pointer"
          >
            <img src={fuel.icon} alt={fuel.name} className="mb-1 h-12 object-contain" />
            <span className="text-center text-xs">{fuel.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Determine what content to show
  const renderContent = () => {
    if (activeModal === 'manufacturer') {
      return <ManufacturerSelection />;
    } else if (activeModal === 'model') {
      return <ModelSelection />;
    } else if (activeModal === 'fuel') {
      return <FuelTypeSelection />;
    } else {
      // Default form content
      return (
        <>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Experience The Best Bike Services In Pune</h2>
      <p className="mb-6 text-gray-600">Get instant quotes for your bike service</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* City Selection */}
        <div className="relative">
          <select
            name="storeCity"
            value={formData.storeCity}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 border border-gray-300 text-gray-800 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-primary uppercase"
          >
            <option value="">Select Your City</option>
            <option value="PUNE">Pune</option>
            <option value="MUMBAI">Mumbai</option>
            <option value="SATARA">Satara</option>
            <option value="KOLHAPUR">Kolhapur</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
          {/* Store Location Selection */}
        <div className="relative">
          <select
            name="storeLocation"
            value={formData.storeLocation}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 border border-gray-300 text-gray-800 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-primary uppercase"
            disabled={!formData.storeCity}
          >
            <option value="">Select Your Store</option>
            {formData.storeCity === 'PUNE' && (
              <>
                <option value="WAKAD">Wakad</option>
                <option value="HINJEWADI">Hinjewadi</option>
                <option value="KOTHRUD">Kothrud</option>
                <option value="KATRAJ">Katraj</option>
                <option value="BAVDHAN">Bavdhan</option>
              </>
            )}
              </select>
              
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Select your bike */}
            <div className="relative">
              <input
                type="text"
                name="bikeSelection"
                value={formData.bikeSelection}
                onChange={handleChange}
                onFocus={handleBikeInputFocus}
                placeholder="SELECT YOUR BIKE"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                readOnly
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            <button 
              type="button"
              className="w-full p-3 bg-indigo-900 text-white font-medium rounded-md hover:bg-indigo-600 transition-colors duration-200" 
              onClick={handleCheckPrices}
              disabled={!formData.bikeSelection}
            >
              CHECK SERVICES
            </button>
          </form>
        </>
      );
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      {renderContent()}
    </div>
  );
}