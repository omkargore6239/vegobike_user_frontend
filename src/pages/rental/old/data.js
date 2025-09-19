// src/pages/rental/data.js

export const LOCATIONS = [
  { id: "mumbai", name: "Mumbai" },
  { id: "pune", name: "Pune" },
  { id: "nashik", name: "Nashik" },
  { id: "nagpur", name: "Nagpur" },
  { id: "aurangabad", name: "Aurangabad" },
  { id: "kolhapur", name: "Kolhapur" }
];

export const STORES = [
  // Mumbai Stores
  { id: "mumbai-1", name: "Andheri Hub", address: "Near Metro Station, Andheri East", cityId: "mumbai", bikes: 45 },
  { id: "mumbai-2", name: "Bandra Center", address: "Linking Road, Bandra West", cityId: "mumbai", bikes: 38 },
  { id: "mumbai-3", name: "Powai Junction", address: "Hiranandani, Powai", cityId: "mumbai", bikes: 32 },
  
  // Pune Stores
  { id: "pune-1", name: "Koregaon Park Hub", address: "North Main Road, Koregaon Park", cityId: "pune", bikes: 28 },
  { id: "pune-2", name: "Hinjewadi Center", address: "Phase 1, Hinjewadi IT Park", cityId: "pune", bikes: 35 },
  
  // Other Cities
  { id: "nashik-1", name: "City Center Hub", address: "Main Road, Nashik Road", cityId: "nashik", bikes: 20 },
  { id: "nagpur-1", name: "Sitabuldi Hub", address: "Central Nagpur, Sitabuldi", cityId: "nagpur", bikes: 22 },
  { id: "aurangabad-1", name: "CIDCO Hub", address: "CIDCO Area, Aurangabad", cityId: "aurangabad", bikes: 15 },
  { id: "kolhapur-1", name: "Mahadwar Hub", address: "Near Palace, Mahadwar Road", cityId: "kolhapur", bikes: 12 }
];

export const BIKES = [
  // Mumbai - Andheri Hub Bikes
  {
    id: "bk-mum-001",
    company: "Honda",
    name: "Activa 6G",
    number: "MH-01 AB 1234",
    location: "mumbai",
    storeId: "mumbai-1",
    store_address: "Near Metro Station, Andheri East",
    pricePerHour: 85,
    rating: 4.5,
    packages: {
      "1_day": 850,
      "7_days": 4200,
      "15_days": 5800,
      "30_days": 8500
    },
    refundable_deposit: 1000,
    features: ["Automatic", "Good Mileage", "Storage Space"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "bk-mum-002",
    company: "Yamaha",
    name: "FZ-S V3",
    number: "MH-01 CD 5678",
    location: "mumbai",
    storeId: "mumbai-1",
    store_address: "Near Metro Station, Andheri East",
    pricePerHour: 125,
    rating: 4.7,
    packages: {
      "1_day": 1200,
      "7_days": 5600,
      "15_days": 7800,
      "30_days": 12000
    },
    refundable_deposit: 1500,
    features: ["LED Headlamp", "Digital Console", "Single Channel ABS"],
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "bk-mum-003",
    company: "Royal Enfield",
    name: "Classic 350",
    number: "MH-01 EF 9876",
    location: "mumbai",
    storeId: "mumbai-1",
    store_address: "Near Metro Station, Andheri East",
    pricePerHour: 180,
    rating: 4.8,
    packages: {
      "1_day": 1800,
      "7_days": 8400,
      "15_days": 12000,
      "30_days": 18000
    },
    refundable_deposit: 2000,
    features: ["Classic Design", "Powerful Engine", "Comfortable Ride"],
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },

  // Mumbai - Bandra Center Bikes
  {
    id: "bk-mum-004",
    company: "KTM",
    name: "Duke 200",
    number: "MH-02 GH 3456",
    location: "mumbai",
    storeId: "mumbai-2",
    store_address: "Linking Road, Bandra West",
    pricePerHour: 200,
    rating: 4.9,
    packages: {
      "1_day": 2000,
      "7_days": 9500,
      "15_days": 13500,
      "30_days": 20000
    },
    refundable_deposit: 2500,
    features: ["High Performance", "Sporty Design", "Advanced Braking"],
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "bk-mum-005",
    company: "Bajaj",
    name: "Pulsar NS 200",
    number: "MH-02 IJ 7890",
    location: "mumbai",
    storeId: "mumbai-2",
    store_address: "Linking Road, Bandra West",
    pricePerHour: 160,
    rating: 4.6,
    packages: {
      "1_day": 1600,
      "7_days": 7500,
      "15_days": 10500,
      "30_days": 16000
    },
    refundable_deposit: 2000,
    features: ["Liquid Cooled", "Digital Display", "Perimeter Frame"],
    image: "https://images.unsplash.com/photo-1547549082-6bc09adbf607?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },

  // Mumbai - Powai Junction Bikes
  {
    id: "bk-mum-006",
    company: "TVS",
    name: "Apache RTR 160",
    number: "MH-03 KL 1357",
    location: "mumbai",
    storeId: "mumbai-3",
    store_address: "Hiranandani, Powai",
    pricePerHour: 140,
    rating: 4.5,
    packages: {
      "1_day": 1400,
      "7_days": 6500,
      "15_days": 9200,
      "30_days": 14000
    },
    refundable_deposit: 1800,
    features: ["Race Tuned Fuel Injection", "Glide Through Traffic Technology", "LED DRL"],
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },

  // Pune - Koregaon Park Hub Bikes
  {
    id: "bk-pun-001",
    company: "Honda",
    name: "CB Shine",
    number: "MH-12 MN 2468",
    location: "pune",
    storeId: "pune-1",
    store_address: "North Main Road, Koregaon Park",
    pricePerHour: 95,
    rating: 4.4,
    packages: {
      "1_day": 950,
      "7_days": 4500,
      "15_days": 6300,
      "30_days": 9500
    },
    refundable_deposit: 1200,
    features: ["Fuel Efficient", "Comfortable Seating", "Easy Handling"],
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "bk-pun-002",
    company: "Yamaha",
    name: "MT-15",
    number: "MH-12 OP 3579",
    location: "pune",
    storeId: "pune-1",
    store_address: "North Main Road, Koregaon Park",
    pricePerHour: 165,
    rating: 4.8,
    packages: {
      "1_day": 1650,
      "7_days": 7800,
      "15_days": 11000,
      "30_days": 16500
    },
    refundable_deposit: 2000,
    features: ["VVA Technology", "Assist & Slipper Clutch", "LED Lighting"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },

  // Pune - Hinjewadi Center Bikes
  {
    id: "bk-pun-003",
    company: "Suzuki",
    name: "Gixxer SF 250",
    number: "MH-12 QR 4680",
    location: "pune",
    storeId: "pune-2",
    store_address: "Phase 1, Hinjewadi IT Park",
    pricePerHour: 175,
    rating: 4.7,
    packages: {
      "1_day": 1750,
      "7_days": 8200,
      "15_days": 11500,
      "30_days": 17500
    },
    refundable_deposit: 2200,
    features: ["Oil Cooled Engine", "Full Fairing", "Digital Cluster"],
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "bk-pun-004",
    company: "Hero",
    name: "Xpulse 200",
    number: "MH-12 ST 5791",
    location: "pune",
    storeId: "pune-2",
    store_address: "Phase 1, Hinjewadi IT Park",
    pricePerHour: 155,
    rating: 4.6,
    packages: {
      "1_day": 1550,
      "7_days": 7300,
      "15_days": 10200,
      "30_days": 15500
    },
    refundable_deposit: 1900,
    features: ["Adventure Ready", "LED Headlamp", "Long Travel Suspension"],
    image: "https://images.unsplash.com/photo-1547549082-6bc09adbf607?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },

  // Nashik Bikes
  {
    id: "bk-nas-001",
    company: "Honda",
    name: "Activa 5G",
    number: "MH-15 UV 6802",
    location: "nashik",
    storeId: "nashik-1",
    store_address: "Main Road, Nashik Road",
    pricePerHour: 80,
    rating: 4.3,
    packages: {
      "1_day": 800,
      "7_days": 3800,
      "15_days": 5300,
      "30_days": 8000
    },
    refundable_deposit: 1000,
    features: ["Automatic", "Fuel Efficient", "Comfortable"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "bk-nas-002",
    company: "Bajaj",
    name: "Pulsar 150",
    number: "MH-15 WX 7913",
    location: "nashik",
    storeId: "nashik-1",
    store_address: "Main Road, Nashik Road",
    pricePerHour: 120,
    rating: 4.5,
    packages: {
      "1_day": 1200,
      "7_days": 5600,
      "15_days": 7800,
      "30_days": 12000
    },
    refundable_deposit: 1500,
    features: ["Twin Spark Technology", "Nitrox Suspension", "Electric Start"],
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },

  // Nagpur Bikes
  {
    id: "bk-nag-001",
    company: "TVS",
    name: "Jupiter",
    number: "MH-31 YZ 8024",
    location: "nagpur",
    storeId: "nagpur-1",
    store_address: "Central Nagpur, Sitabuldi",
    pricePerHour: 85,
    rating: 4.4,
    packages: {
      "1_day": 850,
      "7_days": 4000,
      "15_days": 5600,
      "30_days": 8500
    },
    refundable_deposit: 1100,
    features: ["External Fuel Fill", "Large Storage", "Comfortable Ride"],
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "bk-nag-002",
    company: "Hero",
    name: "Splendor Plus",
    number: "MH-31 AB 9135",
    location: "nagpur",
    storeId: "nagpur-1",
    store_address: "Central Nagpur, Sitabuldi",
    pricePerHour: 90,
    rating: 4.2,
    packages: {
      "1_day": 900,
      "7_days": 4200,
      "15_days": 5900,
      "30_days": 9000
    },
    refundable_deposit: 1200,
    features: ["Fuel Efficient", "Easy Maintenance", "Reliable"],
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },

  // Aurangabad Bikes
  {
    id: "bk-aur-001",
    company: "Honda",
    name: "Unicorn 160",
    number: "MH-20 CD 0246",
    location: "aurangabad",
    storeId: "aurangabad-1",
    store_address: "CIDCO Area, Aurangabad",
    pricePerHour: 110,
    rating: 4.5,
    packages: {
      "1_day": 1100,
      "7_days": 5200,
      "15_days": 7300,
      "30_days": 11000
    },
    refundable_deposit: 1400,
    features: ["Honda Eco Technology", "CBS", "Tubeless Tyres"],
    image: "https://images.unsplash.com/photo-1547549082-6bc09adbf607?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "bk-aur-002",
    company: "Yamaha",
    name: "Fascino 125",
    number: "MH-20 EF 1357",
    location: "aurangabad",
    storeId: "aurangabad-1",
    store_address: "CIDCO Area, Aurangabad",
    pricePerHour: 95,
    rating: 4.3,
    packages: {
      "1_day": 950,
      "7_days": 4500,
      "15_days": 6300,
      "30_days": 9500
    },
    refundable_deposit: 1200,
    features: ["Hybrid Technology", "Side Stand Engine Cut Off", "Smart Key System"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },

  // Kolhapur Bikes
  {
    id: "bk-kol-001",
    company: "Bajaj",
    name: "Platina 110",
    number: "MH-09 GH 2468",
    location: "kolhapur",
    storeId: "kolhapur-1",
    store_address: "Near Palace, Mahadwar Road",
    pricePerHour: 85,
    rating: 4.1,
    packages: {
      "1_day": 850,
      "7_days": 4000,
      "15_days": 5600,
      "30_days": 8500
    },
    refundable_deposit: 1100,
    features: ["ComforTec Technology", "Anti-skid Seat", "Long Seat"],
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "bk-kol-002",
    company: "TVS",
    name: "Star City Plus",
    number: "MH-09 IJ 3579",
    location: "kolhapur",
    storeId: "kolhapur-1",
    store_address: "Near Palace, Mahadwar Road",
    pricePerHour: 90,
    rating: 4.2,
    packages: {
      "1_day": 900,
      "7_days": 4200,
      "15_days": 5900,
      "30_days": 9000
    },
    refundable_deposit: 1200,
    features: ["Econometer", "Synchronized Braking Technology", "Mobile Charging Port"],
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  }
];

// Utility functions
export const getBikesByLocation = (locationId) => {
  return BIKES.filter(bike => bike.location === locationId);
};

export const getBikesByStore = (storeId) => {
  return BIKES.filter(bike => bike.storeId === storeId);
};

export const getStoresByLocation = (locationId) => {
  return STORES.filter(store => store.cityId === locationId);
};

export const getBikeById = (bikeId) => {
  return BIKES.find(bike => bike.id === bikeId);
};

export const getStoreById = (storeId) => {
  return STORES.find(store => store.id === storeId);
};

export const getLocationById = (locationId) => {
  return LOCATIONS.find(location => location.id === locationId);
};

// Filter functions
export const filterBikes = (filters = {}) => {
  let filteredBikes = [...BIKES];

  if (filters.location) {
    filteredBikes = filteredBikes.filter(bike => bike.location === filters.location);
  }

  if (filters.storeId) {
    filteredBikes = filteredBikes.filter(bike => bike.storeId === filters.storeId);
  }

  if (filters.company) {
    filteredBikes = filteredBikes.filter(bike => bike.company === filters.company);
  }

  if (filters.minPrice) {
    filteredBikes = filteredBikes.filter(bike => bike.pricePerHour >= filters.minPrice);
  }

  if (filters.maxPrice) {
    filteredBikes = filteredBikes.filter(bike => bike.pricePerHour <= filters.maxPrice);
  }

  if (filters.minRating) {
    filteredBikes = filteredBikes.filter(bike => bike.rating >= filters.minRating);
  }

  return filteredBikes;
};

// Constants for dropdowns/filters
export const BIKE_COMPANIES = ["Honda", "Yamaha", "KTM", "Bajaj", "Royal Enfield", "TVS", "Suzuki", "Hero"];
export const PACKAGE_TYPES = ["1_day", "7_days", "15_days", "30_days"];
