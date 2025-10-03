import React, { useState } from "react";
import axios from "axios";
import OwnerDetails from "./OwnerDetails";
import BikeDetails from "./BikeDetails";
import BikeImages from "./BikeImages";

const SellPage = () => {
  const [step, setStep] = useState(1);
  const [animating, setAnimating] = useState(false);
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

  // Validate current step's required fields before proceeding
  const validateStep = () => {
    const errors = [];

    if (step === 1) {
      // Owner Details validation
      if (!formData.name?.trim()) errors.push("Owner name is required.");
      if (!formData.mobileNumber?.trim()) errors.push("Mobile number is required.");
      if (!formData.email?.trim()) errors.push("Email is required.");
      if (!formData.address?.trim()) errors.push("Address is required.");
      if (!formData.city?.trim()) errors.push("City is required.");
      if (!formData.pincode?.trim()) errors.push("Pincode is required.");
    }

    if (step === 2) {
      // Bike Details validation
      if (!formData.bikeCategory?.trim()) errors.push("Bike category is required.");
      if (!formData.bikeBrand?.trim()) errors.push("Bike brand is required.");
      if (!formData.bikeModel?.trim()) errors.push("Bike model is required.");
      if (!formData.registrationNumber?.trim()) errors.push("Registration number is required.");
      if (!formData.bikeColor?.trim()) errors.push("Bike color is required.");
      if (!formData.manufactureYear?.trim()) errors.push("Manufacture year is required.");
      if (!formData.numberOfOwners?.trim()) errors.push("Number of owners is required.");
      if (!formData.odometerReading?.trim()) errors.push("Odometer reading is required.");
      if (!formData.sellingPrice?.trim()) errors.push("Selling price is required.");
      if (!formData.bikeCondition?.trim()) errors.push("Bike condition is required.");
    }

    if (step === 3) {
      // Images validation
      const hasImage = formData.frontPhoto || formData.backPhoto || formData.leftPhoto || formData.rightPhoto;
      if (!hasImage) {
        errors.push("At least one bike image must be uploaded.");
      }

      // Validate each uploaded image
      const frontError = validateImage(formData.frontPhoto);
      if (frontError) errors.push(frontError);
      const backError = validateImage(formData.backPhoto);
      if (backError) errors.push(backError);
      const leftError = validateImage(formData.leftPhoto);
      if (leftError) errors.push(leftError);
      const rightError = validateImage(formData.rightPhoto);
      if (rightError) errors.push(rightError);
    }

    return errors;
  };

  const nextStep = () => {
    const errors = validateStep();
    if (errors.length > 0) {
      alert(`❌ Please fix the following errors before continuing:\n\n${errors.join("\n")}`);
      return;
    }
    setAnimating(true);
    setStep(step + 1);
    setTimeout(() => setAnimating(false), 300);
  };

  const prevStep = () => {
    setAnimating(true);
    setStep(step - 1);
    setTimeout(() => setAnimating(false), 300);
  };

  // Enhanced image validation
  const validateImage = (file) => {
    if (!file) return null;
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/bmp",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type for ${file.name}. Please upload JPEG, PNG, GIF, or BMP images only.`;
    }

    if (file.size > maxSize) {
      return `File ${file.name} is too large. Maximum size allowed is 5MB.`;
    }

    return null;
  };

  // Full form validation for final submit
  const validateForm = () => {
    const errors = [];

    // Required field validation
    if (!formData.name?.trim()) errors.push("Owner name is required");
    if (!formData.mobileNumber?.trim())
      errors.push("Mobile number is required");
    if (!formData.email?.trim()) errors.push("Email is required");
    if (!formData.address?.trim()) errors.push("Address is required");
    if (!formData.city?.trim()) errors.push("City is required");
    if (!formData.pincode?.trim()) errors.push("Pincode is required");

    if (!formData.bikeCategory?.trim())
      errors.push("Bike category is required");
    if (!formData.bikeBrand?.trim()) errors.push("Bike brand is required");
    if (!formData.bikeModel?.trim()) errors.push("Bike model is required");
    if (!formData.registrationNumber?.trim())
      errors.push("Registration number is required");
    if (!formData.bikeColor?.trim()) errors.push("Bike color is required");
    if (!formData.manufactureYear?.trim())
      errors.push("Manufacture year is required");
    if (!formData.numberOfOwners?.trim())
      errors.push("Number of owners is required");
    if (!formData.odometerReading?.trim())
      errors.push("Odometer reading is required");
    if (!formData.sellingPrice?.trim())
      errors.push("Selling price is required");
    if (!formData.bikeCondition?.trim())
      errors.push("Bike condition is required");

    // Image validation
    const frontImageError = validateImage(formData.frontPhoto);
    if (frontImageError) errors.push(frontImageError);

    const backImageError = validateImage(formData.backPhoto);
    if (backImageError) errors.push(backImageError);

    const leftImageError = validateImage(formData.leftPhoto);
    if (leftImageError) errors.push(leftImageError);

    const rightImageError = validateImage(formData.rightPhoto);
    if (rightImageError) errors.push(rightImageError);

    return errors;
  };

  // Updated submitForm with proper model ID handling and environment variable
  const submitForm = async () => {
    try {
      // 1️⃣ Validate form
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        alert(
          `❌ Please fix the following errors:\n\n${validationErrors.join(
            "\n"
          )}`
        );
        return;
      }

      const formDataToSend = new FormData();

      // 2️⃣ Use the actual IDs from form data with proper model ID handling
      const categoryId = parseInt(formData.bikeCategory) || 1;
      const brandId = parseInt(formData.bikeBrand) || 1;

      // 🔥 FIX: Get actual model ID - formData.bikeModel now contains the model ID from API
      const modelId = parseInt(formData.bikeModel) || 1;
      const yearId =
        parseInt(formData.manufactureYear) || new Date().getFullYear();

      console.log("🔍 ID Mappings:", {
        categoryId: categoryId,
        brandId: brandId,
        modelId: modelId,
        yearId: yearId,
        originalModelValue: formData.bikeModel,
      });

      // 3️⃣ Create request DTO using actual API data
      const requestDTO = {
        sellerDetail: {
          name: formData.name.trim(),
          contactNumber: formData.mobileNumber.trim(),
          alternateContactNumber:
            formData.alternativeMobileNumber?.trim() || "",
          email: formData.email.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
        },

        bikeSale: {
          // ✅ Use actual IDs from API responses
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

          // Duplicate required fields
          name: formData.name.trim(),
          email: formData.email.trim(),
          contactNumber: formData.mobileNumber.trim(),
          alternateContactNumber:
            formData.alternativeMobileNumber?.trim() || "",
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
          address: formData.address.trim(),
        },

        bikeImages: {},
      };

      // 4️⃣ Append JSON data
      formDataToSend.append(
        "requestDTO",
        new Blob([JSON.stringify(requestDTO)], {
          type: "application/json",
        })
      );

      // 5️⃣ Append image files with validation
      if (formData.frontPhoto) {
        console.log(
          `📷 Adding front image: ${formData.frontPhoto.name} (${formData.frontPhoto.type}, ${formData.frontPhoto.size} bytes)`
        );
        formDataToSend.append(
          "front_image",
          formData.frontPhoto,
          formData.frontPhoto.name
        );
      }

      if (formData.backPhoto) {
        console.log(
          `📷 Adding back image: ${formData.backPhoto.name} (${formData.backPhoto.type}, ${formData.backPhoto.size} bytes)`
        );
        formDataToSend.append(
          "back_image",
          formData.backPhoto,
          formData.backPhoto.name
        );
      }

      if (formData.leftPhoto) {
        console.log(
          `📷 Adding left image: ${formData.leftPhoto.name} (${formData.leftPhoto.type}, ${formData.leftPhoto.size} bytes)`
        );
        formDataToSend.append(
          "left_image",
          formData.leftPhoto,
          formData.leftPhoto.name
        );
      }

      if (formData.rightPhoto) {
        console.log(
          `📷 Adding right image: ${formData.rightPhoto.name} (${formData.rightPhoto.type}, ${formData.rightPhoto.size} bytes)`
        );
        formDataToSend.append(
          "right_image",
          formData.rightPhoto,
          formData.rightPhoto.name
        );
      }

      // 6️⃣ Debug logging
      console.log("📤 Final request structure:", requestDTO);
      console.log("📦 FormData contents:");
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(
            `  ${key}: ${value.name} (${value.type}, ${value.size} bytes)`
          );
        } else {
          console.log(`  ${key}: JSON Data`);
        }
      }

      // 7️⃣ Send request using environment variable
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/bike-sales/sell`,
        formDataToSend,
        {
          timeout: 60000, // Increased timeout for image upload
          // Don't set Content-Type - let browser handle multipart boundary
        }
      );

      // 8️⃣ Success handling
      console.log("✅ Success Response:", response.data);

      if (response.data.success) {
        alert(`✅ Bike listed successfully! 

Correlation ID: ${response.data.correlationId}
Message: ${response.data.message}
Timestamp: ${response.data.timestamp}`);

        // Optional: Reset form or redirect to success page
        // setFormData(initialState);
        // window.location.href = '/success';
      } else {
        // Handle success=false case
        alert(`⚠️ Submission completed with warnings:

${response.data.message}

Correlation ID: ${response.data.correlationId}`);
      }
    } catch (error) {
      console.error("❌ Full error details:", error);

      if (error.response) {
        const { status, data } = error.response;
        console.error("❌ Server response:", data);

        let errorMessage =
          "An error occurred while submitting your bike listing.";

        if (data?.message) {
          errorMessage = data.message;
        }

        // Handle specific errors
        if (status === 500) {
          if (
            errorMessage.toLowerCase().includes("invalid image") ||
            errorMessage.toLowerCase().includes("invalid ima") ||
            errorMessage.toLowerCase().includes("image")
          ) {
            alert(`❌ Image Validation Error

There was a problem with one or more uploaded images:
${errorMessage}

Please ensure:
• Images are in JPEG, PNG, GIF, or BMP format
• Each image is under 5MB in size
• Images are not corrupted
• At least one image is uploaded

Correlation ID: ${data.correlationId || "N/A"}`);
          } else if (errorMessage.includes("brandId is required")) {
            alert(`❌ Brand Selection Error

Please make sure you have selected a valid bike brand from the dropdown menu.

Current selection: ${formData.bikeBrand}

Correlation ID: ${data.correlationId || "N/A"}`);
          } else if (errorMessage.includes("categoryId is required")) {
            alert(`❌ Category Selection Error

Please make sure you have selected a valid bike category from the dropdown menu.

Current selection: ${formData.bikeCategory}

Correlation ID: ${data.correlationId || "N/A"}`);
          } else {
            alert(`❌ Server Error (${status}): ${errorMessage}

Correlation ID: ${data.correlationId || "N/A"}`);
          }
        } else {
          alert(`❌ Error (${status}): ${errorMessage}`);
        }
      } else if (error.request) {
        alert(
          "❌ Network Error\n\nUnable to connect to server. Please check your internet connection and try again."
        );
      } else {
        alert(`❌ Request Error: ${error.message}`);
      }
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <OwnerDetails
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <BikeDetails
            formData={formData}
            setFormData={setFormData}
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
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-8">Sell Your Bike</h1>

      {/* Step Progress Bar */}
      <div className="w-full mb-12">
        <div className="flex justify-between relative mb-2">
          <div className="absolute top-4 left-0 h-1 bg-gray-300 w-full -z-10"></div>
          <div
            className="absolute top-4 left-0 h-1 bg-blue-500 -z-10 transition-all duration-500 ease-in-out"
            style={{ width: `${(step - 1) * 50}%` }}
          ></div>
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex flex-col items-center ${
                animating && stepNumber === step ? "animate-pulse" : ""
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                  stepNumber === step
                    ? "border-blue-500 bg-blue-100 text-blue-500"
                    : stepNumber < step
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-gray-300 bg-white text-gray-400"
                }`}
              >
                {stepNumber < step ? (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`mt-2 text-sm ${
                  stepNumber === step
                    ? "font-semibold text-blue-500"
                    : stepNumber < step
                    ? "font-medium text-blue-500"
                    : "text-gray-500"
                }`}
              >
                {stepNumber === 1
                  ? "Owner Details"
                  : stepNumber === 2
                  ? "Bike Details"
                  : "Upload Images"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div
        className={`w-full transition-all duration-300 ${
          animating ? "opacity-50 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {renderStepContent()}
      </div>

      <div className="mt-8 text-center text-gray-500">
        <p>Step {step} of 3</p>
      </div>
    </div>
  );
};

export default SellPage;
