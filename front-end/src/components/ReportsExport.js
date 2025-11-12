import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Download,
  Filter,
  Calendar,
  PieChart,
  Activity,
} from "lucide-react";
import Navbar from "./Navbar";

const ReportsExport = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [exportFilters, setExportFilters] = useState({
    status: "all",
    category: "all",
    dateFrom: "",
    dateTo: "",
    format: "csv",
  });
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      if (user.role !== "admin") {
        navigate("/dashboard");
        return;
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
      return;
    }

    fetchReportsData();
  }, [navigate]);

  const fetchReportsData = async () => {
    try {
      const [complaintsResponse, statsResponse] = await Promise.all([
        fetch("http://localhost:5000/admin/complaints"),
        fetch("http://localhost:5000/stats"),
      ]);

      const complaintsData = await complaintsResponse.json();
      const statsData = await statsResponse.json();

      if (complaintsResponse.ok) {
        setComplaints(complaintsData.complaints || []);
      }
      if (statsResponse.ok) {
        setStats(statsData.stats || {});
      }
    } catch (error) {
      console.error("Failed to fetch reports data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);

    try {
      const queryParams = new URLSearchParams();
      Object.entries(exportFilters).forEach(([key, value]) => {
        if (value && value !== "all") {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(
        `http://localhost:5000/export/complaints?${queryParams.toString()}`
      );

      if (response.ok) {
        if (exportFilters.format === "csv") {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `complaints-export-${Date.now()}.csv`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          const data = await response.json();
          console.log("Export data:", data);
          alert("Export completed! Check console for data.");
        }
      } else {
        alert("Export failed. Please try again.");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const getCategoryStats = () => {
    const categoryCount = {};
    complaints.forEach((complaint) => {
      categoryCount[complaint.category] =
        (categoryCount[complaint.category] || 0) + 1;
    });
    return Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);
  };

  const getPriorityStats = () => {
    const priorityCount = {};
    complaints.forEach((complaint) => {
      priorityCount[complaint.urgency] =
        (priorityCount[complaint.urgency] || 0) + 1;
    });
    return Object.entries(priorityCount);
  };

  const getMonthlyTrends = () => {
    const monthlyData = {};
    complaints.forEach((complaint) => {
      const month = new Date(complaint.created_at).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });
    return Object.entries(monthlyData).slice(-6);
  };

  const getResolutionTime = () => {
    const resolvedComplaints = complaints.filter((c) => c.resolved_at);
    if (resolvedComplaints.length === 0) return 0;

    const totalHours = resolvedComplaints.reduce((acc, complaint) => {
      const created = new Date(complaint.created_at);
      const resolved = new Date(complaint.resolved_at);
      const hours = (resolved - created) / (1000 * 60 * 60);
      return acc + hours;
    }, 0);

    return Math.round(totalHours / resolvedComplaints.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full mb-4 animate-spin">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-600 font-medium">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <Navbar />

      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div
          className="absolute top-40 right-10 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute -bottom-20 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Reports & Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive insights into complaint trends and performance
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-gray-100 transform hover:scale-[1.02] transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Total Complaints
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.total_complaints || complaints.length}
                </p>
                <p className="text-xs text-teal-600 mt-2 font-medium">
                  All time
                </p>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-gray-100 transform hover:scale-[1.02] transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Avg Resolution Time
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {getResolutionTime()}h
                </p>
                <p className="text-xs text-blue-600 mt-2 font-medium">
                  Last 30 days
                </p>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-gray-100 transform hover:scale-[1.02] transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Resolution Rate
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {complaints.length > 0
                    ? Math.round(
                        (complaints.filter((c) => c.status === "Resolved")
                          .length /
                          complaints.length) *
                          100
                      )
                    : 0}
                  %
                </p>
                <p className="text-xs text-green-600 mt-2 font-medium">
                  {complaints.filter((c) => c.status === "Resolved").length}{" "}
                  resolved
                </p>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-gray-100 transform hover:scale-[1.02] transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Critical Issues
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {complaints.filter((c) => c.urgency === "critical").length}
                </p>
                <p className="text-xs text-red-600 mt-2 font-medium">
                  Needs attention
                </p>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Status Distribution */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Status Distribution
              </h3>
            </div>
            <div className="space-y-4">
              {[
                { status: "New", color: "from-blue-500 to-blue-600" },
                {
                  status: "Under Review",
                  color: "from-yellow-500 to-orange-500",
                },
                {
                  status: "In Progress",
                  color: "from-green-500 to-emerald-600",
                },
                { status: "Resolved", color: "from-teal-500 to-cyan-600" },
                { status: "Escalated", color: "from-red-500 to-red-600" },
              ].map(({ status, color }) => {
                const count = complaints.filter(
                  (c) => c.status === status
                ).length;
                const percentage =
                  complaints.length > 0
                    ? ((count / complaints.length) * 100).toFixed(1)
                    : 0;

                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        {status}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-800">
                          {count}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Top Categories
              </h3>
            </div>
            <div className="space-y-3">
              {getCategoryStats()
                .slice(0, 5)
                .map(([category, count], index) => (
                  <div
                    key={category}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-gray-800">
                        {category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-teal-600">
                        {count}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        ({((count / complaints.length) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Priority Levels
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {getPriorityStats().map(([priority, count]) => {
                const configs = {
                  critical: {
                    color: "from-red-500 to-red-600",
                    bg: "bg-red-50",
                    text: "text-red-600",
                    border: "border-red-200",
                  },
                  high: {
                    color: "from-orange-500 to-orange-600",
                    bg: "bg-orange-50",
                    text: "text-orange-600",
                    border: "border-orange-200",
                  },
                  medium: {
                    color: "from-yellow-500 to-yellow-600",
                    bg: "bg-yellow-50",
                    text: "text-yellow-600",
                    border: "border-yellow-200",
                  },
                  low: {
                    color: "from-green-500 to-green-600",
                    bg: "bg-green-50",
                    text: "text-green-600",
                    border: "border-green-200",
                  },
                };

                const config = configs[priority] || configs.medium;

                return (
                  <div
                    key={priority}
                    className={`${config.bg} border ${config.border} rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]`}
                  >
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${config.color} rounded-xl mb-3`}
                    >
                      <span className="text-white text-xl font-bold">
                        {priority.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className={`text-3xl font-bold ${config.text} mb-1`}>
                      {count}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 uppercase">
                      {priority}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Monthly Trends
              </h3>
            </div>
            <div className="flex items-end justify-between gap-3 h-48">
              {getMonthlyTrends().map(([month, count]) => {
                const maxCount = Math.max(
                  ...getMonthlyTrends().map(([, c]) => c)
                );
                const heightPercentage = (count / maxCount) * 100;

                return (
                  <div
                    key={month}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div
                      className="relative w-full flex items-end justify-center"
                      style={{ height: "160px" }}
                    >
                      <div
                        className="w-full bg-gradient-to-t from-teal-500 to-cyan-600 rounded-t-xl hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 relative group"
                        style={{ height: `${heightPercentage}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                          {count} complaints
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-semibold text-gray-700">
                        {month.split(" ")[0].slice(0, 3)}
                      </div>
                      <div className="text-xs text-gray-500">{count}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-lg">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Export Data</h2>
              <p className="text-sm text-gray-600 mt-1">
                Download complaint data for external analysis
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status Filter
              </label>
              <select
                value={exportFilters.status}
                onChange={(e) =>
                  setExportFilters({ ...exportFilters, status: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white text-gray-700 font-medium"
              >
                <option value="all">All Status</option>
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Escalated">Escalated</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category Filter
              </label>
              <select
                value={exportFilters.category}
                onChange={(e) =>
                  setExportFilters({
                    ...exportFilters,
                    category: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white text-gray-700 font-medium"
              >
                <option value="all">All Categories</option>
                {Array.from(new Set(complaints.map((c) => c.category))).map(
                  (category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date From
              </label>
              <input
                type="date"
                value={exportFilters.dateFrom}
                onChange={(e) =>
                  setExportFilters({
                    ...exportFilters,
                    dateFrom: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white text-gray-700 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date To
              </label>
              <input
                type="date"
                value={exportFilters.dateTo}
                onChange={(e) =>
                  setExportFilters({ ...exportFilters, dateTo: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white text-gray-700 font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-100">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">
                Export Format:
              </span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={exportFilters.format === "csv"}
                  onChange={(e) =>
                    setExportFilters({
                      ...exportFilters,
                      format: e.target.value,
                    })
                  }
                  className="w-4 h-4 text-teal-600 focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  CSV Format
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="json"
                  checked={exportFilters.format === "json"}
                  onChange={(e) =>
                    setExportFilters({
                      ...exportFilters,
                      format: e.target.value,
                    })
                  }
                  className="w-4 h-4 text-teal-600 focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  JSON Format
                </span>
              </label>
            </div>

            <button
              onClick={handleExport}
              disabled={exporting}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {exporting ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Export Data
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsExport;
