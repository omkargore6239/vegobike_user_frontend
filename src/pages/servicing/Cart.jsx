// src/pages/Cart.jsx
import PageLayout from "../../components/servicing/layout/PageLayout";
import { Link } from "react-router-dom";

const Cart = () => {
  return (
    <PageLayout>
      <div className="responsive-padding bg-background min-h-[calc(100vh-160px)]">
        <div className="container mx-auto max-w-4xl py-8 md:py-12">
          <div className="text-center">
            <h1 className="h1 mb-4 md:mb-6">Your Cart</h1>
            <p className="text-subText mb-6 md:mb-8 text-lg">
              Your cart is currently empty.
            </p>
            <Link 
              to="/services" 
              className="btn btn-primary px-8 py-3 text-lg inline-flex items-center gap-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Cart;