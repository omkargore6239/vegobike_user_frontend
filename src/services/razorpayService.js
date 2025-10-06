import axios from 'axios';

// API base URL - Update this to match your backend
const API_BASE_URL = 'http://localhost:8080';

class RazorpayService {
  /**
   * Confirm Razorpay Payment - Update booking with payment details
   * Matches backend: POST /payment/razorpay/confirm
   */
  async confirmPayment(orderId, paymentId, signature) {
    try {
      console.log('🔐 Confirming payment with backend...', { orderId, paymentId });
      
      const response = await axios.post(
        `${API_BASE_URL}/payment/razorpay/confirm`,
        null,
        {
          params: {
            orderId,
            paymentId,
            signature
          }
        }
      );

      console.log('✅ Payment confirmation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Payment confirmation error:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Open Razorpay Checkout Modal
   */
  openCheckout(razorpayOrderDetails, bookingData, user) {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        reject(new Error('Razorpay SDK not loaded. Please refresh the page.'));
        return;
      }

      // Parse Razorpay order details from backend
      let orderData;
      try {
        orderData = typeof razorpayOrderDetails === 'string' 
          ? JSON.parse(razorpayOrderDetails) 
          : razorpayOrderDetails;
      } catch (e) {
        console.error('Failed to parse Razorpay order:', e);
        console.error('Received data:', razorpayOrderDetails);
        reject(new Error('Invalid Razorpay order data'));
        return;
      }

      console.log('💳 Opening Razorpay checkout with order:', orderData);

      const options = {
        key: 'rzp_test_6iRE2VEfQ2p7qE', // Your Razorpay test key
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        order_id: orderData.id,
        name: 'VEGO Bike Rental',
        description: `Booking for ${bookingData.bikeName || 'Bike'}`,
        image: bookingData.bikeImage || '/logo192.png',
        
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || user?.mobile || '',
        },
        
        notes: {
          bikeId: bookingData.bikeId,
          bikeName: bookingData.bikeName,
          bookingDate: new Date().toISOString(),
        },
        
        theme: {
          color: '#1E40AF',
        },

        handler: function (response) {
          console.log('💰 Payment successful:', response);
          resolve({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
        },

        modal: {
          ondismiss: function () {
            console.log('❌ Payment modal dismissed by user');
            reject(new Error('Payment cancelled by user'));
          },
          escape: true,
          backdropclose: false,
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', function (response) {
        console.error('❌ Payment failed:', response.error);
        reject({
          code: response.error.code,
          description: response.error.description,
          source: response.error.source,
          step: response.error.step,
          reason: response.error.reason,
        });
      });

      razorpay.open();
    });
  }
}

export const razorpayService = new RazorpayService();
