"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/utils/Axios/AxiosInstance";
import { setUser } from "@/redux/features/Auth/authSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/UI/shadcn/card";
import { Button } from "@/components/UI/shadcn/button";
import { Skeleton } from "@/components/UI/shadcn/skeleton";
import { User, Mail, Shield, Building, Phone, BadgeCheck, PencilLine, Check } from "lucide-react";
import { toast } from "sonner";

export default function HomeLayout() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    department: "",
  });
  
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        department: user.department || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const updateToastId = toast.loading("Updating profile details...");
    
    try {
      const res = await axiosInstance.put("/auth/user", formData);
      dispatch(setUser(res.data.user));
      toast.success("Profile updated successfully!", { id: updateToastId });
      setEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to save profile updates.", { id: updateToastId });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8 max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const getRoleLabel = (role) => {
    const labels = {
      IT_VENDOR: "IT Vendor Partner",
      HIRING_MANAGER: "Hiring Manager",
    };
    return labels[role] || role;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">
          My Account
        </h1>
        <p className="text-sm text-gray-500 font-normal">
          Manage your personal details, role definitions, and business parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card Summary */}
        <Card className="shadow-sm border-gray-150 md:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border-2 border-indigo-100 shadow-inner">
                <User className="h-10 w-10" />
              </div>
              <span className="absolute bottom-0 right-0 p-1 bg-emerald-500 text-white rounded-full border-2 border-white">
                <BadgeCheck className="h-3.5 w-3.5" />
              </span>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-gray-900">
                {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || "User Profile"}
              </h3>
              <p className="text-xs text-indigo-600 font-semibold bg-indigo-50/50 px-2.5 py-0.5 rounded-full inline-block">
                {getRoleLabel(user.role)}
              </p>
            </div>

            <div className="w-full pt-4 border-t border-gray-100 space-y-2 text-left text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="truncate">{user.email}</span>
              </div>
              {user.tenant && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{user.tenant.companyName}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Form Card */}
        <Card className="shadow-sm border-gray-150 md:col-span-2">
          <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between py-4">
            <CardTitle className="text-base font-bold text-gray-800">Profile Details</CardTitle>
            {!editing && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs gap-1 border-gray-200"
                onClick={() => setEditing(true)}
              >
                <PencilLine className="h-3.5 w-3.5" /> Edit Profile
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!editing || saving}
                    className="w-full h-10 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 disabled:bg-gray-50 disabled:text-gray-500 transition-all font-medium"
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!editing || saving}
                    className="w-full h-10 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 disabled:bg-gray-50 disabled:text-gray-500 transition-all font-medium"
                    placeholder="Enter last name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={!editing || saving}
                    className="w-full h-10 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 disabled:bg-gray-50 disabled:text-gray-500 transition-all font-medium"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={!editing || saving}
                    className="w-full h-10 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 disabled:bg-gray-50 disabled:text-gray-500 transition-all font-medium"
                    placeholder="Enter department name"
                  />
                </div>
              </div>

              {editing && (
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-500"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        firstName: user.firstName || "",
                        lastName: user.lastName || "",
                        phoneNumber: user.phoneNumber || "",
                        department: user.department || "",
                      });
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="h-8 px-4 text-xs gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                    disabled={saving}
                  >
                    <Check className="h-4 w-4" /> Save Changes
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
