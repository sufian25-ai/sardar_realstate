import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const UserProfile = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (authUser) {
      fetchUserData();
    }
  }, [authUser]);

  // Refresh data when component mounts or when returning from payment
  useEffect(() => {
    const refreshData = () => {
      if (authUser) {
        fetchUserData();
        fetchOrdersWithPaymentDetails();
      }
    };

    // Listen for storage events (when payment is completed)
    window.addEventListener('storage', refreshData);
    
    // Listen for focus events (when user returns to tab)
    window.addEventListener('focus', refreshData);

    return () => {
      window.removeEventListener('storage', refreshData);
      window.removeEventListener('focus', refreshData);
    };
  }, [authUser]);


  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile with all data
      const profileResponse = await api.get('/profile');
      
      if (profileResponse.data.status === 'success') {
        const { user: userData, stats: userStats } = profileResponse.data.data;
        setUser(userData);
        setStats(userStats);
        setProperties(userData.user_properties || []);
      }

      // Fetch orders with payment details separately
      await fetchOrdersWithPaymentDetails();
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to auth user data
      if (authUser) {
        setUser({
          ...authUser,
          joinDate: authUser.created_at || new Date().toISOString(),
          bio: authUser.bio || 'No bio available'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersWithPaymentDetails = async () => {
    try {
      const ordersResponse = await api.get('/profile/orders');
      
      if (ordersResponse.data.status === 'success') {
        const ordersData = ordersResponse.data.data.data || [];
        console.log('Orders data received:', ordersData);
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await api.get('/profile/properties');
      if (response.data.status === 'success') {
        setProperties(response.data.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  // Handle tab change and refresh data if needed
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    
    // Refresh orders when switching to orders tab
    if (tabId === 'orders') {
      fetchOrdersWithPaymentDetails();
    }
    
    // Refresh properties when switching to properties tab
    if (tabId === 'properties') {
      fetchProperties();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'owned': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'owned': return 'Owned';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h1>
              <p className="text-gray-600 mb-4">{user?.bio}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center space-x-2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{user?.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Joined {new Date(user?.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  fetchUserData();
                  fetchOrdersWithPaymentDetails();
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                🔄 Refresh
              </button>
              <Link 
                to="/user/profile/edit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 inline-block"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { id: 'profile', name: 'Profile Information', icon: '👤' },
              { id: 'orders', name: 'My Orders', icon: '📦' },
              { id: 'properties', name: 'My Properties', icon: '🏠' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Profile Information */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900">
                      {user?.name}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900">
                      {user?.email}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900">
                      {user?.phone}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900">
                      {user?.address}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 min-h-[100px]">
                      {user?.bio}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900">
                      {new Date(user?.joinDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Orders */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
              
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                  <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                  <Link 
                    to="/properties" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold inline-block"
                  >
                    Browse Properties
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow duration-300">
                      <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                        <img 
                          src={order.property?.pimage ? `http://localhost:8000/${order.property.pimage}` : '/assets/placeholder.jpg'} 
                          alt={order.property?.title || 'Property'}
                          className="w-20 h-20 rounded-xl object-cover"
                          onError={(e) => { e.target.src = '/assets/placeholder.jpg'; }}
                        />
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {order.property?.title || 'Property Not Available'}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                            <span>Order Date: {new Date(order.created_at).toLocaleDateString()}</span>
                            <span>Amount: ${order.amount?.toLocaleString()}</span>
                            <span>Type: {order.order_type?.charAt(0).toUpperCase() + order.order_type?.slice(1)}</span>
                          </div>
                          
                          {/* Payment Details */}
                          {order.payment_details && (
                            <div className="bg-gray-50 rounded-lg p-4 mt-3">
                              <h4 className="font-medium text-gray-900 mb-2">Payment Status</h4>
                              
                              {order.payment_details.payment_type === 'sale' ? (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Total Price:</span>
                                    <span className="font-medium">${order.payment_details.total_property_price?.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Total Paid:</span>
                                    <span className="font-medium text-green-600">${order.payment_details.total_paid?.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Remaining:</span>
                                    <span className="font-medium text-orange-600">${order.payment_details.remaining_amount?.toLocaleString()}</span>
                                  </div>
                                  
                                  {/* Progress Bar */}
                                  <div className="mt-3">
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                      <span>Payment Progress</span>
                                      <span className="font-semibold">{order.payment_details.payment_progress?.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                      <div 
                                        className={`h-3 rounded-full transition-all duration-500 ease-out ${
                                          order.payment_details.payment_progress >= 100 
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                                            : order.payment_details.payment_progress >= 50
                                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                            : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                        }`}
                                        style={{ width: `${Math.min(100, order.payment_details.payment_progress || 0)}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  
                                  {/* Payment Status Summary */}
                                  <div className="mt-3 p-2 bg-white rounded border">
                                    <div className="text-xs text-gray-500">
                                      Completed: {order.payment_details.completed_payments || 0} | Processing: {order.payment_details.processing_payments || 0} | Pending: {order.payment_details.pending_payments || 0}
                                    </div>
                                    <div className="mt-2 flex justify-end">
                                      <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                                        order.payment_details.is_fully_paid
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-orange-100 text-orange-800'
                                      }`}>
                                        {order.payment_details.is_fully_paid ? '🎉 Fully Paid' : '📊 In Progress'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Total Paid:</span>
                                    <span className="font-medium text-green-600">${order.payment_details.total_paid?.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Pending:</span>
                                    <span className="font-medium text-orange-600">${order.payment_details.pending_amount?.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>Paid: {order.payment_details.paid_installments}</span>
                                    <span>Pending: {order.payment_details.pending_installments}</span>
                                    <span>Overdue: {order.payment_details.overdue_installments}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {order.notes && (
                            <p className="text-sm text-gray-500 mt-2">{order.notes}</p>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          
                          <div className="flex flex-col space-y-1">
                            <Link 
                              to={`/properties/${order.property?.pid}`}
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              View Property
                            </Link>
                            
                            {order.payment_details && !order.payment_details.is_fully_paid && (
                              <Link 
                                to={`/payment/${order.property?.pid}`}
                                className="text-green-600 hover:text-green-700 font-medium text-sm"
                              >
                                Make Payment
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Properties */}
          {activeTab === 'properties' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Properties</h2>
              
              {properties.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏠</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Yet</h3>
                  <p className="text-gray-600 mb-6">You haven't purchased any properties yet.</p>
                  <Link 
                    to="/properties" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold inline-block"
                  >
                    Browse Properties
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((userProperty) => (
                    <div key={userProperty.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
                      <div className="relative overflow-hidden">
                        <img 
                          src={userProperty.property?.pimage ? `http://localhost:8000/${userProperty.property.pimage}` : '/assets/placeholder.jpg'} 
                          alt={userProperty.property?.title || 'Property'}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.src = '/assets/placeholder.jpg'; }}
                        />
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(userProperty.ownership_type)}`}>
                            {getStatusText(userProperty.ownership_type)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                          {userProperty.property?.title || 'Property Not Available'}
                        </h3>
                        
                        <div className="flex items-center space-x-2 text-gray-600 mb-3">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm">{userProperty.property?.location}</span>
                        </div>
                        
                        <h4 className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-4">
                          ${userProperty.purchase_price?.toLocaleString() || userProperty.property?.price?.toLocaleString()}
                        </h4>
                        
                        <div className="flex justify-between items-center text-sm text-gray-600 border-t border-gray-100 pt-4">
                          <div>
                            <span className="font-semibold">{userProperty.property?.bedroom || 0}</span> beds
                          </div>
                          <div>
                            <span className="font-semibold">{userProperty.property?.bathroom || 0}</span> baths
                          </div>
                          <div>
                            <span className="font-semibold">{userProperty.property?.size || 'N/A'}</span> sqft
                          </div>
                        </div>
                        
                        {userProperty.purchase_date && (
                          <div className="mt-4 text-xs text-gray-500">
                            {userProperty.ownership_type === 'owned' ? 'Purchased' : 'Acquired'} on {new Date(userProperty.purchase_date).toLocaleDateString()}
                          </div>
                        )}
                        
                        {userProperty.ownership_notes && (
                          <div className="mt-2 text-xs text-gray-500">
                            {userProperty.ownership_notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;