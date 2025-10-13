import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Building, MapPin, DollarSign, Calendar, User, Phone, Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const PaymentForm = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    payment_method: 'card',
    transaction_id: '',
    payment_notes: '',
    // Rent specific fields
    rent_id: '',
    installment_number: 1,
    due_date: '',
    payment_type: 'installment'
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchPropertyDetails();
  }, [propertyId, user]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/properties/${propertyId}/payment-details`);
      
      if (response.data.status === 'success') {
        const propertyData = response.data.data.property;
        setProperty(response.data.data);
        
        // Set default amount to property price
        setPaymentForm(prev => ({
          ...prev,
          amount: propertyData.price,
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
        }));
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
      setSubmitStatus({ type: 'error', message: 'Failed to load property details' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitStatus(null);

      const response = await api.post(`/properties/${propertyId}/payment`, paymentForm);

      if (response.data.status === 'success') {
        const paymentData = response.data.data;
        
        let successMessage = `${property.payment_type === 'purchase' ? 'Purchase' : 'Rent'} payment submitted successfully!`;
        
        // Add payment summary for sale properties
        if (paymentData.payment_summary) {
          const summary = paymentData.payment_summary;
          successMessage += `\n\nPayment Summary:`;
          successMessage += `\n• Current Payment: $${summary.current_payment?.toLocaleString()}`;
          successMessage += `\n• Total Paid: $${summary.total_paid_now?.toLocaleString()}`;
          successMessage += `\n• Remaining: $${summary.remaining_amount?.toLocaleString()}`;
          successMessage += `\n• Progress: ${summary.payment_progress?.toFixed(1)}%`;
          
          if (summary.is_fully_paid) {
            successMessage += `\n\n🎉 Property is now fully paid!`;
          }
        }
        
        successMessage += `\n\nTransaction ID: ${paymentData.payment?.transaction_id || paymentData.transaction_id}`;
        
        setSubmitStatus({ 
          type: 'success', 
          message: successMessage,
          paymentSummary: paymentData.payment_summary
        });
        
        // Reset form
        setPaymentForm({
          amount: property.property.price,
          payment_method: 'card',
          transaction_id: '',
          payment_notes: '',
          rent_id: '',
          installment_number: 1,
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          payment_type: 'installment'
        });

        // Trigger storage event to refresh other components
        localStorage.setItem('payment_updated', Date.now().toString());
        window.dispatchEvent(new Event('storage'));

        // Redirect to profile after 3 seconds
        setTimeout(() => {
          navigate('/user/profile');
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to submit payment. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/properties')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(`/properties/${propertyId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Property
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {property.payment_type === 'purchase' ? 'Purchase' : 'Rent'} Payment
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Property Summary</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img 
                  src={property.property.pimage ? `http://localhost:8000/${property.property.pimage}` : '/assets/placeholder.jpg'} 
                  alt={property.property.title}
                  className="w-20 h-20 rounded-lg object-cover"
                  onError={(e) => { e.target.src = '/assets/placeholder.jpg'; }}
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{property.property.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{property.property.location}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Property ID:</span>
                    <p className="font-bold">{property.property.pid}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <p className="font-bold capitalize">{property.property.stype}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Price:</span>
                    <p className="font-bold text-green-600">${property.property.price?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment Type:</span>
                    <p className="font-bold capitalize">{property.payment_type}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Details</h2>

            {submitStatus && (
              <div className={`mb-6 p-4 rounded-lg ${
                submitStatus.type === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start gap-3">
                  {submitStatus.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className={`text-sm ${submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                      {submitStatus.message.split('\n').map((line, index) => (
                        <div key={index} className={index > 0 ? 'mt-1' : ''}>
                          {line}
                        </div>
                      ))}
                    </div>
                    
                    {/* Payment Summary Display */}
                    {submitStatus.paymentSummary && (
                      <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                        <h4 className="font-medium text-green-900 mb-2">Payment Summary</h4>
                        <div className="space-y-1 text-sm text-green-800">
                          <div className="flex justify-between">
                            <span>Property Price:</span>
                            <span className="font-medium">${submitStatus.paymentSummary.total_property_price?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Current Payment:</span>
                            <span className="font-medium text-blue-600">${submitStatus.paymentSummary.current_payment?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Paid:</span>
                            <span className="font-medium text-green-600">${submitStatus.paymentSummary.total_paid_now?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Remaining:</span>
                            <span className={`font-medium ${submitStatus.paymentSummary.remaining_amount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                              ${submitStatus.paymentSummary.remaining_amount?.toLocaleString()}
                            </span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Payment Progress</span>
                              <span>{submitStatus.paymentSummary.payment_progress?.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(100, submitStatus.paymentSummary.payment_progress || 0)}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          {submitStatus.paymentSummary.is_fully_paid && (
                            <div className="mt-3 p-2 bg-green-100 rounded-lg text-center">
                              <span className="text-green-800 font-medium">🎉 Property Fully Paid!</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {submitStatus.type === 'success' && (
                      <div className="mt-3 text-xs text-green-600">
                        Redirecting to your profile in 5 seconds...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    name="amount"
                    value={paymentForm.amount}
                    onChange={handleInputChange}
                    min="0.01"
                    step="0.01"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                  name="payment_method"
                  value={paymentForm.payment_method}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="transaction_id"
                  value={paymentForm.transaction_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your payment transaction ID"
                />
              </div>

              {/* Rent-specific fields */}
              {property.payment_type === 'rent' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Installment Number *
                      </label>
                      <input
                        type="number"
                        name="installment_number"
                        value={paymentForm.installment_number}
                        onChange={handleInputChange}
                        min="1"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        name="due_date"
                        value={paymentForm.due_date}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Type *
                    </label>
                    <select
                      name="payment_type"
                      value={paymentForm.payment_type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="down_payment">Down Payment</option>
                      <option value="installment">Installment</option>
                      <option value="final_payment">Final Payment</option>
                    </select>
                  </div>
                </>
              )}

              {/* Payment Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Notes (Optional)
                </label>
                <textarea
                  name="payment_notes"
                  value={paymentForm.payment_notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any additional notes about this payment..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {submitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Submit Payment
                  </>
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Secure Payment</p>
                  <p>Your payment information is encrypted and secure. You will receive a confirmation email after successful payment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
