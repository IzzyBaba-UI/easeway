"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  ArrowLeft,
  Settings,
} from "lucide-react";
import Link from "next/link";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message?: string;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/admin/bookings");
        if (response.ok) {
          const data = await response.json();
          setBookings(data.bookings);
        } else {
          setError("Failed to fetch bookings");
        }
      } catch (err) {
        setError("Error fetching bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDF2F6] to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 text-[#0E2127] hover:text-[#FF3133] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="text-right">
              <h1 className="text-h4-mobile md:text-h3-small font-axiforma text-[#0E2127]">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-body font-uber">
                Manage bookings and settings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-body-lg font-semibold text-[#0E2127] mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/dashboard"
              className="bg-[#FF3133] hover:bg-[#e62a2c] text-white p-4 rounded-xl transition-colors flex items-center gap-3"
            >
              <Settings className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">Clinic Settings</h3>
                <p className="text-body text-red-100 font-uber">
                  Manage hours & availability
                </p>
              </div>
            </Link>

            <div className="bg-gray-100 text-gray-500 p-4 rounded-xl flex items-center gap-3">
              <Users className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">Staff Management</h3>
                <p className="text-body font-uber">Coming soon</p>
              </div>
            </div>

            <div className="bg-gray-100 text-gray-500 p-4 rounded-xl flex items-center gap-3">
              <Calendar className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">Reports</h3>
                <p className="text-body font-uber">Coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-body font-uber">
                  Total Bookings
                </p>
                <p className="text-2xl font-bold text-[#0E2127]">
                  {stats.total}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-[#FF3133]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-body font-uber">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-body font-uber">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.confirmed}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-body font-uber">Completed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.completed}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>
        </div>

        {/* Bookings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-body-lg font-semibold text-[#0E2127]">
              Recent Bookings
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF3133] mx-auto"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              No bookings found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-base font-medium text-gray-900">
                            {booking.name}
                          </div>
                          <div className="text-base text-gray-500">
                            {booking.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-base text-gray-900">
                          {booking.service}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-base text-gray-900">
                          {booking.date}
                        </div>
                        <div className="text-base text-gray-500">
                          {booking.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-base font-semibold rounded-full ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                        <a
                          href={`tel:${booking.phone}`}
                          className="text-[#FF3133] hover:underline"
                        >
                          {booking.phone}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
