"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StorageService } from "@/lib/api";
import {
  LoginResponse,
  AttendanceResponse,
  InstituteResponse,
  StudentProgResponse,
} from "@/types/api";

export default function DashboardPage() {
  const router = useRouter();
  const [loginData, setLoginData] = useState<LoginResponse | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceResponse | null>(null);
  const [instituteData, setInstituteData] = useState<InstituteResponse | null>(null);
  const [studentProgData, setStudentProgData] = useState<StudentProgResponse | null>(null);

  useEffect(() => {
    // Check authentication
    if (!StorageService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Load data from localStorage
    setLoginData(StorageService.getLoginData());
    setAttendanceData(StorageService.getAttendanceData());
    setInstituteData(StorageService.getInstituteData());
    setStudentProgData(StorageService.getStudentProgData());
  }, [router]);

  const handleLogout = () => {
    StorageService.clearAll();
    router.push("/login");
  };

  if (!loginData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const student = loginData.output?.data?.logindetails?.Student?.[0];
  const progression = loginData.output?.data?.progressionData?.[0];
  const attendance = attendanceData?.output?.data;

  // Additional null checks
  if (!student || !progression) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <p>Error: Unable to load student data. Please try logging in again.</p>
          <button
            onClick={() => {
              StorageService.clearAll();
              router.push("/login");
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {instituteData?.output.data[0]?.Name || "MIET Portal"}
              </h1>
              <p className="text-sm text-gray-600">
                {instituteData?.output.data[0]?.address.AdL2}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <button
            onClick={() => router.push("/timetable")}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-left"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Timetable</h3>
                <p className="text-sm text-gray-600">View your schedule</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/courses")}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-left"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Course Materials</h3>
                <p className="text-sm text-gray-600">Study resources</p>
              </div>
            </div>
          </button>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Attendance</h3>
                <p className="text-sm text-gray-600">
                  {attendance?.OvrAllPrcntg ? `${attendance.OvrAllPrcntg}% Overall` : 'Loading...'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-start space-x-6">
            <div className="shrink-0">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">
                {student.FNa.charAt(0)}
                {student.LNa.charAt(0)}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {student.FNa} {student.MNa} {student.LNa}
              </h2>
              <p className="text-gray-600 mt-1">{progression.CnEmail}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500">Application No.</p>
                  <p className="font-semibold">{progression.AplnNum}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Admission No.</p>
                  <p className="font-semibold">{progression.AdmNum}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Course</p>
                  <p className="font-semibold">{progression.CrName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Semester</p>
                  <p className="font-semibold">{progression.SemName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Overview */}
        {attendance && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Attendance Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Overall Attendance</p>
                <p className="text-3xl font-bold text-blue-600">
                  {attendance.OvrAllPrcntg}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {attendance.OvrAllPCnt} / {attendance.OvrAllCnt} classes
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Current Month</p>
                <p className="text-3xl font-bold text-green-600">
                  {attendance.CurMnthPrcntg}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {attendance.CurMPCnt} / {attendance.CurMCnt} classes
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Subjects</p>
                <p className="text-3xl font-bold text-purple-600">
                  {attendance.subjectList.length}
                </p>
              </div>
            </div>

            {/* Subject-wise Attendance */}
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              Subject-wise Attendance
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Present
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Absent
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendance.subjectList.map((subject, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {subject.SubjNm}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {subject.SubjCd}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-green-600 font-semibold">
                        {subject.prsentCnt}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-red-600 font-semibold">
                        {subject.absentCnt}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-900">
                        {subject.all}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            subject.OvrAllPrcntg >= 75
                              ? "bg-green-100 text-green-800"
                              : subject.OvrAllPrcntg >= 60
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {subject.OvrAllPrcntg}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Attendance Data Message */}
        {!attendance && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-yellow-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-semibold text-yellow-900">Attendance data not available</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Please try refreshing the page or contact support if the issue persists.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Academic Details */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Academic Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-semibold text-gray-900">{progression.DepName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Department Code</p>
              <p className="font-semibold text-gray-900">{progression.DeptCode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Academic Year</p>
              <p className="font-semibold text-gray-900">{progression.AcYrNm}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Section</p>
              <p className="font-semibold text-gray-900">{progression.SecName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Program</p>
              <p className="font-semibold text-gray-900">{progression.PrName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-semibold text-green-600">{progression.stustatus}</p>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-semibold text-gray-900">
                {new Date(progression.DOB).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-semibold text-gray-900">
                {progression.Sex === "M" ? "Male" : "Female"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Father&apos;s Name</p>
              <p className="font-semibold text-gray-900">{progression.FatNa}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Mother&apos;s Name</p>
              <p className="font-semibold text-gray-900">{progression.MotNa}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Mobile</p>
              <p className="font-semibold text-gray-900">{progression.CnAdMob}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-semibold text-gray-900">
                {progression.CnAdL1}, {progression.CnAdL2}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
