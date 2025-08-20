import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { LockClosedIcon, ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { FormErrors, validateForm, hasErrors } from '../utils/formValidation';

interface FormData {
  email: string;
  name: string;
  address: string;
  city: string;
  paymentMethod: 'credit' | 'paypal';
}

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, itemCount, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState<'shipping' | 'payment'>('shipping');
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    address: '',
    city: '',
    paymentMethod: 'credit'
  });
  
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (itemCount === 0) navigate('/cart');
  }, [itemCount, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const fieldValue = type === 'radio' ? (e.target as HTMLInputElement).value : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));
    
    // Validate the field if it's been touched
    if (touched[name]) {
      const fieldErrors = validateForm({ [name]: fieldValue }, [name]);
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors[name]
      }));
    }
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Mark the field as touched
    if (!touched[name]) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
      
      // Validate the field when it loses focus
      const fieldErrors = validateForm({ [name]: value }, [name]);
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors[name]
      }));
    }
  };

  const validateStep = useCallback((step: 'shipping' | 'payment'): boolean => {
    const fieldsToValidate = step === 'shipping' 
      ? ['email', 'name', 'address', 'city'] 
      : ['paymentMethod'];
    
    // Mark all fields as touched
    const newTouched = { ...touched };
    fieldsToValidate.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);
    
    // Validate the form
    const newErrors = validateForm(formData, fieldsToValidate);
    setErrors(newErrors);
    
    return !hasErrors(newErrors);
  }, [formData, touched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeStep === 'shipping') {
      if (validateStep('shipping')) {
        setActiveStep('payment');
        window.scrollTo(0, 0);
      } else {
        // Focus the first error
        const firstError = document.querySelector('[aria-invalid="true"]') as HTMLElement;
        if (firstError) {
          firstError.focus();
        }
      }
      return;
    }
    
    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await clearCart();
      navigate('/checkout/success', { 
        state: { 
          orderNumber: `#${Math.floor(100000 + Math.random() * 900000)}`,
          email: formData.email,
          items,
          total: totalPrice + 5
        } 
      });
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions for form validation UI
  const hasError = (field: string): boolean => {
    return Boolean(touched[field] && errors[field]);
  };

  const getError = (field: string): string | null => {
    return touched[field] ? errors[field] : null;
  };

  // Handle form field focus for better screen reader announcements
  const announceField = (fieldName: string) => {
    const message = `Now editing ${fieldName}`;
    const liveRegion = document.getElementById('form-announcement');
    if (liveRegion) {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Live region for form announcements */}
      <div 
        id="form-announcement"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      ></div>
      
      <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
          {activeStep === 'shipping' ? 'Shipping Information' : 'Payment Method'}
        </h1>
        
        <form 
          onSubmit={handleSubmit} 
          className="lg:grid lg:grid-cols-2 lg:gap-x-12"
          aria-label={`${activeStep === 'shipping' ? 'Shipping' : 'Payment'} form`}
        >
          <div className="lg:col-span-1">
            {activeStep === 'shipping' ? (
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    autoComplete="email"
                    aria-required="true"
                    className={`mt-1 block w-full rounded-md ${hasError('email') ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} shadow-sm sm:text-sm`}
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={() => announceField('email')}
                    aria-invalid={hasError('email')}
                    aria-describedby={hasError('email') ? 'email-error' : 'email-description'}
                  />
                  {hasError('email') ? (
                    <p className="mt-2 text-sm text-red-600" id="email-error">
                      {getError('email')}
                    </p>
                  ) : (
                    <p id="email-description" className="mt-1 text-sm text-gray-500">
                      We'll send your order confirmation here
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    aria-required="true"
                    onFocus={() => announceField('full name')}
                    required
                    className={`mt-1 block w-full rounded-md ${hasError('name') ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} shadow-sm sm:text-sm`}
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={hasError('name')}
                    aria-describedby={hasError('name') ? 'name-error' : undefined}
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    autoComplete="street-address"
                    aria-required="true"
                    onFocus={() => announceField('street address')}
                    required
                    className={`mt-1 block w-full rounded-md ${hasError('address') ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} shadow-sm sm:text-sm`}
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={hasError('address')}
                    aria-describedby={hasError('address') ? 'address-error' : undefined}
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    autoComplete="address-level2"
                    aria-required="true"
                    onFocus={() => announceField('city')}
                    required
                    className={`mt-1 block w-full rounded-md ${hasError('city') ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} shadow-sm sm:text-sm`}
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={hasError('city')}
                    aria-describedby={hasError('city') ? 'city-error' : undefined}
                  />
                </div>
              </div>
            ) : (
              <fieldset className="mt-6">
                <legend className="text-lg font-medium text-gray-900">
                  Payment method
                </legend>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="credit"
                      name="paymentMethod"
                      type="radio"
                      value="credit"
                      checked={formData.paymentMethod === 'credit'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={hasError('paymentMethod')}
                      aria-describedby={`credit-description ${hasError('paymentMethod') ? 'payment-method-error' : ''}`}
                      className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <label htmlFor="credit" className="block text-sm font-medium text-gray-700">
                        Credit Card
                      </label>
                      <p id="credit-description" className={`text-sm ${hasError('paymentMethod') ? 'text-red-600' : 'text-gray-500'}`}>
                        Pay with your credit card
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="paypal"
                      name="paymentMethod"
                      type="radio"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={hasError('paymentMethod')}
                      aria-describedby={`paypal-description ${hasError('paymentMethod') ? 'payment-method-error' : ''}`}
                      className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <label htmlFor="paypal" className="block text-sm font-medium text-gray-700">
                        PayPal
                      </label>
                      <p id="paypal-description" className={`text-sm ${hasError('paymentMethod') ? 'text-red-600' : 'text-gray-500'}`}>
                        Pay with PayPal
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>
            )}
            
            <div className="mt-8 flex justify-between">
              {activeStep === 'payment' ? (
                <button
                  type="button"
                  onClick={() => setActiveStep('shipping')}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  &larr; Back to shipping
                </button>
              ) : (
                <div />
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : activeStep === 'shipping' ? (
                  'Continue to payment'
                ) : (
                  'Pay now'
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-10 lg:mt-0">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
            
            <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={`${item.id}-${item.selectedSize}`} className="flex py-6 px-4 sm:px-6">
                    <div className="flex-shrink-0">
                      <img
                        src={item.image_path || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-20 rounded-md"
                      />
                    </div>
                    
                    <div className="ml-6 flex-1">
                      <div className="flex">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {item.name}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            Qty {item.quantity}
                            {item.selectedSize && ` • Size: ${item.selectedSize}`}
                          </p>
                        </div>
                        
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            ${((item.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>${totalPrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt  -1">
                  <p>Shipping</p>
                  <p>$5.00</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900 mt-4 pt-4 border-t border-gray-200">
                  <p>Total</p>
                  <p>${(totalPrice + 5).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
