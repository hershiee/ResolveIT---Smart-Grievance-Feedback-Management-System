import { useState } from "react";
import { MessageSquare, LogIn, UserPlus, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
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

      <div className="relative max-w-5xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-lg mb-6">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            Online Complaint Portal
            <span className="block text-3xl md:text-4xl mt-2 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              & Feedback Management System
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Your voice matters. Submit complaints, provide feedback, and track
            resolutions all in one place.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur-sm bg-opacity-95">
          <div className="grid md:grid-cols-2 gap-8">
            {/* New User Section */}
            <div
              className="group relative"
              onMouseEnter={() => setHoveredButton("signup")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl transition-all duration-300 ${
                  hoveredButton === "signup"
                    ? "opacity-100 scale-105"
                    : "opacity-0 scale-100"
                }`}
              ></div>

              <div className="relative bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border-2 border-teal-100 transition-all duration-300 hover:border-teal-300 h-full flex flex-col">
                <div className="flex-grow">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-xl shadow-md mb-4">
                    <UserPlus
                      className={`w-7 h-7 transition-colors duration-300 ${
                        hoveredButton === "signup"
                          ? "text-teal-600"
                          : "text-teal-500"
                      }`}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    New Here?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Create your account to start submitting complaints and
                    feedback. Join our community today!
                  </p>
                </div>

                <button
                  onClick={() => navigate("/signup")}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 group ${
                    hoveredButton === "signup"
                      ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg scale-105"
                      : "bg-white text-teal-600 border-2 border-teal-500 hover:bg-teal-50"
                  }`}
                >
                  Go to Signup Page
                  <ChevronRight
                    className={`w-5 h-5 transition-transform duration-300 ${
                      hoveredButton === "signup" ? "translate-x-1" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Existing User Section */}
            <div
              className="group relative"
              onMouseEnter={() => setHoveredButton("login")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl transition-all duration-300 ${
                  hoveredButton === "login"
                    ? "opacity-100 scale-105"
                    : "opacity-0 scale-100"
                }`}
              ></div>

              <div className="relative bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 border-2 border-cyan-100 transition-all duration-300 hover:border-cyan-300 h-full flex flex-col">
                <div className="flex-grow">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-xl shadow-md mb-4">
                    <LogIn
                      className={`w-7 h-7 transition-colors duration-300 ${
                        hoveredButton === "login"
                          ? "text-cyan-600"
                          : "text-cyan-500"
                      }`}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Returning User?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Welcome back! Sign in to access your dashboard and manage
                    your submissions.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/login")}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 group ${
                    hoveredButton === "login"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105"
                      : "bg-white text-cyan-600 border-2 border-cyan-500 hover:bg-cyan-50"
                  }`}
                >
                  Go to Login Page
                  <ChevronRight
                    className={`w-5 h-5 transition-transform duration-300 ${
                      hoveredButton === "login" ? "translate-x-1" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="text-3xl font-bold text-teal-600 mb-2">
                  24/7
                </div>
                <div className="text-gray-600 text-sm">Available Anytime</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-cyan-600 mb-2">
                  Fast
                </div>
                <div className="text-gray-600 text-sm">Quick Response Time</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  Secure
                </div>
                <div className="text-gray-600 text-sm">Your Data Protected</div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Login Section */}
        <div className="text-center mt-8">
          <div className="inline-block bg-white rounded-2xl shadow-md px-6 py-4">
            <p className="text-sm text-gray-600 mb-2">
              Are you an administrator?
            </p>
            <Link
              to="/login"
              className="text-teal-600 font-semibold hover:text-teal-700 transition-colors duration-200"
            >
              Login as Admin →
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600">
          <p className="text-sm">Need help? Contact our support team</p>
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

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Home;
