import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const PaymentManagement = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/agent/payments');
      
      if (response.data.status === 'success') {
        setPayments(response.data.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId, newStatus, notes = '') => {
    try {
      setUpdating(true);
      
      console.log('Updating payment status:', {
        paymentId,
        newStatus,
        notes
      });

      const response = await api.put(`/agent/payments/${paymentId}/status`, {
        status: newStatus,
        admin_notes: notes
      });

      console.log('Update response:', response.data);

      if (response.data.status === 'success') {
        // Update local state
        setPayments(payments.map(payment => 
          payment.id === paymentId 
            ? { ...payment, status: newStatus, admin_notes: notes, updated_at: new Date().toISOString() }
            : payment
        ));
        setShowModal(false);
        setSelectedPayment(null);
        
        // Show success message
        alert('Payment status updated successfully!');
      } else {
        throw new Error(response.data.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      
      let errorMessage = 'Failed to update payment status';
      
      if (error.response) {
        // Server responded with error status
        console.error('Server error response:', error.response.data);
        errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
        
        if (error.response.status === 401) {
          errorMessage = 'You are not authorized. Please login again.';
        } else if (error.response.status === 403) {
          errorMessage = 'You do not have permission to update payment status.';
        } else if (error.response.status === 404) {
          errorMessage = 'Payment not found.';
        } else if (error.response.data.errors) {
          errorMessage = Object.values(error.response.data.errors).flat().join(', ');
        }
      } else if (error.request) {
        // Network error
        console.error('Network error:', error.request);
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Other error
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      alert(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'সম্পূর্ণ';
      case 'processing': return 'প্রক্রিয়াধীন';
      case 'pending': return 'অপেক্ষমান';
      case 'cancelled': return 'বাতিল';
      default: return status;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const calculatePropertyStats = (payment) => {
    if (!payment.property) return null;

    // Get all payments for this property by this user
    const userPropertyPayments = payments.filter(p => 
      p.property_id === payment.property_id && 
      p.user_id === payment.user_id
    );

    const totalPaid = userPropertyPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0);

    const processingAmount = userPropertyPayments
      .filter(p => p.status === 'processing')
      .reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0);

    const pendingAmount = userPropertyPayments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0);

    const propertyPrice = parseFloat(payment.property.price || 0);
    const remainingAmount = Math.max(0, propertyPrice - totalPaid);
    const paymentProgress = propertyPrice > 0 ? (totalPaid / propertyPrice) * 100 : 0;

    console.log('Payment stats calculated:', {
      paymentId: payment.id,
      propertyPrice,
      totalPaid,
      remainingAmount,
      paymentProgress
    });

    return {
      totalPaid,
      processingAmount,
      pendingAmount,
      remainingAmount,
      paymentProgress,
      propertyPrice,
      isFullyPaid: remainingAmount <= 0
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
            <p className="text-gray-600">Manage user payments and property transactions</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by user, property, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">অপেক্ষমান</option>
              <option value="processing">প্রক্রিয়াধীন</option>
              <option value="completed">সম্পূর্ণ</option>
              <option value="cancelled">বাতিল</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Payments', value: payments.length, color: 'blue', icon: '💳' },
          { label: 'Pending', value: payments.filter(p => p.status === 'pending').length, color: 'yellow', icon: '⏳' },
          { label: 'Processing', value: payments.filter(p => p.status === 'processing').length, color: 'blue', icon: '🔄' },
          { label: 'Completed', value: payments.filter(p => p.status === 'completed').length, color: 'green', icon: '✅' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User & Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => {
                const stats = calculatePropertyStats(payment);
                return (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img 
                            className="h-12 w-12 rounded-lg object-cover" 
                            src={payment.property?.pimage ? `http://localhost:8000/${payment.property.pimage}` : '/assets/placeholder.jpg'} 
                            alt=""
                            onError={(e) => { e.target.src = '/assets/placeholder.jpg'; }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{payment.user?.name}</div>
                          <div className="text-sm text-gray-500">{payment.user?.email}</div>
                          <div className="text-sm text-blue-600 font-medium">{payment.property?.title}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">৳{parseFloat(payment.amount_paid || 0).toLocaleString()}</div>
                        <div className="text-gray-500">ID: {payment.transaction_id}</div>
                        <div className="text-gray-500">{new Date(payment.created_at).toLocaleDateString('bn-BD')}</div>
                        {payment.payment_method && (
                          <div className="text-gray-500">Method: {payment.payment_method}</div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {stats && (
                        <div className="space-y-2">
                          <div className="text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Price:</span>
                              <span className="font-medium">৳{stats.propertyPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Paid:</span>
                              <span className="font-medium text-green-600">৳{stats.totalPaid.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Remaining:</span>
                              <span className="font-medium text-orange-600">৳{stats.remainingAmount.toLocaleString()}</span>
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div>
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{stats.paymentProgress.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(100, stats.paymentProgress)}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          {stats.isFullyPaid && (
                            <div className="text-xs text-green-600 font-medium">✅ Fully Paid</div>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                      {payment.admin_notes && (
                        <div className="text-xs text-gray-500 mt-1">Note: {payment.admin_notes}</div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Manage
                      </button>
                      <button
                        onClick={() => window.open(`/properties/${payment.property?.pid}`, '_blank')}
                        className="text-green-600 hover:text-green-900"
                      >
                        View Property
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
              <p className="mt-1 text-sm text-gray-500">No payments match your current filters.</p>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Update Payment Status</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Details</label>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <div>User: {selectedPayment.user?.name}</div>
                    <div>Amount: ৳{parseFloat(selectedPayment.amount_paid || 0).toLocaleString()}</div>
                    <div>Transaction ID: {selectedPayment.transaction_id}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                  <select
                    id="newStatus"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={selectedPayment.status}
                  >
                    <option value="pending">অপেক্ষমান</option>
                    <option value="processing">প্রক্রিয়াধীন</option>
                    <option value="completed">সম্পূর্ণ</option>
                    <option value="cancelled">বাতিল</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes (Optional)</label>
                  <textarea
                    id="adminNotes"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add any notes about this status change..."
                    defaultValue={selectedPayment.admin_notes || ''}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedPayment(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const newStatus = document.getElementById('newStatus').value;
                    const notes = document.getElementById('adminNotes').value;
                    updatePaymentStatus(selectedPayment.id, newStatus, notes);
                  }}
                  disabled={updating}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
