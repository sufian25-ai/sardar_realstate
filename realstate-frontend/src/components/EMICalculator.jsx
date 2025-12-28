import React, { useState } from 'react';
import { Calculator, DollarSign, Calendar, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EMICalculator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState({
    propertyPrice: 5000000,
    downPayment: 1000000,
    interestRate: 10,
    loanTenure: 15,
  });

  const [result, setResult] = useState(null);

  const calculateEMI = () => {
    const principal = values.propertyPrice - values.downPayment;
    const ratePerMonth = values.interestRate / 12 / 100;
    const numberOfMonths = values.loanTenure * 12;

    // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
    const emi =
      (principal * ratePerMonth * Math.pow(1 + ratePerMonth, numberOfMonths)) /
      (Math.pow(1 + ratePerMonth, numberOfMonths) - 1);

    const totalAmount = emi * numberOfMonths;
    const totalInterest = totalAmount - principal;

    setResult({
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      principal: principal,
    });
  };

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: parseInt(value) || 0 }));
  };

  return (
    <>
      {/* Floating Calculator Button */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-2xl hover:shadow-blue-500/50 flex items-center justify-center group"
      >
        <Calculator className="w-8 h-8 text-white" />
        
        {/* Tooltip */}
        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          <div className="text-sm font-semibold">EMI Calculator</div>
          <div className="text-xs text-gray-300">Calculate your loan</div>
          {/* Arrow */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-900"></div>
          </div>
        </div>
      </motion.button>

      {/* Calculator Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 rounded-t-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">EMI Calculator</h2>
                      <p className="text-blue-100 text-sm">Calculate your monthly payments</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Input Section */}
                  <div className="space-y-6">
                    {/* Property Price */}
                    <div className="space-y-3">
                      <label className="flex items-center justify-between text-sm font-bold text-gray-700">
                        <span className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-blue-600" />
                          Property Price
                        </span>
                        <span className="text-blue-600">৳{values.propertyPrice.toLocaleString()}</span>
                      </label>
                      <input
                        type="range"
                        min="500000"
                        max="50000000"
                        step="100000"
                        value={values.propertyPrice}
                        onChange={(e) => handleChange('propertyPrice', e.target.value)}
                        className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Down Payment */}
                    <div className="space-y-3">
                      <label className="flex items-center justify-between text-sm font-bold text-gray-700">
                        <span className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                          Down Payment
                        </span>
                        <span className="text-purple-600">৳{values.downPayment.toLocaleString()}</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max={values.propertyPrice * 0.5}
                        step="50000"
                        value={values.downPayment}
                        onChange={(e) => handleChange('downPayment', e.target.value)}
                        className="w-full h-2 bg-gradient-to-r from-purple-200 to-purple-400 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-3">
                      <label className="flex items-center justify-between text-sm font-bold text-gray-700">
                        <span className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-pink-600" />
                          Interest Rate (% per year)
                        </span>
                        <span className="text-pink-600">{values.interestRate}%</span>
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="20"
                        step="0.5"
                        value={values.interestRate}
                        onChange={(e) => handleChange('interestRate', e.target.value)}
                        className="w-full h-2 bg-gradient-to-r from-pink-200 to-pink-400 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Loan Tenure */}
                    <div className="space-y-3">
                      <label className="flex items-center justify-between text-sm font-bold text-gray-700">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-600" />
                          Loan Tenure (Years)
                        </span>
                        <span className="text-orange-600">{values.loanTenure} years</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        step="1"
                        value={values.loanTenure}
                        onChange={(e) => handleChange('loanTenure', e.target.value)}
                        className="w-full h-2 bg-gradient-to-r from-orange-200 to-orange-400 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <button
                      onClick={calculateEMI}
                      className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Calculator className="w-5 h-5" />
                      Calculate EMI
                    </button>
                  </div>

                  {/* Result Section */}
                  <div className="space-y-4">
                    {result ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                      >
                        {/* Monthly EMI */}
                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                          <div className="text-sm font-medium opacity-90 mb-2">Monthly EMI</div>
                          <div className="text-4xl font-black">৳{result.emi.toLocaleString()}</div>
                          <div className="text-sm opacity-75 mt-1">per month for {values.loanTenure} years</div>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-3">
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 font-medium">Principal Amount</span>
                              <span className="font-bold text-gray-900">৳{result.principal.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200">
                            <div className="flex justify-between items-center">
                              <span className="text-orange-700 font-medium">Total Interest</span>
                              <span className="font-bold text-orange-900">৳{result.totalInterest.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
                            <div className="flex justify-between items-center">
                              <span className="text-green-700 font-medium">Total Amount</span>
                              <span className="font-bold text-green-900">৳{result.totalAmount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Visual Breakdown */}
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="text-sm font-bold text-gray-700 mb-3">Payment Breakdown</div>
                          <div className="flex h-8 rounded-lg overflow-hidden shadow-inner">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold"
                              style={{ width: `${(result.principal / result.totalAmount) * 100}%` }}
                            >
                              {Math.round((result.principal / result.totalAmount) * 100)}%
                            </div>
                            <div
                              className="bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold"
                              style={{ width: `${(result.totalInterest / result.totalAmount) * 100}%` }}
                            >
                              {Math.round((result.totalInterest / result.totalAmount) * 100)}%
                            </div>
                          </div>
                          <div className="flex justify-between mt-2 text-xs">
                            <span className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                              Principal
                            </span>
                            <span className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                              Interest
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-center p-8">
                        <div>
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calculator className="w-12 h-12 text-blue-600" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Calculate</h3>
                          <p className="text-gray-600">Adjust the sliders and click Calculate EMI</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          border: 3px solid currentColor;
        }

        input[type='range']::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          border: 3px solid currentColor;
        }
      `}</style>
    </>
  );
};

export default EMICalculator;
