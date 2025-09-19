export const cities = [
  'Mumbai',
  'Delhi', 
  'Bangalore',
  'Pune',
  'Chennai',
  'Hyderabad',
  'Ahmedabad',
  'Kolkata',
  'Surat',
  'Jaipur',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Thane',
  'Bhopal',
  'Visakhapatnam',
  'Pimpri-Chinchwad',
  'Patna',
  'Vadodara',
  'Ghaziabad',
  'Ludhiana',
  'Agra',
  'Nashik',
  'Faridabad',
  'Meerut',
  'Rajkot',
  'Kalyan-Dombivli',
  'Vasai-Virar',
  'Varanasi'
];

export const states = [
  'Andhra Pradesh',
  'Arunachal Pradesh', 
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

export const locations = {
  'Mumbai': {
    state: 'Maharashtra',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    areas: ['Andheri', 'Bandra', 'Borivali', 'Thane', 'Navi Mumbai', 'Powai', 'Malad', 'Goregaon']
  },
  'Delhi': {
    state: 'Delhi',
    coordinates: { lat: 28.7041, lng: 77.1025 },
    areas: ['Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'Dwarka', 'Rohini', 'Janakpuri', 'Saket', 'Vasant Kunj']
  },
  'Bangalore': {
    state: 'Karnataka', 
    coordinates: { lat: 12.9716, lng: 77.5946 },
    areas: ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'HSR Layout', 'BTM Layout', 'Jayanagar', 'Malleshwaram']
  },
  'Pune': {
    state: 'Maharashtra',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    areas: ['Hinjewadi', 'Baner', 'Wakad', 'Kothrud', 'Deccan', 'Camp', 'Hadapsar', 'Magarpatta']
  },
  'Chennai': {
    state: 'Tamil Nadu',
    coordinates: { lat: 13.0827, lng: 80.2707 },
    areas: ['T. Nagar', 'Adyar', 'Velachery', 'Anna Nagar', 'OMR', 'Porur', 'Tambaram', 'Chrompet']
  },
  'Hyderabad': {
    state: 'Telangana',
    coordinates: { lat: 17.3850, lng: 78.4867 },
    areas: ['Madhapur', 'Gachibowli', 'Kondapur', 'Kukatpally', 'Secunderabad', 'Dilsukhnagar', 'Ameerpet', 'Begumpet']
  }
};

export const serviceAreas = [
  {
    city: 'Mumbai',
    areas: [
      { name: 'South Mumbai', pincode: '400001' },
      { name: 'Bandra West', pincode: '400050' },
      { name: 'Andheri West', pincode: '400058' },
      { name: 'Borivali West', pincode: '400092' },
      { name: 'Thane West', pincode: '400601' }
    ]
  },
  {
    city: 'Delhi',
    areas: [
      { name: 'Central Delhi', pincode: '110001' },
      { name: 'South Delhi', pincode: '110024' },
      { name: 'West Delhi', pincode: '110015' },
      { name: 'North Delhi', pincode: '110007' },
      { name: 'East Delhi', pincode: '110051' }
    ]
  },
  {
    city: 'Bangalore', 
    areas: [
      { name: 'Koramangala', pincode: '560034' },
      { name: 'Indiranagar', pincode: '560038' },
      { name: 'Whitefield', pincode: '560066' },
      { name: 'Electronic City', pincode: '560100' },
      { name: 'HSR Layout', pincode: '560102' }
    ]
  },
  {
    city: 'Pune',
    areas: [
      { name: 'Hinjewadi', pincode: '411057' },
      { name: 'Baner', pincode: '411045' },
      { name: 'Kothrud', pincode: '411038' },
      { name: 'Deccan', pincode: '411004' },
      { name: 'Hadapsar', pincode: '411028' }
    ]
  }
];

export default {
  cities,
  states, 
  locations,
  serviceAreas
};
