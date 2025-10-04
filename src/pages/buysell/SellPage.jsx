import React, { useState } from "react";
import axios from "axios";
import OwnerDetails from "./OwnerDetails";
import BikeDetails from "./BikeDetails";
import BikeImages from "./BikeImages";
import Toast from "../../components/errorhandeling/Toast";

const SellPage = () => {
  const [step, setStep] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    alternativeMobileNumber: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    bikeCategory: "",
    bikeBrand: "",
    bikeModel: "",
    registrationNumber: "",
    bikeColor: "",
    manufactureYear: "",
    numberOfOwners: "",
    odometerReading: "",
    sellingPrice: "",
    bikeCondition: "",
    frontPhoto: null,
    backPhoto: null,
    leftPhoto: null,
    rightPhoto: null,
  });

  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (value.trim().length < 2) error = "Name must be at least 2 characters";
        break;
      case "mobileNumber":
        if (!value.trim()) error = "Mobile number is required";
        else if (!/^[6-9]\d{9}$/.test(value)) error = "Enter a valid 10-digit mobile number";
        break;
      case "alternativeMobileNumber":
        if (value && !/^[6-9]\d{9}$/.test(value)) error = "Enter a valid 10-digit mobile number";
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Enter a valid email address";
        break;
      case "address":
        if (!value.trim()) error = "Address is required";
        else if (value.trim().length < 10) error = "Please provide a complete address";
        break;
      case "city":
        if (!value.trim()) error = "City is required";
        break;
      case "pincode":
        if (!value.trim()) error = "Pincode is required";
        else if (!/^\d{6}$/.test(value)) error = "Pincode must be 6 digits";
        break;
      case "bikeCategory":
        if (!value) error = "Please select a bike category";
        break;
      case "bikeBrand":
        if (!value) error = "Please select a bike brand";
        break;
      case "bikeModel":
        if (!value.trim()) error = "Bike model is required";
        break;
      case "registrationNumber":
        if (!value.trim()) error = "Registration number is required";
        else if (value.trim().length < 6) error = "Enter a valid registration number";
        break;
      case "bikeColor":
        if (!value.trim()) error = "Bike color is required";
        break;
      case "manufactureYear":
        if (!value) error = "Please select manufacture year";
        break;
      case "numberOfOwners":
        if (!value) error = "Please select number of owners";
        break;
      case "odometerReading":
        if (!value) error = "Odometer reading is required";
        else if (parseInt(value) < 0) error = "Odometer reading must be positive";
        break;
      case "sellingPrice":
        if (!value) error = "Selling price is required";
        else if (parseInt(value) <= 0) error = "Selling price must be greater than 0";
        break;
      case "bikeCondition":
        if (!value) error = "Please select bike condition";
        break;
      default:
        break;
    }

    return error;
  };

  const validateStep = () => {
    const newErrors = {};
    let fieldsToValidate = [];

    if (step === 1) {
      fieldsToValidate = ["name", "mobileNumber", "email", "address", "city", "pincode"];
    } else if (step === 2) {
      fieldsToValidate = [
        "bikeCategory",
        "bikeBrand",
        "bikeModel",
        "registrationNumber",
        "bikeColor",
        "manufactureYear",
        "numberOfOwners",
        "odometerReading",
        "sellingPrice",
        "bikeCondition",
      ];
    } else if (step === 3) {
      const hasImage = formData.frontPhoto || formData.backPhoto || formData.leftPhoto || formData.rightPhoto;
      if (!hasImage) {
        showToast("Please upload at least one bike image", "warning");
        return false;
      }

      const images = [
        { file: formData.frontPhoto, name: "Front Photo" },
        { file: formData.backPhoto, name: "Back Photo" },
        { file: formData.leftPhoto, name: "Left Photo" },
        { file: formData.rightPhoto, name: "Right Photo" },
      ];

      for (const img of images) {
        if (img.file) {
          const error = validateImage(img.file);
          if (error) {
            showToast(`${img.name}: ${error}`, "error");
            return false;
          }
        }
      }
      return true;
    }

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      showToast(firstError, "error");
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep()) {
      return;
    }
    
    setErrors({});
    setAnimating(true);
    setTimeout(() => {
      setStep(step + 1);
      setAnimating(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  const prevStep = () => {
    setErrors({});
    setAnimating(true);
    setTimeout(() => {
      setStep(step - 1);
      setAnimating(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  const validateImage = (file) => {
    if (!file) return null;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return "Please upload only JPEG, PNG, GIF, or BMP images";
    }

    if (file.size > maxSize) {
      return "Image size must be less than 5MB";
    }

    return null;
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const submitForm = async () => {
    if (!validateStep()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const formDataToSend = new FormData();
      const categoryId = parseInt(formData.bikeCategory) || 1;
      const brandId = parseInt(formData.bikeBrand) || 1;
      const modelId = parseInt(formData.bikeModel) || 1;
      const yearId = parseInt(formData.manufactureYear) || new Date().getFullYear();

      const requestDTO = {
        sellerDetail: {
          name: formData.name.trim(),
          contactNumber: formData.mobileNumber.trim(),
          alternateContactNumber: formData.alternativeMobileNumber?.trim() || "",
          email: formData.email.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
        },
        bikeSale: {
          categoryId: categoryId,
          brandId: brandId,
          modelId: modelId,
          yearId: yearId,
          color: formData.bikeColor.trim(),
          registrationNumber: formData.registrationNumber.trim().toUpperCase(),
          numberOfOwner: parseInt(formData.numberOfOwners) || 1,
          kmsDriven: parseInt(formData.odometerReading) || 0,
          price: parseFloat(formData.sellingPrice) || 0,
          sellingPrice: parseFloat(formData.sellingPrice) || 0,
          bikeCondition: formData.bikeCondition.trim(),
          name: formData.name.trim(),
          email: formData.email.trim(),
          contactNumber: formData.mobileNumber.trim(),
          alternateContactNumber: formData.alternativeMobileNumber?.trim() || "",
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
          address: formData.address.trim(),
        },
        bikeImages: {},
      };

      formDataToSend.append(
        "requestDTO",
        new Blob([JSON.stringify(requestDTO)], { type: "application/json" })
      );

      if (formData.frontPhoto) {
        formDataToSend.append("front_image", formData.frontPhoto, formData.frontPhoto.name);
      }
      if (formData.backPhoto) {
        formDataToSend.append("back_image", formData.backPhoto, formData.backPhoto.name);
      }
      if (formData.leftPhoto) {
        formDataToSend.append("left_image", formData.leftPhoto, formData.leftPhoto.name);
      }
      if (formData.rightPhoto) {
        formDataToSend.append("right_image", formData.rightPhoto, formData.rightPhoto.name);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/bike-sales/sell`,
        formDataToSend,
        { timeout: 60000 }
      );

      if (response.data.success) {
        showToast("🎉 Bike listed successfully! You'll be contacted soon.", "success");
        
        setTimeout(() => {
          setFormData({
            name: "",
            mobileNumber: "",
            alternativeMobileNumber: "",
            email: "",
            address: "",
            city: "",
            pincode: "",
            bikeCategory: "",
            bikeBrand: "",
            bikeModel: "",
            registrationNumber: "",
            bikeColor: "",
            manufactureYear: "",
            numberOfOwners: "",
            odometerReading: "",
            sellingPrice: "",
            bikeCondition: "",
            frontPhoto: null,
            backPhoto: null,
            leftPhoto: null,
            rightPhoto: null,
          });
          setStep(1);
        }, 2000);
      } else {
        showToast(response.data.message || "Submission completed with warnings", "warning");
      }
    } catch (error) {
      console.error("❌ Submission error:", error);

      if (error.response) {
        const { status, data } = error.response;
        let errorMessage = "An error occurred while submitting your listing";

        if (data?.message) {
          errorMessage = data.message;
        }

        if (status === 500) {
          if (errorMessage.toLowerCase().includes("image")) {
            showToast("Image validation failed. Please check your images and try again.", "error");
          } else if (errorMessage.toLowerCase().includes("brand")) {
            showToast("Please select a valid bike brand", "error");
          } else if (errorMessage.toLowerCase().includes("category")) {
            showToast("Please select a valid bike category", "error");
          } else {
            showToast(errorMessage, "error");
          }
        } else if (status === 400) {
          showToast("Invalid form data. Please check all fields.", "error");
        } else {
          showToast(errorMessage, "error");
        }
      } else if (error.request) {
        showToast("Network error. Please check your internet connection.", "error");
      } else {
        showToast("An unexpected error occurred. Please try again.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <OwnerDetails
            formData={formData}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            errors={errors}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <BikeDetails
            formData={formData}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            errors={errors}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <BikeImages
            formData={formData}
            setFormData={setFormData}
            prevStep={prevStep}
            submitForm={submitForm}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16 px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block mb-4">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm">
                <span className="text-5xl">🏍️</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
              Sell Your Bike Today
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Complete the form in simple steps to list your bike for sale
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 mb-8 border border-gray-100">
            <div className="relative">
              <div className="absolute top-8 left-0 w-full h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full -z-10" />
              <div
                className="absolute top-8 left-0 h-2 rounded-full transition-all duration-700 ease-out -z-10 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />

              <div className="flex justify-between items-start relative">
                {[
                  { number: 1, title: "Owner Details", icon: "👤", desc: "Personal Info" },
                  { number: 2, title: "Bike Details", icon: "🏍️", desc: "Vehicle Info" },
                  { number: 3, title: "Upload Images", icon: "📸", desc: "Add Photos" },
                ].map((stepItem) => (
                  <div key={stepItem.number} className="flex flex-col items-center w-1/3 relative">
                    <div
                      className={`
                        w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl
                        font-bold transition-all duration-500 mb-3 relative z-10 shadow-lg
                        ${
                          stepItem.number === step
                            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white scale-110 ring-4 ring-blue-200"
                            : stepItem.number < step
                            ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white scale-105"
                            : "bg-white border-4 border-gray-300 text-gray-400"
                        }
                      `}
                    >
                      {stepItem.number < step ? (
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        stepItem.icon
                      )}
                    </div>
                    <div className="text-center">
                      <span
                        className={`
                          block text-sm sm:text-base font-bold transition-colors duration-300 mb-1
                          ${
                            stepItem.number === step
                              ? "text-blue-600"
                              : stepItem.number < step
                              ? "text-green-600"
                              : "text-gray-500"
                          }
                        `}
                      >
                        {stepItem.title}
                      </span>
                      <span className="text-xs text-gray-500 hidden sm:block">{stepItem.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 rounded-full">
                <span className="text-sm font-semibold text-gray-600 mr-2">Progress:</span>
                <span className="text-lg font-bold text-blue-600">{Math.round(((step) / 3) * 100)}%</span>
              </div>
            </div>
          </div>

          <div
            className={`
              bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100
              transition-all duration-500 transform
              ${animating ? "opacity-0 scale-98" : "opacity-100 scale-100"}
            `}
          >
            <div className="p-6 sm:p-10 lg:p-14">
              {renderStepContent()}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center bg-white px-6 py-3 rounded-full shadow-lg">
              <span className="text-sm text-gray-600 mr-2">Step</span>
              <span className="text-xl font-bold text-blue-600">{step}</span>
              <span className="text-sm text-gray-600 mx-1">of</span>
              <span className="text-xl font-bold text-gray-800">3</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-6 py-3 rounded-full shadow-lg">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Need help? Contact support</span>
            </div>
          </div>

          <div className="mt-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg shadow-md">
            <div className="flex items-start">
              <span className="text-2xl mr-3">ℹ️</span>
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">Required Fields</p>
                <p className="text-xs text-amber-800">
                  Fields marked with <span className="text-red-600 font-bold text-base">*</span> are mandatory and must be filled to proceed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellPage;
