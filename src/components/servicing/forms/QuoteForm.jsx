import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const QuoteForm = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({ bikeSelection: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL?.replace(/\/+$/, ""); // remove trailing /
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const createAbortController = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  };

  const getFallbackImage = (width = 60, height = 60) =>
    `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 ${width} ${height}"%3E%3Crect width="${width}" height="${height}" 
     fill="%23f0f0f0"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" 
     text-anchor="middle" fill="%23999" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E`;

  /** 🔹 Fetch brands */
  const fetchBrands = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const controller = createAbortController();
      const response = await axios.get(`${BASE_URL}/api/brands/all`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 15000,
        signal: controller.signal,
      });

      if (!isMountedRef.current) return;

      const data = response.data?.data || response.data || [];
      const brandsData = data.map((brand) => ({
        ...brand,
        brandImage: brand.brandImage
          ? `${BASE_URL}${
              brand.brandImage.startsWith("/") ? "" : "/"
            }${brand.brandImage.replace(/^\/+/, "")}`
          : null,
      }));

      setBrands(brandsData);
    } catch (err) {
      if (!isMountedRef.current) return;
      if (
        axios.isCancel(err) ||
        err.name === "AbortError" ||
        err.code === "ECONNABORTED"
      ) {
        console.log("Request canceled:", err.message);
        return;
      }
      console.error("Error fetching brands:", err);
      setError("Failed to load brands. Please try again.");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  /** 🔹 On input focus → load brands */
  const handleBikeInputFocus = () => {
    if (brands.length === 0) {
      fetchBrands();
    }
    setActiveModal("brand");
  };

  /** 🔹 Select Brand → fetch Models */
  const handleBrandSelect = async (brand) => {
    if (loading) return;
    setSelectedBrand(brand);
    setLoading(true);
    setError(null);

    try {
      const controller = createAbortController();
      const response = await axios.get(
        `${BASE_URL}/api/models/by-brand/${brand.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 15000,
          signal: controller.signal,
        }
      );

      if (!isMountedRef.current) return;

      const data = response.data?.data || response.data || [];
      const modelsData = data.map((model) => ({
        ...model,
        modelImage: model.modelImage
          ? `${BASE_URL}${
              model.modelImage.startsWith("/") ? "" : "/"
            }${model.modelImage.replace(/^\/+/, "")}`
          : null,
      }));

      setModels(modelsData);
      setActiveModal("model");
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error("Error fetching models:", err);
      setError("Failed to load models. Please try again.");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  /** 🔹 Select Model */
  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setFormData({
      bikeSelection: `${selectedBrand?.brandName || selectedBrand?.name} ${
        model.modelName || model.name
      }`,
    });
    setActiveModal(null);
  };

  /** 🔹 Check Prices */
  const handleCheckPrices = async () => {
    if (!selectedBrand || !selectedModel) {
      setError("Please select both brand and model");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const controller = createAbortController();
      const response = await axios.get(
        `${BASE_URL}/api/bike-services/by-brand-model`,
        {
          params: { brandId: selectedBrand.id, modelId: selectedModel.id },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 15000,
          signal: controller.signal,
        }
      );

      if (!isMountedRef.current) return;

      const bikeServicesData = response.data?.data || response.data || [];
      if (bikeServicesData.length === 0) {
        setError("No services available for this bike model.");
        return;
      }

      const bikeData = {
        brand: selectedBrand.brandName || selectedBrand.name,
        model: selectedModel.modelName || selectedModel.name,
        image: selectedModel.modelImage,
        brandLogo: selectedBrand.brandImage,
        brandId: selectedBrand.id,
        modelId: selectedModel.id,
        services: { data: bikeServicesData, success: true },
      };

      navigate("/service-packages", { state: { bikeData } });
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error("Error fetching services:", err);
      setError("Failed to load services. Please try again.");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  /** 🔹 Brand Selection Modal */
  const BrandSelection = () => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Select Brand</h2>
        <button onClick={() => setActiveModal(null)} disabled={loading}>
          ✕
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {loading ? (
        <p>Loading brands...</p>
      ) : (
        <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
          {brands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => handleBrandSelect(brand)}
              className="flex flex-col items-center p-2 cursor-pointer border rounded-lg hover:shadow-md"
            >
              <div className="w-16 h-16 flex items-center justify-center mb-1">
                <img
                  src={brand.brandImage || getFallbackImage(60, 60)}
                  alt={brand.brandName || "Brand"}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = getFallbackImage(60, 60);
                  }}
                />
              </div>
              <span className="text-xs text-center">
                {brand.brandName || "Unnamed Brand"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /** 🔹 Model Selection Modal */
  const ModelSelection = () => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Select Model</h2>
        <button onClick={() => setActiveModal("brand")} disabled={loading}>
          ← Back
        </button>
      </div>
      {loading ? (
        <p>Loading models...</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {models.map((model) => (
            <div
              key={model.id}
              onClick={() => handleModelSelect(model)}
              className="flex flex-col items-center p-2 cursor-pointer border rounded-lg hover:shadow-md"
            >
              <div className="w-20 h-16 flex items-center justify-center mb-1">
                <img
                  src={model.modelImage || getFallbackImage(80, 80)}
                  alt={model.modelName || "Model"}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = getFallbackImage(80, 80);
                  }}
                />
              </div>
              <span className="text-xs text-center">
                {model.modelName || "Unnamed Model"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg max-w-md mx-auto">
      {activeModal === "brand" && <BrandSelection />}
      {activeModal === "model" && <ModelSelection />}
      {!activeModal && (
        <>
          <h2 className="text-2xl font-bold mb-2">
            Experience The Best Bike Services
          </h2>
          <input
            type="text"
            value={formData.bikeSelection}
            onFocus={handleBikeInputFocus}
            placeholder="SELECT YOUR BIKE BRAND"
            readOnly
            className="w-full p-3 border rounded-md cursor-pointer"
          />
          <button
            onClick={handleCheckPrices}
            disabled={!formData.bikeSelection || loading}
            className="w-full p-3 bg-indigo-900 text-white rounded-md mt-4"
          >
            {loading ? "Loading..." : "CHECK SERVICES"}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </>
      )}
    </div>
  );
};

export default QuoteForm;