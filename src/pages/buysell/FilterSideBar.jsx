// // src/components/FilterSidebar.jsx
// import React, { useState } from 'react';

// const FilterSidebar = ({ onFiltersChange, className = "" }) => {
//   const [openSections, setOpenSections] = useState({
//     categories: true,
//     locations: false,
//     budget: false,
//     brands: false,
//     models: false,
//     year: false,
//     fuelType: false
//   });
//   const [selectedFilters, setSelectedFilters] = useState({
//     categories: [],
//     locations: [],
//     budget: [],
//     brands: [],
//     models: [],
//     year: [],
//     fuelType: []
//   });

//   // Toggle section function
//   const toggleSection = (section) => {
//     setOpenSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   // Handle filter selection
//   const handleFilterSelect = (section, value, count = null) => {
//     setSelectedFilters(prev => {
//       const currentSelection = prev[section];
//       const isSelected = currentSelection.includes(value);

//       const updatedSelection = isSelected
//         ? currentSelection.filter(item => item !== value)
//         : [...currentSelection, value];
//       const updatedFilters = {
//         ...prev,
//         [section]: updatedSelection
//       };

//       // Callback to parent component
//       if (onFiltersChange) {
//         onFiltersChange(updatedFilters);
//       }
//       return updatedFilters;
//     });
//   };

//   // Check if item is selected
//   const isSelected = (section, value) => {
//     return selectedFilters[section].includes(value);
//   };

//   // Static filter data
//   const filterData = {
//     categories: [
//       { name: "All Categories", isParent: true },
//       { name: "Bikes", isParent: true, children: [
//         { name: "Motorcycles", count: "1,42,353", highlighted: true },
//         { name: "Scooters", count: "46,780" },
//         { name: "Sports Bikes", count: "25,450" },
//         { name: "Cruisers", count: "18,230" },
//         { name: "Adventure Bikes", count: "12,890" },
//         { name: "Spare Parts", count: "5,818" }
//       ]}
//     ],
//     locations: [
//       { name: "India", highlighted: true, children: [
//         { name: "Uttar Pradesh", count: "21,332" },
//         { name: "Maharashtra", count: "15,167" },
//         { name: "Tamil Nadu", count: "10,584" },
//         { name: "Karnataka", count: "9,959" },
//         { name: "Kerala", count: "9,819" },
//         { name: "Telangana", count: "8,726" },
//         { name: "West Bengal", count: "7,445" },
//         { name: "Rajasthan", count: "6,234" },
//         { name: "Gujarat", count: "5,890" },
//         { name: "Punjab", count: "4,567" }
//       ]}
//     ],
//     budget: [
//       { name: "Under ₹50,000", count: "45,230" },
//       { name: "₹50,000 - ₹1,00,000", count: "67,450" },
//       { name: "₹1,00,000 - ₹2,00,000", count: "52,340" },
//       { name: "₹2,00,000 - ₹3,00,000", count: "28,150" },
//       { name: "₹3,00,000 - ₹5,00,000", count: "15,670" },
//       { name: "Above ₹5,00,000", count: "8,920" }
//     ],
//     brands: [
//       { name: "Honda", count: "25,340" },
//       { name: "TVS", count: "22,150" },
//       { name: "Bajaj", count: "20,890" },
//       { name: "Hero", count: "18,760" },
//       { name: "Royal Enfield", count: "15,450" },
//       { name: "Yamaha", count: "12,230" },
//       { name: "KTM", count: "8,670" },
//       { name: "Suzuki", count: "7,450" },
//       { name: "Kawasaki", count: "3,230" },
//       { name: "Harley Davidson", count: "1,560" }
//     ],
//     models: [
//       { name: "Activa", count: "18,450" },
//       { name: "Classic 350", count: "12,340" },
//       { name: "Pulsar", count: "15,670" },
//       { name: "FZ Series", count: "9,870" },
//       { name: "Duke Series", count: "7,450" },
//       { name: "Splendor", count: "16,780" },
//       { name: "Jupiter", count: "11,230" },
//       { name: "Access", count: "8,560" }
//     ],
//     year: [
//       { name: "2024", count: "5,230" },
//       { name: "2023", count: "12,450" },
//       { name: "2022", count: "18,670" },
//       { name: "2021", count: "22,340" },
//       { name: "2020", count: "25,780" },
//       { name: "2019", count: "28,450" },
//       { name: "2018", count: "24,560" },
//       { name: "2017", count: "20,340" },
//       { name: "2016", count: "15,670" },
//       { name: "2015 & Below", count: "35,890" }
//     ],
//     fuelType: [
//       { name: "Petrol", count: "1,85,450" },
//       { name: "Electric", count: "12,340" },
//       { name: "Hybrid", count: "2,450" },
//       { name: "CNG", count: "890" }
//     ]
//   };

//   return (
//     <div className={`w-80 bg-white shadow-lg overflow-y-auto ${className}`}>
//       <div className="p-6">
//         {/* Header */}
//         <div className="mb-6">
//           <div className="flex items-center text-sm text-gray-500 mb-2">
//             {/* <span>Cars</span> */}
//             <span className="mx-2">•</span>
//             <span>Motorcycles</span>
//           </div>
//         </div>

//         {/* Categories Section */}
//         <div className="mb-8">
//           <h3 className="text-lg font-bold text-gray-900 mb-4">CATEGORIES</h3>

//           <div className="space-y-3">
//             <button
//               onClick={() => toggleSection('categories')}
//               className="flex items-center w-full text-left"
//             >
//               <div className="w-4 h-4 border border-gray-400 mr-3 flex items-center justify-center">
//                 <div className={`w-2 h-0.5 bg-gray-600 transition-transform ${openSections.categories ? 'rotate-90' : ''}`}></div>
//               </div>
//               <span className="font-medium text-gray-900">All Categories</span>
//             </button>

//             {/* Sub-categories */}
//             <div className="ml-7">
//               <div className="space-y-2">
//                 <div className="flex items-center">
//                   <div className="w-4 h-4 border border-gray-400 mr-3 flex items-center justify-center">
//                     <div className={`w-2 h-0.5 bg-gray-600 transition-transform ${openSections.categories ? 'rotate-90' : ''}`}></div>
//                   </div>
//                   <span className="text-gray-600">Bikes</span>
//                 </div>
//                 {openSections.categories && (
//                   <div className="ml-7 space-y-2">
//                     {filterData.categories[1].children.map((item) => (
//                       <button
//                         key={item.name}
//                         onClick={() => handleFilterSelect('categories', item.name, item.count)}
//                         className={`w-full text-left px-3 py-2 rounded transition-colors ${
//                           item.highlighted || isSelected('categories', item.name)
//                             ? 'bg-blue-100'
//                             : 'hover:bg-gray-50'
//                         }`}
//                       >
//                         <span className={`${
//                           item.highlighted || isSelected('categories', item.name)
//                             ? 'font-medium text-gray-900'
//                             : 'text-gray-600'
//                         }`}>
//                           {item.name} ({item.count})
//                         </span>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Locations Section */}
//         <div className="mb-8">
//           <h3 className="text-lg font-bold text-gray-900 mb-4">LOCATIONS</h3>

//           <div className="space-y-3">
//             <button
//               onClick={() => toggleSection('locations')}
//               className="flex items-center w-full text-left"
//             >
//               <div className="w-4 h-4 border border-gray-400 mr-3 flex items-center justify-center">
//                 <div className={`w-2 h-0.5 bg-gray-600 transition-transform ${openSections.locations ? 'rotate-90' : ''}`}></div>
//               </div>
//               <div className="bg-blue-100 px-3 py-2 rounded flex-1">
//                 <span className="font-medium text-gray-900">India</span>
//               </div>
//             </button>
//             {openSections.locations && (
//               <div className="ml-7 space-y-2">
//                 {filterData.locations[0].children.map((location) => (
//                   <button
//                     key={location.name}
//                     onClick={() => handleFilterSelect('locations', location.name, location.count)}
//                     className={`w-full text-left px-3 py-1 rounded transition-colors ${
//                       isSelected('locations', location.name)
//                         ? 'bg-blue-100 font-medium text-gray-900'
//                         : 'text-gray-600 hover:bg-gray-50'
//                     }`}
//                   >
//                     {location.name} ({location.count})
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Filters Label */}
//         <div className="mb-6">
//           <h4 className="text-gray-500 font-medium">Filters</h4>
//         </div>

//         {/* Budget Section */}
//         <div className="mb-8">
//           <h3 className="text-lg font-bold text-gray-900 mb-4">BUDGET</h3>

//           <div className="space-y-3">
//             <button
//               onClick={() => toggleSection('budget')}
//               className="flex items-center w-full text-left"
//             >
//               <div className="w-4 h-4 border border-gray-400 mr-3 flex items-center justify-center">
//                 <div className={`w-2 h-0.5 bg-gray-600 transition-transform ${openSections.budget ? 'rotate-90' : ''}`}></div>
//               </div>
//               <span className="font-medium text-gray-900">All Budget Ranges</span>
//             </button>
//             {openSections.budget && (
//               <div className="ml-7 space-y-2">
//                 {filterData.budget.map((budget) => (
//                   <button
//                     key={budget.name}
//                     onClick={() => handleFilterSelect('budget', budget.name, budget.count)}
//                     className={`w-full text-left px-3 py-1 rounded transition-colors ${
//                       isSelected('budget', budget.name)
//                         ? 'bg-blue-100 font-medium text-gray-900'
//                         : 'text-gray-600 hover:bg-gray-50'
//                     }`}
//                   >
//                     {budget.name} ({budget.count})
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Brands Section */}
//         <div className="mb-8">
//           <h3 className="text-lg font-bold text-gray-900 mb-4">BRANDS</h3>

//           <div className="space-y-3">
//             <button
//               onClick={() => toggleSection('brands')}
//               className="flex items-center w-full text-left"
//             >
//               <div className="w-4 h-4 border border-gray-400 mr-3 flex items-center justify-center">
//                 <div className={`w-2 h-0.5 bg-gray-600 transition-transform ${openSections.brands ? 'rotate-90' : ''}`}></div>
//               </div>
//               <span className="font-medium text-gray-900">All Brands</span>
//             </button>
//             {openSections.brands && (
//               <div className="ml-7 space-y-2 max-h-48 overflow-y-auto">
//                 {filterData.brands.map((brand) => (
//                   <button
//                     key={brand.name}
//                     onClick={() => handleFilterSelect('brands', brand.name, brand.count)}
//                     className={`w-full text-left px-3 py-1 rounded transition-colors ${
//                       isSelected('brands', brand.name)
//                         ? 'bg-blue-100 font-medium text-gray-900'
//                         : 'text-gray-600 hover:bg-gray-50'
//                     }`}
//                   >
//                     {brand.name} ({brand.count})
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Models Section */}
//         <div className="mb-8">
//           <h3 className="text-lg font-bold text-gray-900 mb-4">MODELS</h3>

//           <div className="space-y-3">
//             <button
//               onClick={() => toggleSection('models')}
//               className="flex items-center w-full text-left"
//             >
//               <div className="w-4 h-4 border border-gray-400 mr-3 flex items-center justify-center">
//                 <div className={`w-2 h-0.5 bg-gray-600 transition-transform ${openSections.models ? 'rotate-90' : ''}`}></div>
//               </div>
//               <span className="font-medium text-gray-900">All Models</span>
//             </button>
//             {openSections.models && (
//               <div className="ml-7 space-y-2 max-h-48 overflow-y-auto">
//                 {filterData.models.map((model) => (
//                   <button
//                     key={model.name}
//                     onClick={() => handleFilterSelect('models', model.name, model.count)}
//                     className={`w-full text-left px-3 py-1 rounded transition-colors ${
//                       isSelected('models', model.name)
//                         ? 'bg-blue-100 font-medium text-gray-900'
//                         : 'text-gray-600 hover:bg-gray-50'
//                     }`}
//                   >
//                     {model.name} ({model.count})
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Year Section */}
//         {/* <div className="mb-8">
//           <h3 className="text-lg font-bold text-gray-900 mb-4">YEAR</h3>

//           <div className="space-y-3">
//             <button
//               onClick={() => toggleSection('year')}
//               className="flex items-center w-full text-left"
//             >
//               <div className="w-4 h-4 border border-gray-400 mr-3 flex items-center justify-center">
//                 <div className={`w-2 h-0.5 bg-gray-600 transition-transform ${openSections.year ? 'rotate-90' : ''}`}></div>
//               </div>
//               <span className="font-medium text-gray-900">All Years</span>
//             </button>
//             {openSections.year && (
//               <div className="ml-7 space-y-2 max-h-48 overflow-y-auto">
//                 {filterData.year.map((year) => (
//                   <button
//                     key={year.name}
//                     onClick={() => handleFilterSelect('year', year.name, year.count)}
//                     className={`w-full text-left px-3 py-1 rounded transition-colors ${
//                       isSelected('year', year.name)
//                         ? 'bg-blue-100 font-medium text-gray-900'
//                         : 'text-gray-600 hover:bg-gray-50'
//                     }`}
//                   >
//                     {year.name} ({year.count})
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div> */}

//         {/* Fuel Type Section */}
//         {/* <div className="mb-8">
//           <h3 className="text-lg font-bold text-gray-900 mb-4">FUEL TYPE</h3>

//           <div className="space-y-3">
//             <button
//               onClick={() => toggleSection('fuelType')}
//               className="flex items-center w-full text-left"
//             >
//               <div className="w-4 h-4 border border-gray-400 mr-3 flex items-center justify-center">
//                 <div className={`w-2 h-0.5 bg-gray-600 transition-transform ${openSections.fuelType ? 'rotate-90' : ''}`}></div>
//               </div>
//               <span className="font-medium text-gray-900">All Fuel Types</span>
//             </button>
//             {openSections.fuelType && (
//               <div className="ml-7 space-y-2">
//                 {filterData.fuelType.map((fuel) => (
//                   <button
//                     key={fuel.name}
//                     onClick={() => handleFilterSelect('fuelType', fuel.name, fuel.count)}
//                     className={`w-full text-left px-3 py-1 rounded transition-colors ${
//                       isSelected('fuelType', fuel.name)
//                         ? 'bg-blue-100 font-medium text-gray-900'
//                         : 'text-gray-600 hover:bg-gray-50'
//                     }`}
//                   >
//                     {fuel.name} ({fuel.count})
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div> */}

//         {/* Clear Filters Button */}
//         {Object.values(selectedFilters).some(arr => arr.length > 0) && (
//           <div className="mt-8 pt-6 border-t border-gray-200">
//             <button
//               onClick={() => setSelectedFilters({
//                 categories: [],
//                 locations: [],
//                 budget: [],
//                 brands: [],
//                 models: [],
//                 year: [],
//                 fuelType: []
//               })}
//               className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors"
//             >
//               Clear All Filters
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FilterSidebar;


import React, { useState, useEffect } from 'react';

const FilterSidebar = ({ onFiltersChange, selectedFilters: parentFilters, className = "" }) => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    locations: false,
    budget: false,
    brands: false,
    models: false,
    year: false,
    fuelType: false
  });
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    locations: [],
    budget: [],
    brands: [],
    models: [],
    year: [],
    fuelType: []
  });

  // Sync with parent filters if provided
  useEffect(() => {
    if (parentFilters) {
      setSelectedFilters(parentFilters);
    }
  }, [parentFilters]);

  // Toggle section function
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle filter selection
  const handleFilterSelect = (section, value) => {
    setSelectedFilters(prev => {
      const currentSelection = prev[section];
      const isSelected = currentSelection.includes(value);
      const updatedSelection = isSelected
        ? currentSelection.filter(item => item !== value)
        : [...currentSelection, value];
      const updatedFilters = {
        ...prev,
        [section]: updatedSelection
      };

      // Callback to parent component
      if (onFiltersChange) {
        onFiltersChange(updatedFilters);
      }
      return updatedFilters;
    });
  };

  // Check if item is selected
  const isSelected = (section, value) => {
    return selectedFilters[section]?.includes(value);
  };

  // Static filter data
  const filterData = {
    categories: [
      { name: "All Categories", isParent: true },
      { name: "Bikes", isParent: true, children: [
        { name: "Motorcycles", count: "1,42,353", highlighted: true },
        { name: "Scooters", count: "46,780" },
        { name: "Sports Bikes", count: "25,450" },
        { name: "Cruisers", count: "18,230" },
        { name: "Adventure Bikes", count: "12,890" },
        { name: "Spare Parts", count: "5,818" }
      ]}
    ],
    locations: [
      { name: "India", highlighted: true, children: [
        { name: "Uttar Pradesh", count: "21,332" },
        { name: "Maharashtra", count: "15,167" },
        { name: "Tamil Nadu", count: "10,584" },
        { name: "Karnataka", count: "9,959" },
        { name: "Kerala", count: "9,819" },
        { name: "Telangana", count: "8,726" },
        { name: "West Bengal", count: "7,445" },
        { name: "Rajasthan", count: "6,234" },
        { name: "Gujarat", count: "5,890" },
        { name: "Punjab", count: "4,567" }
      ]}
    ],
    budget: [
      { name: "Under ₹50,000", count: "45,230" },
      { name: "₹50,000 - ₹1,00,000", count: "67,450" },
      { name: "₹1,00,000 - ₹2,00,000", count: "52,340" },
      { name: "₹2,00,000 - ₹3,00,000", count: "28,150" },
      { name: "₹3,00,000 - ₹5,00,000", count: "15,670" },
      { name: "Above ₹5,00,000", count: "8,920" }
    ],
    brands: [
      { name: "Honda", count: "25,340" },
      { name: "TVS", count: "22,150" },
      { name: "Bajaj", count: "20,890" },
      { name: "Hero", count: "18,760" },
      { name: "Royal Enfield", count: "15,450" },
      { name: "Yamaha", count: "12,230" },
      { name: "KTM", count: "8,670" },
      { name: "Suzuki", count: "7,450" },
      { name: "Kawasaki", count: "3,230" },
      { name: "Harley Davidson", count: "1,560" }
    ],
    models: [
      { name: "Activa", count: "18,450" },
      { name: "Classic 350", count: "12,340" },
      { name: "Pulsar", count: "15,670" },
      { name: "FZ Series", count: "9,870" },
      { name: "Duke Series", count: "7,450" },
      { name: "Splendor", count: "16,780" },
      { name: "Jupiter", count: "11,230" },
      { name: "Access", count: "8,560" }
    ],
    year: [
      { name: "2024", count: "5,230" },
      { name: "2023", count: "12,450" },
      { name: "2022", count: "18,670" },
      { name: "2021", count: "22,340" },
      { name: "2020", count: "25,780" },
      { name: "2019", count: "28,450" },
      { name: "2018", count: "24,560" },
      { name: "2017", count: "20,340" },
      { name: "2016", count: "15,670" },
      { name: "2015 & Below", count: "35,890" }
    ],
    fuelType: [
      { name: "Petrol", count: "1,85,450" },
      { name: "Electric", count: "12,340" },
      { name: "Hybrid", count: "2,450" },
      { name: "CNG", count: "890" }
    ]
  };

  return (
    <div className={`w-80 bg-white shadow-lg overflow-y-auto ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="mx-2">•</span>
            <span>Motorcycles</span>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">CATEGORIES</h3>
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('categories')}
              className="flex items-center w-full text-left"
            >
              <div className="w-4 h-4 border border-gray-400 mr-3 flex items-center justify-center">
                <div className={`w-2 h-0.5 bg-gray-600 transition-transform ${openSections.categories ? 'rotate-90' : ''}`}></div>
              </div>
              <span className="font-medium text-gray-900">All Categories</span>
            </button>

            {/* Sub-categories */}
            <div className="ml-7">
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 border border-gray-400 mr-3 flex items-center justify-center">
                    <div className={`w-2 h-0.5 bg-gray-600 transition-transform ${openSections.categories ? 'rotate-90' : ''}`}></div>
                  </div>
                  <span className="text-gray-600">Bikes</span>
                </div>
                {openSections.categories && (
                  <div className="ml-7 space-y-2">
                    {filterData.categories[1].children.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleFilterSelect('categories', item.name)}
                        className={`w-full text-left px-3 py-2 rounded transition-colors ${
                          item.highlighted || isSelected('categories', item.name)
                            ? 'bg-blue-100'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className={`${
                          item.highlighted || isSelected('categories', item.name)
                            ? 'font-medium text-gray-900'
                            : 'text-gray-600'
                        }`}>
                          {item.name} ({item.count})
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Locations Section */}
        {/* <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">LOCATIONS</h3>
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('locations')}
              className="flex items-center w-full text-left"
            >
              <div className="w-4 h-4 border border-gray-400 mr-3 flex items-center justify-center">
                <div className={`w-2 h-0.5 bg-gray-600 transition-transform ${openSections.locations ? 'rotate-90' : ''}`}></div>
              </div>
              <div className="bg-blue-100 px-3 py-2 rounded flex-1">
                <span className="font-medium text-gray-900">India</span>
              </div>
            </button>
            {openSections.locations && (
              <div className="ml-7 space-y-2">
                {filterData.locations[0].children.map((location) => (
                  <button
                    key={location.name}
                    onClick={() => handleFilterSelect('locations', location.name)}
                    className={`w-full text-left px-3 py-1 rounded transition-colors ${
                      isSelected('locations', location.name)
                        ? 'bg-blue-100 font-medium text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {location.name} ({location.count})
                  </button>
                ))}
              </div>
            )}
          </div>
        </div> */}

        {/* Filters Label */}
        <div className="mb-6">
          <h4 className="text-gray-500 font-medium">Filters</h4>
        </div>

        {/* Budget Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">BUDGET</h3>
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('budget')}
              className="flex items-center w-full text-left"
            >
              <div className="w-4 h-4 border border-gray-400 mr-3 flex items-center justify-center">
                <div className={`w-2 h-0.5 bg-gray-600 transition-transform ${openSections.budget ? 'rotate-90' : ''}`}></div>
              </div>
              <span className="font-medium text-gray-900">All Budget Ranges</span>
            </button>
            {openSections.budget && (
              <div className="ml-7 space-y-2">
                {filterData.budget.map((budget) => (
                  <button
                    key={budget.name}
                    onClick={() => handleFilterSelect('budget', budget.name)}
                    className={`w-full text-left px-3 py-1 rounded transition-colors ${
                      isSelected('budget', budget.name)
                        ? 'bg-blue-100 font-medium text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {budget.name} ({budget.count})
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Brands Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">BRANDS</h3>
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('brands')}
              className="flex items-center w-full text-left"
            >
              <div className="w-4 h-4 border border-gray-400 mr-3 flex items-center justify-center">
                <div className={`w-2 h-0.5 bg-gray-600 transition-transform ${openSections.brands ? 'rotate-90' : ''}`}></div>
              </div>
              <span className="font-medium text-gray-900">All Brands</span>
            </button>
            {openSections.brands && (
              <div className="ml-7 space-y-2 max-h-48 overflow-y-auto">
                {filterData.brands.map((brand) => (
                  <button
                    key={brand.name}
                    onClick={() => handleFilterSelect('brands', brand.name)}
                    className={`w-full text-left px-3 py-1 rounded transition-colors ${
                      isSelected('brands', brand.name)
                        ? 'bg-blue-100 font-medium text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {brand.name} ({brand.count})
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Models Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">MODELS</h3>
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('models')}
              className="flex items-center w-full text-left"
            >
              <div className="w-4 h-4 border border-gray-400 mr-3 flex items-center justify-center">
                <div className={`w-2 h-0.5 bg-gray-600 transition-transform ${openSections.models ? 'rotate-90' : ''}`}></div>
              </div>
              <span className="font-medium text-gray-900">All Models</span>
            </button>
            {openSections.models && (
              <div className="ml-7 space-y-2 max-h-48 overflow-y-auto">
                {filterData.models.map((model) => (
                  <button
                    key={model.name}
                    onClick={() => handleFilterSelect('models', model.name)}
                    className={`w-full text-left px-3 py-1 rounded transition-colors ${
                      isSelected('models', model.name)
                        ? 'bg-blue-100 font-medium text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {model.name} ({model.count})
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Clear Filters Button */}
        {Object.values(selectedFilters).some(arr => arr.length > 0) && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setSelectedFilters({
                  categories: [],
                  locations: [],
                  budget: [],
                  brands: [],
                  models: [],
                  year: [],
                  fuelType: []
                });
                if (onFiltersChange) {
                  onFiltersChange({
                    categories: [],
                    locations: [],
                    budget: [],
                    brands: [],
                    models: [],
                    year: [],
                    fuelType: []
                  });
                }
              }}
              className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;
