import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProfileSetup() {
  const { userInformation, setUserInformation } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    semester: "",
    specialization: ""
  });

  const semesters = [
    "Semester 1", "Semester 2", "Semester 3", "Semester 4",
    "Semester 5", "Semester 6", "Semester 7", "Semester 8",
    "Year 1", "Year 2", "Year 3", "Year 4"
  ];

  const specializations = [
    "Computer Science",
    "Information Technology",
    "Business Administration",
    "Design",
    "Engineering",
    "Arts & Humanities",
    "Mathematics & Science",
    "Other"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.semester || !formData.specialization) {
      toast.error("Please select both your semester and specialization.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/complete-profile", formData);
      toast.success("Profile setup successfully!");
      // Update local state to trigger ProtectedRoutes evaluation immediately
      setUserInformation({ ...userInformation, ...formData, isProfileComplete: true });
      navigate("/waiting-approval"); // or let ProtectedRoutes handle it
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save profile details");
    } finally {
      setLoading(false);
    }
  };

  if (!userInformation) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Complete Your Profile</h1>
          <p className="text-sm text-gray-500 mt-2">Just a few more details so we can tailor your experience.</p>
        </div>

        <div className="flex flex-col items-center mb-6">
          <img 
            src={userInformation.image || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
            alt="Profile preview"
            className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100 shadow-sm"
          />
          <h2 className="mt-3 text-lg font-bold text-gray-700">{userInformation.username}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Semester / Year <span className="text-red-500">*</span></label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:bg-white outline-none transition-colors"
              required
            >
              <option value="" disabled>Select your current semester/year</option>
              {semesters.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Specialization <span className="text-red-500">*</span></label>
            <select
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:bg-white outline-none transition-colors"
              required
            >
              <option value="" disabled>Select your specialization</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
          >
            {loading ? "Saving..." : "Submit Answers"}
          </button>
        </form>
      </div>
    </div>
  );
}
