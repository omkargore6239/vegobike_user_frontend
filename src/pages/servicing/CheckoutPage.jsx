import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BikeDetailsComponent from './BikeDetailsComponent';
import useScrollPosition from '../../hooks/useScrollPosition';

// Create the SelectedStoreDisplay component inline
const SelectedStoreDisplay = ({ selectedStore, onStoreChange }) => {
  // Mock service center locations - replace with your actual locations
  const serviceLocations = [
    "Hinjewadi",
    "Kharadi",
    "Hadapsar",
    "Baner",
    "Viman Nagar",
    "Kothrud"
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-indigo-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <div>
          <p className="font-medium">Service Center Location</p>
          <p className="text-gray-500 text-sm">Please verify or change your preferred location</p>
        </div>
      </div>

      <div className="relative">
        <select
          value={selectedStore}
          onChange={(e) => onStoreChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-600 appearance-none text-indigo-700 font-medium"
        >
          {serviceLocations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

const RegistrationPopup = ({ onClose, phoneNumber, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: phoneNumber || '',
    alternativePhoneNumber: '',
    address: {
      street: ''
    },
    profileImage: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  // Fixed handleChange function
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profileImage: file
      });

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone Number must be 10 digits';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid Email Address';
    }

    if (formData.alternativePhoneNumber && !/^\d{10}$/.test(formData.alternativePhoneNumber)) {
      newErrors.alternativePhoneNumber = 'Alternative Phone Number must be 10 digits';
    }

    if (!formData.address.street.trim()) {
      newErrors.street = 'Street Address is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form submitted:', formData);
      // Call the parent's onSubmit function
      onSubmit(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Create an Account</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 mb-2 flex items-center justify-center overflow-hidden">
              {previewImage ? (
                <img src={previewImage} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <label className="cursor-pointer bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-sm hover:bg-indigo-100 transition-colors">
              Upload Profile Picture
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Personal Information */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>

          <div>
            <label htmlFor="alternativePhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Alternative Phone Number
            </label>
            <input
              type="tel"
              id="alternativePhoneNumber"
              name="alternativePhoneNumber"
              value={formData.alternativePhoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.alternativePhoneNumber && <p className="text-red-500 text-sm mt-1">{errors.alternativePhoneNumber}</p>}
          </div>

          {/* Address Section */}
          <div className="pt-2">
            <h4 className="font-medium text-gray-700 mb-3">Address Information</h4>

            <div className="space-y-3">
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  id="street"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-600 transition-colors mt-6"
        >
          REGISTER & CONTINUE
        </button>
      </div>
    </div>
  );
};

// OrderConfirmationPopup
const OrderConfirmationPopup = ({ onClose, orderDetails }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Order Confirmation</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Thank you for your order!</h2>
          <p className="text-gray-600">Your order has been placed successfully</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Order ID:</span>
              <span className="text-indigo-700">#VEGO{Date.now()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Estimated Service Time:</span>
              <span className="text-indigo-700">{orderDetails.selectedTimeSlot}</span>
            </div>
          </div>

          <div className="bg-white border border-indigo-100 rounded-lg p-4">
            <h4 className="font-medium mb-2">Selected Services:</h4>
            <ul className="list-disc pl-4">
              {orderDetails.cartItems.map(item => (
                <li key={item.id} className="text-gray-600">{item.name}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-indigo-100 rounded-lg p-4">
            <h4 className="font-medium mb-2">Service Details:</h4>
            <p className="text-gray-600">
              {orderDetails.bikeDetails.manufacturer} {orderDetails.bikeDetails.model}<br />
              Service Location: {orderDetails.selectedStore}<br />
              Service Date: {orderDetails.selectedDate} {/* You can enhance weekday display if needed */}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-indigo-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-600 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollPosition = useScrollPosition(); // Custom hook to track scroll position
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [step, setStep] = useState(1); // 1: Date & Time, 2: Account, 3: Bike Details, 4: Payment
  const [selectedStore, setSelectedStore] = useState("Hinjewadi");
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [showDateAndTime, setShowDateAndTime] = useState(false); // New state for Date and Time visibility

  // Add state for bike details
  const [bikeDetailsData, setBikeDetailsData] = useState(null);

  // Create refs for each step section
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);

  // Payment handler
  const handlePayment = () => {
    setShowOrderConfirmation(true);
  };

  // Account related states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mock database of existing users
  const existingUsers = ["8356089789", "9324678787","9876543210", "9123456780"];

  // Handler for store location change
  const handleStoreChange = (store) => {
    setSelectedStore(store);
  };

  // Get cart data from navigation state
  const [cartItems, setCartItems] = useState([]);
  const [bikeData, setBikeData] = useState({
    manufacturer: '',
    model: '',
    fuelType: '',
    image: 'https://via.placeholder.com/120x80'
  });

    // Calculate subtotal
    const [subtotal, setSubtotal] = useState(0);
    const safetyFee = subtotal * 0.1; // 10% of subtotal
    const total = subtotal + safetyFee;
  
  // Update subtotal when cart changes
  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => sum + item.discountedPrice, 0);
    setSubtotal(newSubtotal);
  }, [cartItems]);

  // Handle bike details submission
  const handleBikeDetailsSubmit = (data) => {
    console.log('Bike details submitted:', data);
    setBikeDetailsData(data);
    // Move to the payment step
    setStep(4);
    // After state update, scroll to the payment section
    setTimeout(() => {
      if (step4Ref.current) {
        step4Ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle back button click in bike details
  const handleBackClick = () => {
    // Navigate back to the account step
    setStep(2);
    // After state update, scroll to the account section
    setTimeout(() => {
      if (step2Ref.current) {
        step2Ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  useEffect(() => {
    // Check if data was passed via navigation
    window.scrollTo(0,0);
    if (location.state) {
      const { cartItems, bikeData, store } = location.state;

      if (cartItems) setCartItems(cartItems);
      if (bikeData) setBikeData(bikeData);
      if (store) setSelectedStore(store);
    } else {
      // If no data was passed, redirect back to service packages page
      alert('No items in cart. Redirecting to services page.');
      navigate('/services');
    }
  }, [location, navigate]);

  // Mock data for dates (can be replaced with actual API data)
  const dates = [
    { day: 29, weekday: 'TUE' },
    { day: 30, weekday: 'WED' },
    { day: 1, weekday: 'THU' },
    { day: 2, weekday: 'FRI' },
    { day: 3, weekday: 'SAT' }
  ];

  // Mock data for time slots
  const timeSlots = {
    morningSlots: [
      { time: '10 - 11AM', available: true },
      { time: '11 - 12PM', available: true },
      { time: '12 - 1PM', available: true },
      { time: '1 - 2PM', available: true },
      { time: '4 - 5PM', available: true },
      { time: '5 - 6PM', available: true },
      { time: '6 - 7PM', available: true },
      { time: '7 - 8PM', available: true },
    ],
  };

  // Handler for date selection
  const handleDateSelect = (day) => {
    setSelectedDate(day);
  };

  // Handler for time slot selection
  const handleTimeSlotSelect = (time) => {
    setSelectedTimeSlot(time);
  };

  // Handler for continue button
  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
      // After state update, scroll to the account section
      setTimeout(() => {
        if (step2Ref.current) {
          step2Ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else if (step === 2) {
      setStep(3);
      // After state update, scroll to the bike details section
      setTimeout(() => {
        if (step3Ref.current) {
          step3Ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  // Handler for account verification
  const checkAccount = () => {
    // Check if phone number exists in the database
    if (existingUsers.includes(phoneNumber)) {
      // Phone number exists, proceed to bike details step
      setIsLoggedIn(true);
      setStep(3);
      // After state update, scroll to the bike details section
      setTimeout(() => {
        if (step3Ref.current) {
          step3Ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Phone number doesn't exist, show registration popup
      setShowRegistrationPopup(true);
    }
  };

  // Handler for registration form submission
  const handleRegistration = (e) => {
    e.preventDefault();
    // In a real app, you would save the new user data to your database
    // For demo purposes, just close popup and proceed to bike details
    setShowRegistrationPopup(false);
    setIsLoggedIn(true);
    setStep(3); // Proceed to bike details step
    // After state update, scroll to the bike details section
    setTimeout(() => {
      if (step3Ref.current) {
        step3Ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

   // Handle remove item from cart
  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    
    // Update subtotal
    const newSubtotal = updatedCart.reduce((sum, item) => sum + item.discountedPrice, 0);
    setSubtotal(newSubtotal);

    if (updatedCart.length === 0) {
      alert('Cart is empty. Redirecting to services page.');
      navigate('/services');
    }
  };

  // Progress bar calculation - 25% per step
  const progressWidth = `${(step / 4) * 100}%`;

  // Handler for continue button in service location selection
  const handleContinueFromLocationSelection = () => {
    setShowDateAndTime(true); // Show the Date and Time section
    handleContinue(); // Proceed to the next step
  };

  // Define serviceType, serviceCenter, address, and doorstepCharge
  const [serviceType, setServiceType] = useState('center');
  const serviceCenters = [
    "Hinjewadi",
    "Kharadi",
    "Hadapsar",
    "Baner",
    "Viman Nagar",
    "Kothrud"
  ];
  const [address, setAddress] = useState({
    flatNo: '',
    area: '',
    landmark: '',
    pincode: '',
    city: ''
  });
  const doorstepCharge = 100; // Example charge

  // Handler for address change
  const handleAddressChange = (key, value) => {
    setAddress(prevAddress => ({
      ...prevAddress,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-red">
      {/* Scroll progress bar */}
      <div className="h-1 bg-primary/20 fixed top-0 left-0 right-0 z-60">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{
            width: `${Math.min(
              (scrollPosition / (document.body.scrollHeight - window.innerHeight)) * 100,
              100
            )}%`
          }}
        />
      </div>

     {/* Header */}
     <div className="bg-gray-200 py-3 px-4 shadow-sm">
        <div className="container mx-auto flex items-center gap-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-indigo-700" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <h1 className="text-xl font-semibold">Secure Checkout</h1>
        </div>
      </div>
      <div className="flex-grow flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10 responsive-padding mt-1">
        {/* Main content area */}
        <main className="flex-grow md:w-2/3 overflow-y-auto order-2 md:order-1">
          <div className="max-w-3xl mx-auto">
            <div className="container mx-auto py-4 px-4">
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= stepNumber ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {stepNumber}
                    </div>
                    <span className="text-xs mt-1">
                      {stepNumber === 1 ? 'Location' :
                      stepNumber === 2 ? 'Account' :
                      stepNumber === 3 ? 'Bike Details' : 'Payment'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="relative mt-2">
                <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
                <div
                  className="absolute top-0 left-0 h-1 bg-indigo-700 transition-all"
                  style={{ width: progressWidth }}
                ></div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Step 0: Service Location Selection */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Service Location:</h2>

                <div className="mb-6">
                  <div className="flex gap-4 mb-4">
                    <div
                      className={`flex-1 p-4 border rounded-lg cursor-pointer ${serviceType === 'center' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      onClick={() => setServiceType('center')}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border ${serviceType === 'center' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                          {serviceType === 'center' && <div className="w-2 h-2 rounded-full bg-white mx-auto mt-0.5"></div>}
                        </div>
                        <span className="font-medium">Service Center Location</span>
                      </div>
                      <p className="text-gray-500 mt-2 text-sm pl-6">Visit our service center at your convenience</p>
                    </div>

                    <div
                      className={`flex-1 p-4 border rounded-lg cursor-pointer ${serviceType === 'doorstep' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      onClick={() => setServiceType('doorstep')}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border ${serviceType === 'doorstep' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                          {serviceType === 'doorstep' && <div className="w-2 h-2 rounded-full bg-white mx-auto mt-0.5"></div>}
                        </div>
                        <span className="font-medium">Doorstep Service</span>
                      </div>
                      <p className="text-gray-500 mt-2 text-sm pl-6">We come to you (+₹{doorstepCharge} service charge)</p>
                    </div>
                  </div>

                  {serviceType === 'center' ? (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Center</label>
                      <div className="relative">
                        <select
                          className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          value={selectedStore}
                          onChange={(e) => handleStoreChange(e.target.value)}
                        >
                          {serviceCenters.map((center) => (
                            <option key={center} value={center}>
                              {center}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg mt-4">
                      <h3 className="font-medium text-gray-800 mb-3">Delivery Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Flat/House No.</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter flat or house number"
                            value={address.flatNo}
                            onChange={(e) => handleAddressChange('flatNo', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Area/Street</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter area or street"
                            value={address.area}
                            onChange={(e) => handleAddressChange('area', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter nearby landmark"
                            value={address.landmark}
                            onChange={(e) => handleAddressChange('landmark', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter pincode"
                            value={address.pincode}
                            onChange={(e) => handleAddressChange('pincode', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter city"
                            value={address.city}
                            onChange={(e) => handleAddressChange('city', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Doorstep Service Charge</span>
                          <span className="font-medium">₹{doorstepCharge}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium transition-colors"
                    onClick={handleContinueFromLocationSelection}
                  >
                    Continue
                  </button>
                </div>
              </div>

              {/* Step 1: Date and Time Selection */}
              {showDateAndTime && (
                <div className="pt-6 border-t border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Date and Time of Service:</h2>

                  {/* Date Selection */}
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-700 mb-2">Date</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {dates.map((date) => (
                        <div
                          key={date.day}
                          onClick={() => handleDateSelect(date.day)}
                          className={`min-w-[70px] h-[70px] flex flex-col items-center justify-center rounded-lg border ${
                            selectedDate === date.day
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-500'
                              : 'bg-white border-gray-200 text-gray-700'
                          } cursor-pointer`}
                        >
                          <span className="text-lg font-medium">{date.day}</span>
                          <span className="text-sm">{date.weekday}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Time Slot Selection */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-2">Time Slot (8 slots available)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {timeSlots.morningSlots.map((slot) => (
                        <div
                          key={slot.time}
                          onClick={() => handleTimeSlotSelect(slot.time)}
                          className={`py-3 text-center rounded-lg border ${
                            selectedTimeSlot === slot.time
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-500'
                              : 'bg-white border-gray-200 text-gray-700'
                          } cursor-pointer`}
                        >
                          {slot.time}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Account Login/Registration */}
              {step >= 2 && (
                <div
                  ref={step2Ref}
                  className={`bg-white rounded-lg shadow-sm p-6 mb-6 ${step === 2 ? 'border-l-4 border-indigo-700' : ''}`}
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Account</h2>

                  {!isLoggedIn ? (
                    <div className="mb-6">
                      <p className="mb-2">To place an order, log in to your existing account or sign up.</p>

                      <div className="flex flex-col md:flex-row gap-4 mt-4">
                        <div className="flex-1">
                          <div className="relative">
                            <div className="flex items-center border border-indigo-700 rounded-lg overflow-hidden">
                              <div className="px-3 py-2 bg-gray-100 border-r border-gray-300 flex items-center">
                                <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" alt="India flag" className="w-6 h-4 mr-1" />
                                <span className="text-gray-700">+91</span>
                              </div>
                              <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Phone number"
                                className="flex-1 px-4 py-2 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={checkAccount}
                          disabled={!phoneNumber || phoneNumber.length < 10}
                          className="bg-indigo-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          CONTINUE
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">User</p>
                          <p className="text-gray-600">+91 {phoneNumber}</p>
                        </div>
                      </div>

                      <button
                        onClick={handleContinue}
                        className="bg-indigo-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-600 transition-colors"
                      >
                        CONTINUE
                      </button>
                    </div>
                  )}

                  {/* Registration Popup */}
                  {showRegistrationPopup && (
                    <RegistrationPopup
                      onClose={() => setShowRegistrationPopup(false)}
                      phoneNumber={phoneNumber}
                      onSubmit={handleRegistration}
                    />
                  )}
                </div>
              )}

              {/* Step 3: Bike Details */}
              {step >= 3 && (
                <div
                  ref={step3Ref}
                  className={`${step === 3 ? 'border-l-4 border-indigo-700' : ''}`}
                >
                  <BikeDetailsComponent
                    bikeData={bikeData}
                    onSubmit={handleBikeDetailsSubmit}
                    onBack={handleBackClick}
                  />
                </div>
              )}

              {/* Step 4: Payment */}
              {step >= 4 && (
                <div ref={step4Ref} className={`bg-white rounded-lg shadow-sm p-6 mb-6 ${step === 4 ? 'border-l-4 border-indigo-700' : ''}`}>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment</h2>

                  {/* Payment methods */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" id="cod" checked />
                        <label htmlFor="cod" className="font-medium">Cash on Delivery</label>
                      </div>
                    </div>
                  </div>

                  {/* Pay Now Button */}
                  <button
                    onClick={handlePayment}
                    className="bg-indigo-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-600 transition-colors w-full mt-6"
                  >
                    PAY NOW
                  </button>
                </div>
              )}

              {/* Order Confirmation Popup */}
              {showOrderConfirmation && (
                <OrderConfirmationPopup
                  onClose={() => {
                    setShowOrderConfirmation(false);
                    navigate('/'); // after closing, redirect to home
                  }}
                  orderDetails={{
                    cartItems,
                    selectedStore,
                    selectedDate,
                    selectedTimeSlot,
                    bikeDetails: bikeDetailsData?.selectedBike || bikeData
                  }}
                />
              )}
            </div>
          </div>
        </main>

        {/* Right Column - Cart Details */}
        <div className="w-full md:w-1/3 order-1 md:order-2 ">
          {/* Bike Details Card */}
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-indigo-700 mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{bikeData.manufacturer} {bikeData.model}</h3>
                <p className="text-sm text-indigo-600">{bikeData.fuelType}</p>
              </div>
              <img
                src={bikeData.image}
                alt={`${bikeData.manufacturer} ${bikeData.model}`}
                className="w-24 h-auto rounded-lg border border-gray-200 p-1"
              />
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-indigo-700 relative overflow-hidden">
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-700 transform rotate-45 translate-x-8 -translate-y-8"></div>

            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
            </div>

            {/* Cart Items */}
            <div className="bg-indigo-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-indigo-700 mb-2 font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Items in your cart
              </div>

              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white border border-indigo-100 rounded-lg p-4 flex justify-between items-start shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div>
                      <h3 className="font-medium text-indigo-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Basic parts included</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-gray-500 line-through">₹{item.originalPrice}</p>
                        <p className="font-semibold text-indigo-700">₹ {item.discountedPrice}</p>
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          {/* Bill Details */}
<div className="bg-white rounded-lg border border-indigo-100 p-5">
  <h3 className="font-bold text-lg mb-4 text-indigo-900 flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    Bill Details
  </h3>
  <div className="space-y-3 mb-4">
    <div className="flex justify-between items-center">
      <span className="text-gray-600">Item Total</span>
      <span className="font-medium">₹ {subtotal}</span>
    </div>
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <span className="text-gray-600">Safety & Warranty Fees</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 ml-1 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor" title="Protection against damages">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      {/* Dynamic safety fee calculation */}
      <span className="font-medium">₹ {(subtotal * 0.1).toFixed(2)}</span>
    </div>
  </div>
  <div className="border-t-2 border-indigo-100 pt-4">
    <div className="flex justify-between items-center font-bold">
      <span className="text-indigo-900">You Pay</span>
      <span className="text-xl text-indigo-900">₹ {total}</span>
    </div>
    <p className="text-xs text-gray-500 mt-2 text-right">Inclusive of all taxes</p>
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
