import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6 border-b pb-4">
            Refund Policy
          </h1>

          <div className="space-y-6 text-gray-700 text-sm sm:text-base">
            {/* Section 1 */}
            <div className="border-b pb-6">
              <h2 className="font-semibold text-lg mb-3 text-gray-900">1. Eligibility for Refunds</h2>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                  <span className="font-medium">Cancellation of Reservation:</span> If you cancel a reservation made 
                  through our mobile app before the start time of the rental period, you may be eligible for a refund. 
                  The refund amount will depend on our cancellation policy.
                </li>
                <li>
                  <span className="font-medium">Technical Issues:</span> If technical issues within the app prevent 
                  service usage, contact support. Refunds issued after investigation.
                </li>
                <li>
                  <span className="font-medium">Billing Errors:</span> Report incorrect charges immediately for resolution.
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="border-b pb-6">
              <h2 className="font-semibold text-lg mb-3 text-gray-900">2. Refund Processing Time</h2>
              <p className="mb-2">
                Refunds processed within <strong>2 business days</strong> of approval. Processing times vary by payment method.
              </p>
              <p className="text-sm bg-gray-50 p-3 rounded">
                <strong>Note for card payments:</strong> May take 2+ days to appear in your account depending on issuer.
              </p>
            </div>

            {/* Section 3 */}
            <div className="border-b pb-6">
              <h2 className="font-semibold text-lg mb-3 text-gray-900">3. Non-Refundable Items</h2>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Active rental periods</li>
                <li>Charges from Terms of Service violations</li>
                <li>Third-party service fees (helmets, accessories)</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="font-semibold text-lg mb-3 text-gray-900">4. Contact Us</h2>
              <p className="mb-2">
                For refund inquiries or assistance, contact support via app or email:
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <a href="mailto:vegobike@gmail.com" className="text-blue-600 font-medium">
                  vegobike@gmail.com
                </a>
                <p className="text-sm mt-2 text-gray-600">Typically responds within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </main>


    </div>
  );
};

export default RefundPolicy;