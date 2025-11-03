"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiService, StorageService } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Step 1: Login
      const loginResponse = await ApiService.login({
        Email: email,
        pwd: password,
        dtype: "w",
      });

      console.log("Login Response:", loginResponse);

      if (loginResponse.output.errors) {
        throw new Error(loginResponse.output.errors);
      }

      // Save login data
      StorageService.saveLoginData(loginResponse);

      const { logindetails, progressionData } = loginResponse.output.data;

      console.log("Login Details:", logindetails);
      console.log("Progression Data:", progressionData);

      // Step 2: Get Institute Details
      if (logindetails.Student.length > 0 && progressionData.length > 0) {
        const instituteData = await ApiService.getInstituteDetails(
          progressionData[0].InId
        );
        console.log("Institute Data:", instituteData);
        StorageService.saveInstituteData(instituteData);

        // Step 3: Get Student Progression
        const studentId = logindetails.Student[0].StuID;
        const studentProgData = await ApiService.getStudentProgression([
          studentId,
        ]);
        console.log("Student Progression Data:", studentProgData);
        StorageService.saveStudentProgData(studentProgData);

        // Step 4: Get Attendance Data
        if (progressionData[0].CmProgID) {
          try {
            const attendanceData = await ApiService.getAttendanceData(
              progressionData[0].CmProgID
            );
            console.log("Attendance Data:", attendanceData);
            StorageService.saveAttendanceData(attendanceData);
          } catch (attErr) {
            console.error("Failed to fetch attendance:", attErr);
            // Continue even if attendance fails
          }
        }

        // Step 5: Get Timetable Data
        try {
          const timetableParams = {
            InId: progressionData[0].InId,
            PrID: progressionData[0].PrID,
            CrID: progressionData[0].CrID,
            DeptID: progressionData[0].DeptID,
            AcYr: progressionData[0].AcYr || progressionData[0]._id, // Try AcYr first, fallback to _id
            SemID: progressionData[0].SemID,
            SecID: progressionData[0].SecID,
          };
          
          console.log("Fetching timetable with params:", timetableParams);
          console.log("Full progression data:", progressionData[0]);
          
          const timetableData = await ApiService.getTimetable(timetableParams);
          console.log("Timetable Data:", timetableData);
          StorageService.saveTimetableData(timetableData);
        } catch (ttErr) {
          console.error("Failed to fetch timetable:", ttErr);
          // Continue even if timetable fails
        }

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        throw new Error("Invalid user data received");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            MIET Portal
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="your.email@mietjammu.in"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Model Institute of Engineering & Technology</p>
        </div>
      </div>
    </div>
  );
}
