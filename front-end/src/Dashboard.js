import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Activity,
  User,
} from "lucide-react";
import Navbar from "./components/Navbar";
import ComplaintForm from "./components/ComplaintForm";
import ComplaintTracking from "./components/ComplaintTracking";
import ComplaintHistory from "./components/ComplaintHistory";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("submit");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    inProgress: 0,
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUserStats(parsedUser.id);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserStats = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/user-complaints/${userId}`
      );
      const data = await response.json();

      if (response.ok && data.complaints) {
        const complaints = data.complaints;
        const total = complaints.length;
        const pending = complaints.filter((c) =>
          ["New", "Under Review"].includes(c.status)
        ).length;
        const inProgress = complaints.filter(
          (c) => c.status === "In Progress"
        ).length;
        const resolved = complaints.filter((c) =>
          ["Resolved", "Closed"].includes(c.status)
        ).length;

        setStats({ total, pending, resolved, inProgress });
      }
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplaintSubmitted = () => {
    if (user) {
      fetchUserStats(user.id);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "submit":
        return (
          <ComplaintForm onComplaintSubmitted={handleComplaintSubmitted} />
        );
      case "track":
        return <ComplaintTracking />;
      case "history":
        return <ComplaintHistory />;
      default:
        return (
          <ComplaintForm onComplaintSubmitted={handleComplaintSubmitted} />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-70px)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div
          className="absolute top-40 right-10 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <Navbar />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Welcome to ResolveIT Portal
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Your complaints and feedback management system
          </p>
          {user && (
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mt-3">
              <User className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">
                {user.name}
              </span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-600">{user.email}</span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slideUp">
          {/* Total Complaints */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-teal-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-teal-100 rounded-xl">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-teal-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {stats.total}
            </div>
            <div className="text-sm font-medium text-gray-600">
              Total Complaints
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {stats.pending}
            </div>
            <div className="text-sm font-medium text-gray-600">
              Pending Review
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {stats.inProgress}
            </div>
            <div className="text-sm font-medium text-gray-600">In Progress</div>
          </div>

          {/* Resolved */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {stats.resolved}
            </div>
            <div className="text-sm font-medium text-gray-600">Resolved</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          className="bg-white rounded-2xl shadow-lg p-2 mb-8 animate-slideUp"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              className={`flex-1 py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300 ${
                activeTab === "submit"
                  ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg scale-105"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("submit")}
            >
              Submit Complaint
            </button>
            <button
              className={`flex-1 py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300 ${
                activeTab === "track"
                  ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg scale-105"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("track")}
            >
              Track Status
            </button>
            <button
              className={`flex-1 py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300 ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg scale-105"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("history")}
            >
              My Complaints
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div
          className="bg-white rounded-2xl shadow-lg overflow-hidden animate-slideUp"
          style={{ animationDelay: "0.2s" }}
        >
          {renderTabContent()}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
