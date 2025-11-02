"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiService, StorageService } from "@/lib/api";
import { TimetableResponse, TimetableEntry } from "@/types/api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TimetablePage() {
  const router = useRouter();
  const [timetableData, setTimetableData] = useState<TimetableResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!StorageService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    loadTimetable();
  }, [router]);

  const loadTimetable = async () => {
    try {
      // Check if timetable is already cached
      const cachedTimetable = StorageService.getTimetableData();
      if (cachedTimetable) {
        setTimetableData(cachedTimetable);
        setLoading(false);
        return;
      }

      // Fetch timetable from API
      const loginData = StorageService.getLoginData();
      const progression = loginData?.output.data.progressionData[0];

      if (!progression) {
        throw new Error("No progression data found");
      }

      const timetable = await ApiService.getTimetable({
        InId: progression.InId,
        PrID: progression.PrID,
        CrID: progression.CrID,
        DeptID: progression.DeptID,
        AcYr: progression.YrOfAdm,
        SemID: progression.SemID,
        SecID: progression.SecID,
      });

      StorageService.saveTimetableData(timetable);
      setTimetableData(timetable);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load timetable");
    } finally {
      setLoading(false);
    }
  };

  const groupByDay = (entries: TimetableEntry[]) => {
    const grouped: { [key: number]: TimetableEntry[] } = {};
    entries.forEach((entry) => {
      if (!grouped[entry.Day]) {
        grouped[entry.Day] = [];
      }
      grouped[entry.Day].push(entry);
    });

    // Sort by time within each day
    Object.keys(grouped).forEach((day) => {
      grouped[Number(day)].sort((a, b) => a.FrTime.localeCompare(b.FrTime));
    });

    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading timetable...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const timetableEntries = timetableData?.output.data[0] || [];
  const groupedTimetable = groupByDay(timetableEntries);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Weekly Timetable</h1>
              <p className="text-sm text-gray-600">Your class schedule</p>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {DAYS.map((dayName, dayIndex) => {
            const dayNumber = dayIndex + 1;
            const dayEntries = groupedTimetable[dayNumber] || [];

            if (dayEntries.length === 0) return null;

            return (
              <div key={dayName} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-blue-600 px-6 py-3">
                  <h2 className="text-xl font-bold text-white">{dayName}</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {dayEntries.map((entry, index) => (
                      <div
                        key={index}
                        className={`border-l-4 pl-4 py-3 rounded-r-lg ${
                          entry.title.includes("Break")
                            ? "border-gray-400 bg-gray-50"
                            : "border-blue-500 bg-blue-50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {entry.SubNa || entry.title}
                            </h3>
                            {entry.SubCd && (
                              <p className="text-sm text-gray-600">{entry.SubCd}</p>
                            )}
                            {entry.StaffNm && (
                              <p className="text-sm text-gray-700 mt-1">
                                <span className="font-medium">Faculty:</span> {entry.StaffNm}
                              </p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-sm font-semibold text-gray-900">
                              {entry.FrTime} - {entry.ToTime}
                            </p>
                            <p className="text-xs text-gray-500">{entry.SltDur}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {Object.keys(groupedTimetable).length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No timetable data available</p>
          </div>
        )}
      </main>
    </div>
  );
}
