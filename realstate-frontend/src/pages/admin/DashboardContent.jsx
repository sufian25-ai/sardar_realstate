import React from "react";
import { FaUsers, FaHome, FaChartLine, FaCheckCircle } from "react-icons/fa";

const DashboardContent = () => {
  // এখানে ডামি data ব্যবহার করা হয়েছে, পরবর্তীতে API থেকে fetch করা যাবে
  const stats = [
    { title: "Total Users", value: 120, icon: <FaUsers className="w-6 h-6 text-blue-600" />, bg: "bg-blue-100" },
    { title: "Properties", value: 85, icon: <FaHome className="w-6 h-6 text-green-600" />, bg: "bg-green-100" },
    { title: "Active Sales", value: 45, icon: <FaChartLine className="w-6 h-6 text-yellow-600" />, bg: "bg-yellow-100" },
    { title: "Pending Approvals", value: 12, icon: <FaCheckCircle className="w-6 h-6 text-red-600" />, bg: "bg-red-100" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white shadow rounded-lg p-5 flex items-center">
            <div className={`${stat.bg} p-3 rounded-full mr-4`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts / Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6 h-64 flex items-center justify-center text-gray-400">
          Chart Placeholder
        </div>
        <div className="bg-white shadow rounded-lg p-6 h-64 flex items-center justify-center text-gray-400">
          Recent Activities Placeholder
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
