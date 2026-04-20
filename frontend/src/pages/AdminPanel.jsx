import { useState, useEffect } from "react";
import api from "../services/api";
import { FaUsers, FaImage, FaShoppingBag, FaTrash, FaShieldAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, posts: 0, products: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, usersRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/users")
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        toast.error(`Failed to load admin data: ${errorMsg}`);
        console.error("Admin Fetch Error:", err.response || err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to PERMANENTLY delete user "${username}" and all their content?`)) return;

    try {
      await api.delete(`/admin/user/${userId}`);
      toast.success("User deleted successfully");
      setUsers(users.filter(u => u._id !== userId));
      setStats(prev => ({ ...prev, users: prev.users - 1 }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleApprove = async (userId) => {
    try {
      await api.patch(`/admin/approve/${userId}`);
      toast.success("User approved!");
      setUsers(users.map(u => u._id === userId ? { ...u, status: "approved" } : u));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve user");
    }
  };

  const handleReject = async (userId) => {
    try {
      await api.patch(`/admin/reject/${userId}`);
      toast.success("User rejected!");
      setUsers(users.map(u => u._id === userId ? { ...u, status: "rejected" } : u));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject user");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
          <FaShieldAlt className="text-indigo-600" />
          Admin Control Center
        </h1>
        <p className="text-gray-500 mt-1">Super Authority Management & Moderation</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard 
          icon={<FaUsers />} 
          title="Total Users" 
          value={stats.users} 
          color="bg-blue-500" 
        />
        <StatCard 
          icon={<FaImage />} 
          title="Social Posts" 
          value={stats.posts} 
          color="bg-purple-500" 
        />
        <StatCard 
          icon={<FaShoppingBag />} 
          title="Market Products" 
          value={stats.products} 
          color="bg-green-500" 
        />
      </div>

      {/* User Management */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">User Management</h2>
          <span className="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full whitespace-nowrap">
            {users.length} Registered Users
          </span>
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="min-w-[700px] w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Verified</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div 
                      className="flex items-center gap-3 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => navigate(`/Profile/${u._id}`)}
                    >
                      <img 
                        src={u.image || "https://via.placeholder.com/40"} 
                        alt="" 
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                      />
                      <span className="font-bold text-gray-700 truncate hover:underline">{u.username}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 text-sm break-all">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase whitespace-nowrap ${
                      u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm whitespace-nowrap">
                    {u.isVerified ? (
                      <span className="text-green-500">✅ Yes</span>
                    ) : (
                      <span className="text-red-400">❌ No</span>
                    )}
                  </td>
                  <td className="p-4 text-sm whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                      u.status === 'approved' ? 'bg-green-100 text-green-700' :
                      u.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {u.status || "pending"}
                    </span>
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    {u.role !== 'admin' && u.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleApprove(u._id)}
                          className="text-green-500 hover:text-green-600 transition-colors bg-green-50 hover:bg-green-100 p-1.5 rounded"
                          title="Approve User"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(u._id)}
                          className="text-red-400 hover:text-red-500 transition-colors bg-red-50 hover:bg-red-100 p-1.5 rounded"
                          title="Reject User"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => handleDeleteUser(u._id, u.username)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 ml-2"
                        title="Delete User"
                      >
                        <FaTrash size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {users.map((u) => (
            <div key={u._id} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate(`/Profile/${u._id}`)}
                >
                  <img 
                    src={u.image || "https://via.placeholder.com/40"} 
                    alt="" 
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <p className="font-bold text-gray-800 hover:underline">{u.username}</p>
                    <p className="text-xs text-gray-500 break-all">{u.email}</p>
                  </div>
                </div>
                {u.role !== 'admin' && (
                  <button 
                    onClick={() => handleDeleteUser(u._id, u.username)}
                    className="bg-red-50 text-red-500 p-2.5 rounded-full hover:bg-red-100 transition-colors"
                  >
                    <FaTrash size={18} />
                  </button>
                )}
              </div>
              
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl text-sm">
                <div className="flex flex-col gap-1 text-center w-1/3 border-r border-gray-200 pr-2">
                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-tight">Role</span>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase mx-auto ${
                    u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {u.role}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-center w-1/3 border-r border-gray-200 px-2">
                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-tight">Status</span>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase mx-auto ${
                      u.status === 'approved' ? 'bg-green-100 text-green-700' :
                      u.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                  }`}>
                    {u.status || "pending"}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-center w-1/3 pl-2">
                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-tight">Verified</span>
                  <span className={u.isVerified ? "text-green-600 font-bold text-xs" : "text-red-400 font-bold text-xs"}>
                    {u.isVerified ? "✅" : "❌"}
                  </span>
                </div>
              </div>

              {u.role !== 'admin' && u.status === 'pending' && (
                 <div className="flex gap-2">
                   <button 
                     onClick={() => handleApprove(u._id)}
                     className="flex-1 bg-green-500 text-white p-2 rounded-lg text-sm font-semibold hover:bg-green-600"
                   >
                     Approve
                   </button>
                   <button 
                     onClick={() => handleReject(u._id)}
                     className="flex-1 bg-red-400 text-white p-2 rounded-lg text-sm font-semibold hover:bg-red-500"
                   >
                     Reject
                   </button>
                 </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 min-w-0 overflow-hidden">
      <div className={`${color} p-4 rounded-xl text-white text-2xl shadow-lg shadow-gray-200 flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0 overflow-hidden">
        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider truncate">{title}</p>
        <p className="text-2xl font-black text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );
}
