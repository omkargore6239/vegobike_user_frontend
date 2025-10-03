import React, { useState, useEffect } from "react";

const BikeDetails = ({ formData, setFormData, nextStep, prevStep }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get base URL from environment variables
  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${baseURL}/api/categories/all?page=0&size=10`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [baseURL]);

  useEffect(() => {
    const fetchBrands = async () => {
      if (formData.bikeCategory) {
        try {
          const response = await fetch(
            `${baseURL}/api/brands/by-category/${formData.bikeCategory}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch brands");
          }
          const data = await response.json();
          setBrands(data.data || []);
          // Reset brand and model when category changes
          setFormData((prevFormData) => ({
            ...prevFormData,
            bikeBrand: "",
            bikeModel: "",
          }));
          setModels([]);
        } catch (err) {
          setError(err.message);
        }
      }
    };

    fetchBrands();
  }, [formData.bikeCategory, setFormData, baseURL]);

  useEffect(() => {
    const fetchModels = async () => {
      if (formData.bikeBrand) {
        try {
          const response = await fetch(
            `${baseURL}/api/models/by-brand/${formData.bikeBrand}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch models");
          }
          const data = await response.json();
          setModels(data.data || []);
          // Reset model when brand changes
          setFormData((prevFormData) => ({
            ...prevFormData,
            bikeModel: "",
          }));
        } catch (err) {
          setError(err.message);
        }
      }
    };

    fetchModels();
  }, [formData.bikeBrand, setFormData, baseURL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        Bike Details
      </h2>

      {/* Bike Details Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bike Category */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="bikeCategory"
          >
            Bike Category
          </label>
          <select
            id="bikeCategory"
            name="bikeCategory"
            value={formData.bikeCategory || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          >
            <option value="">Select Category</option>
            {loading ? (
              <option value="">Loading...</option>
            ) : error ? (
              <option value="">Error: {error}</option>
            ) : (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Bike Brand */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="bikeBrand"
          >
            Bike Brand
          </label>
          <select
            id="bikeBrand"
            name="bikeBrand"
            value={formData.bikeBrand || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
            disabled={!formData.bikeCategory}
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.brandName}
              </option>
            ))}
          </select>
        </div>

        {/* Bike Model - 🔥 FIXED: Now stores model ID instead of model name */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="bikeModel"
          >
            Bike Model
          </label>
          <select
            id="bikeModel"
            name="bikeModel"
            value={formData.bikeModel || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
            disabled={!formData.bikeBrand}
          >
            <option value="">Select Model</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.modelName}
              </option>
            ))}
          </select>
        </div>

        {/* Registration Number */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="registrationNumber"
          >
            Registration Number
          </label>
          <input
            id="registrationNumber"
            type="text"
            name="registrationNumber"
            value={formData.registrationNumber || ""}
            onChange={handleChange}
            placeholder="Ex: KA01AB1234"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all uppercase"
            required
          />
        </div>

        {/* Bike Color */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="bikeColor"
          >
            Bike Color
          </label>
          <input
            id="bikeColor"
            type="text"
            name="bikeColor"
            value={formData.bikeColor || ""}
            onChange={handleChange}
            placeholder="Enter bike color"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>

        {/* Manufacture Year */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="manufactureYear"
          >
            Manufacture Year
          </label>
          <select
            id="manufactureYear"
            name="manufactureYear"
            value={formData.manufactureYear || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          >
            <option value="">Select Year</option>
            {Array.from(
              { length: 25 },
              (_, i) => new Date().getFullYear() - i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Number of Owners */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="numberOfOwners"
          >
            Number of Owners
          </label>
          <select
            id="numberOfOwners"
            name="numberOfOwners"
            value={formData.numberOfOwners || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          >
            <option value="">Select</option>
            <option value="1">1st Owner</option>
            <option value="2">2nd Owner</option>
            <option value="3">3rd Owner</option>
            <option value="4+">4+ Owners</option>
          </select>
        </div>

        {/* Odometer Reading */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="odometerReading"
          >
            Odometer Reading (KM)
          </label>
          <input
            id="odometerReading"
            type="number"
            name="odometerReading"
            value={formData.odometerReading || ""}
            onChange={handleChange}
            placeholder="Enter kilometers run"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>

        {/* Selling Price */}
        <div className="mb-4 col-span-1">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="sellingPrice"
          >
            Selling Price (₹)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
              ₹
            </span>
            <input
              id="sellingPrice"
              type="number"
              name="sellingPrice"
              value={formData.sellingPrice || ""}
              onChange={handleChange}
              placeholder="Enter amount in INR"
              className="w-full pl-8 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Bike Condition */}
        <div className="mb-4 col-span-3">
          <label className="block text-gray-700 font-medium mb-2">
            Bike Condition
          </label>
          <div className="grid grid-cols-3 gap-4">
            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-all">
              <input
                type="radio"
                name="bikeCondition"
                value="Excellent"
                checked={formData.bikeCondition === "Excellent"}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600"
              />
              <div>
                <span className="font-medium">Excellent</span>
                <p className="text-xs text-gray-500">Like new condition</p>
              </div>
            </label>
            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-all">
              <input
                type="radio"
                name="bikeCondition"
                value="Good"
                checked={formData.bikeCondition === "Good"}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600"
              />
              <div>
                <span className="font-medium">Good</span>
                <p className="text-xs text-gray-500">Minor wear and tear</p>
              </div>
            </label>
            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-all">
              <input
                type="radio"
                name="bikeCondition"
                value="Fair"
                checked={formData.bikeCondition === "Fair"}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600"
              />
              <div>
                <span className="font-medium">Fair</span>
                <p className="text-xs text-gray-500">Needs some work</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          type="button"
          className="px-6 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </button>
        <button
          onClick={nextStep}
          type="button"
          className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all flex items-center"
        >
          Next Step
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BikeDetails;
