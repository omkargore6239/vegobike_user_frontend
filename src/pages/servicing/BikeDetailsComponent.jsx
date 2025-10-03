import { useState, useEffect } from "react";

const BikeDetailsComponent = ({ bikeData, onSubmit, onBack }) => {
  // Initial bike in dropdown is the current bike from bikeData
  const [userBikes, setUserBikes] = useState([
    {
      id: "1",
      manufacturer: bikeData.manufacturer,
      model: bikeData.model,
      registrationNumber: "",
      odometer: "",
      lastServiceDate: "",
      fuelType: bikeData.fuelType,
      image: bikeData.image,
    },
  ]);

  const [selectedBikeId, setSelectedBikeId] = useState("1");
  const [showAddNewBike, setShowAddNewBike] = useState(false);
  const [getNotifications, setGetNotifications] = useState(true);

  // Form for adding new bike
  const [newBike, setNewBike] = useState({
    manufacturer: "",
    model: "",
    registrationNumber: "",
    odometer: "",
    lastServiceDate: "",
    fuelType: "Petrol",
    image: "https://via.placeholder.com/120x80",
  });

  // Selected bike details form
  const [bikeDetails, setBikeDetails] = useState({
    registrationNumber: "",
    odometer: "",
    lastServiceDate: "",
    getNotifications: true,
  });

  // Update form when selected bike changes
  useEffect(() => {
    window.scrollTo(0, 0);
    const selectedBike = userBikes.find((bike) => bike.id === selectedBikeId);
    if (selectedBike) {
      setBikeDetails({
        registrationNumber: selectedBike.registrationNumber || "",
        odometer: selectedBike.odometer || "",
        lastServiceDate: selectedBike.lastServiceDate || "",
        getNotifications: true,
      });
    }
  }, [selectedBikeId, userBikes]);

  // Handle saving bike details
  const handleSaveDetails = (e) => {
    e.preventDefault();

    // Update the selected bike with new details
    const updatedBikes = userBikes.map((bike) => {
      if (bike.id === selectedBikeId) {
        return {
          ...bike,
          registrationNumber: bikeDetails.registrationNumber,
          odometer: bikeDetails.odometer,
          lastServiceDate: bikeDetails.lastServiceDate,
        };
      }
      return bike;
    });

    setUserBikes(updatedBikes);

    // Find the selected bike with updated details
    const selectedBike = updatedBikes.find(
      (bike) => bike.id === selectedBikeId
    );

    // Submit the form with the selected bike and notification preference
    onSubmit({
      selectedBike,
      getNotifications: getNotifications,
    });
  };

  // Handle adding a new bike
  const handleAddBike = () => {
    const newBikeId = `bike-${userBikes.length + 1}`;
    const bikeToAdd = {
      ...newBike,
      id: newBikeId,
    };

    setUserBikes([...userBikes, bikeToAdd]);
    setSelectedBikeId(newBikeId);
    setShowAddNewBike(false);
  };

  // Handle input change for the selected bike details
  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setBikeDetails({
      ...bikeDetails,
      [name]: value,
    });
  };

  // Handle input change for the new bike form
  const handleNewBikeChange = (e) => {
    const { name, value } = e.target;
    setNewBike({
      ...newBike,
      [name]: value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-indigo-700">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Bike Details</h2>

      <div className="mb-6">
        <p className="mb-4 text-gray-600">
          Please select your bike or add a new bike for service.
        </p>

        {/* Bike Selection */}
        <div className="mb-6">
          <label
            htmlFor="bikeSelect"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Bike
          </label>
          <div className="flex gap-2">
            <select
              id="bikeSelect"
              value={selectedBikeId}
              onChange={(e) => setSelectedBikeId(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-600 appearance-none"
            >
              {userBikes.map((bike) => (
                <option key={bike.id} value={bike.id}>
                  {bike.manufacturer} {bike.model}{" "}
                  {bike.registrationNumber
                    ? `(${bike.registrationNumber})`
                    : ""}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowAddNewBike(!showAddNewBike)}
              className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              {showAddNewBike ? "Cancel" : "Add New Bike"}
            </button>
          </div>
        </div>

        {/* Add New Bike Form */}
        {showAddNewBike && (
          <div className="bg-indigo-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-indigo-800 mb-3">Add New Bike</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="manufacturer"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Manufacturer
                </label>
                <input
                  type="text"
                  id="manufacturer"
                  name="manufacturer"
                  value={newBike.manufacturer}
                  onChange={handleNewBikeChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="model"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Model
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={newBike.model}
                  onChange={handleNewBikeChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="fuelType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Fuel Type
                </label>
                <select
                  id="fuelType"
                  name="fuelType"
                  value={newBike.fuelType}
                  onChange={handleNewBikeChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddBike}
                disabled={!newBike.manufacturer || !newBike.model}
                className="bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Bike
              </button>
            </div>
          </div>
        )}

        {/* Selected Bike Details Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-4">
            Bike Service Details
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="registrationNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Registration Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                value={bikeDetails.registrationNumber}
                onChange={handleDetailsChange}
                placeholder="e.g., MH12AB1234"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="odometer"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Current Odometer Reading (km){" "}
                <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                id="odometer"
                name="odometer"
                value={bikeDetails.odometer}
                onChange={handleDetailsChange}
                placeholder="e.g., 5000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="lastServiceDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Service Date
              </label>
              <input
                type="date"
                id="lastServiceDate"
                name="lastServiceDate"
                value={bikeDetails.lastServiceDate}
                onChange={handleDetailsChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="getNotifications"
                checked={getNotifications}
                onChange={() => setGetNotifications(!getNotifications)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="getNotifications"
                className="ml-2 block text-sm text-gray-700"
              >
                Get notifications for future service reminders
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleSaveDetails}
          disabled={!bikeDetails.registrationNumber || !bikeDetails.odometer}
          className="bg-indigo-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default BikeDetailsComponent;
