import React from 'react';
import { CheckCircle } from 'lucide-react';

const TermsAndConditions = () => {
  const terms = ["The Responsibility of the vehicle will remain with the customer from the time of taking the vehicle from the company to the time of leaving the vehicle in the company.",
  "If there is any major, the bike will be cleared in insurance.",
  "The bike should be in the same condition as when it was taken.",
  "Since the vehicle has a GPS tracker, the customer will immediately notice wherever the vehicle goes.",
  "Once the bike has been booked, if the customer does not come to pick up the bike within the stipulated time or if the booking is cancelled, the booking amount will not be refunded.",
  "If the bike does not return within the given time, the company may charge extra charges.",
  "If the customer wants to extend the term, the customer should inform the company one day before the expiry of the term.",
  "If the bike is left outdoors, it is the customer’s responsibility to return the bike to the company in the condition in which it was taken.",
  "If the customer leaves the bike in closed condition at the location, the deposit and rent will not be returned, and the company will take legal action against the customer.",
  "If the customer returns the bike before the tenure ends, the rent for the remaining days will not be refunded, only the deposit will be refunded.",
  "The case of damage to the two-wheeler on rent due to accident, mishandling, carelessness—appropriate charges will be calculated by the company and the customer is liable to pay.",
  "In case of minor damages to the helmet. The customer is liable to pay a fine as per vendor.",
  "If the user damages the vehicles or gets a traffic challan, the money will be deducted from the deposited amount.",
  "When the customer takes the bike for rent, there is enough petrol to go from go down to the petrol pump. When the customer returns the vehicle to the company, it is mandatory to keep enough petrol for the vehicle to reach the pump again.",
  "The deposit amount will be given to the customer within 24 hours after checking the vehicle Traffic challan.",
  "When the customer parks the vehicle in no parking, travels with a triple seat or drives on the wrong side, then the customer is required to pay traffic toll fines."
];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
     
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-8 border-b pb-4">
            Terms & Conditions
          </h1>

          <ul className="space-y-6">
            {terms.map((term, index) => (
              <li 
                key={index} 
                className="flex items-start space-x-4 pb-6 border-b last:border-b-0 last:pb-0"
              >
                <CheckCircle className="text-blue-500 mt-1 w-5 h-5 flex-shrink-0" />
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {term}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </main>

    </div>
  );
};

export default TermsAndConditions;