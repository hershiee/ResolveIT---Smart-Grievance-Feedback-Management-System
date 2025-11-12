import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Edit,
  X,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Navbar from "./Navbar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    pending: 0,
    resolved: 0,
    escalated: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: "",
    assignedTo: "",
    notes: "",
    publicReply: "",
  });
  const [filters, setFilters] = useState({
    status: "all",
    urgency: "all",
    category: "all",
  });

  useEffect(() => {
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

    fetchComplaints();
  }, [navigate]);

  const applyFilters = useCallback(() => {
    let filtered = [...complaints];

    if (filters.status !== "all") {
      filtered = filtered.filter(
        (c) => c.status.toLowerCase() === filters.status
      );
    }
    if (filters.urgency !== "all") {
      filtered = filtered.filter((c) => c.urgency === filters.urgency);
    }
    if (filters.category !== "all") {
      filtered = filtered.filter((c) => c.category === filters.category);
    }

    setFilteredComplaints(filtered);
  }, [complaints, filters]);

  const calculateStats = useCallback(() => {
    const total = complaints.length;
    const newCount = complaints.filter((c) => c.status === "New").length;
    const pendingCount = complaints.filter((c) =>
      ["Under Review", "In Progress"].includes(c.status)
    ).length;
    const resolvedCount = complaints.filter(
      (c) => c.status === "Resolved"
    ).length;
    const escalatedCount = complaints.filter(
      (c) => c.status === "Escalated"
    ).length;

    setStats({
      total,
      new: newCount,
      pending: pendingCount,
      resolved: resolvedCount,
      escalated: escalatedCount,
    });
  }, [complaints]);

  useEffect(() => {
    applyFilters();
    calculateStats();
  }, [applyFilters, calculateStats]);

  const fetchComplaints = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin/complaints");
      const data = await response.json();
      if (response.ok) {
        setComplaints(data.complaints || []);
      }
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComplaint = async (complaintId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/admin/update-complaint/${complaintId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        await fetchComplaints();
        setShowModal(false);
        setUpdateData({
          status: "",
          assignedTo: "",
          notes: "",
          publicReply: "",
        });
        alert("Complaint updated successfully!");
      } else {
        alert(data.message || "Failed to update complaint");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update complaint");
    }
  };

  const openUpdateModal = (complaint) => {
    setSelectedComplaint(complaint);
    setUpdateData({
      status: complaint.status,
      assignedTo: complaint.assigned_to || "",
      notes: "",
      publicReply: "",
    });
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      New: "#3182ce",
      "Under Review": "#d69e2e",
      "In Progress": "#38a169",
      Resolved: "#00897b",
      Closed: "#718096",
      Escalated: "#e53e3e",
    };
    return colors[status] || "#718096";
  };

  const getPriorityColor = (urgency) => {
    const colors = {
      critical: "#e53e3e",
      high: "#dd6b20",
      medium: "#d69e2e",
      low: "#38a169",
    };
    return colors[urgency] || "#718096";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusChartData = [
    "New",
    "Under Review",
    "In Progress",
    "Resolved",
    "Escalated",
  ].map((status) => ({
    name: status,
    count: complaints.filter((c) => c.status === status).length,
  }));

  const categoryChartData = Array.from(
    new Set(complaints.map((c) => c.category))
  ).map((category) => ({
    name: category,
    value: complaints.filter((c) => c.category === category).length,
  }));

  const statusColors = ["#3182ce", "#d69e2e", "#38a169", "#00897b", "#e53e3e"];
  const categoryColors = [
    "#3182ce",
    "#38a169",
    "#d69e2e",
    "#e53e3e",
    "#718096",
    "#00897b",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-70px)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">
              Loading admin dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div
          className="absolute top-40 right-10 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <Navbar />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage and resolve complaints efficiently
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 animate-slideUp">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-teal-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <FileText className="w-8 h-8 text-teal-600" />
              <TrendingUp className="w-5 h-5 text-teal-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600 font-medium">Total</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.new}</div>
            <div className="text-sm text-gray-600 font-medium">New</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-600 font-medium">Pending</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {stats.resolved}
            </div>
            <div className="text-sm text-gray-600 font-medium">Resolved</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {stats.escalated}
            </div>
            <div className="text-sm text-gray-600 font-medium">Escalated</div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="bg-white rounded-2xl shadow-lg p-2 mb-8 animate-slideUp"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "manage"
                  ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("manage")}
            >
              Manage Complaints
            </button>
            <button
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "analytics"
                  ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("analytics")}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="animate-slideUp" style={{ animationDelay: "0.2s" }}>
          {activeTab === "overview" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {complaints.slice(0, 5).map((complaint) => (
                    <div
                      key={complaint.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {complaint.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(complaint.created_at)}
                        </p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{
                          backgroundColor: getStatusColor(complaint.status),
                        }}
                      >
                        {complaint.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Priority Distribution
                </h3>
                <div className="space-y-4">
                  {["critical", "high", "medium", "low"].map((priority) => {
                    const count = complaints.filter(
                      (c) => c.urgency === priority
                    ).length;
                    const percentage =
                      complaints.length > 0
                        ? ((count / complaints.length) * 100).toFixed(1)
                        : 0;
                    return (
                      <div key={priority}>
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold text-gray-700 uppercase text-sm">
                            {priority}
                          </span>
                          <span className="text-sm text-gray-600">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: getPriorityColor(priority),
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "manage" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex gap-4 mb-6 flex-wrap">
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="under review">Under Review</option>
                  <option value="in progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="escalated">Escalated</option>
                </select>

                <select
                  value={filters.urgency}
                  onChange={(e) =>
                    setFilters({ ...filters, urgency: e.target.value })
                  }
                  className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <button
                  onClick={() =>
                    setFilters({
                      status: "all",
                      urgency: "all",
                      category: "all",
                    })
                  }
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium"
                >
                  Clear Filters
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Title
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Priority
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Created
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.map((complaint) => (
                      <tr
                        key={complaint.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">{complaint.id}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-800">
                              {complaint.title}
                            </p>
                            {complaint.submission_type === "anonymous" && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                Anonymous
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {complaint.category}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                            style={{
                              backgroundColor: getPriorityColor(
                                complaint.urgency
                              ),
                            }}
                          >
                            {complaint.urgency}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                            style={{
                              backgroundColor: getStatusColor(complaint.status),
                            }}
                          >
                            {complaint.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(complaint.created_at)}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => openUpdateModal(complaint)}
                            className="flex items-center gap-2 bg-teal-500 text-white px-3 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Status Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusChartData}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Complaints">
                      {statusChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={statusColors[index]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Category Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={categoryColors[index % categoryColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-3xl">
              <h2 className="text-2xl font-bold text-gray-800">
                Update Complaint #{selectedComplaint.id}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h4 className="font-bold text-gray-800 mb-2">
                  {selectedComplaint.title}
                </h4>
                <p className="text-gray-600 mb-3">
                  {selectedComplaint.description}
                </p>
                <div className="flex gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{
                      backgroundColor: getStatusColor(selectedComplaint.status),
                    }}
                  >
                    {selectedComplaint.status}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{
                      backgroundColor: getPriorityColor(
                        selectedComplaint.urgency
                      ),
                    }}
                  >
                    {selectedComplaint.urgency}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={updateData.status}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, status: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Under Review">Under Review</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                    <option value="Escalated">Escalated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assign To
                  </label>
                  <input
                    type="text"
                    value={updateData.assignedTo}
                    onChange={(e) =>
                      setUpdateData({
                        ...updateData,
                        assignedTo: e.target.value,
                      })
                    }
                    placeholder="Enter staff member name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Internal Notes
                  </label>
                  <textarea
                    value={updateData.notes}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, notes: e.target.value })
                    }
                    placeholder="Add internal notes (not visible to user)"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none resize-none"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Public Reply
                  </label>
                  <textarea
                    value={updateData.publicReply}
                    onChange={(e) =>
                      setUpdateData({
                        ...updateData,
                        publicReply: e.target.value,
                      })
                    }
                    placeholder="Reply to user (visible to complainant)"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none resize-none"
                    rows="4"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateComplaint(selectedComplaint.id)}
                    className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg"
                  >
                    Update Complaint
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
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

export default AdminDashboard;
