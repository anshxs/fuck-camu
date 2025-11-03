"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiService, StorageService } from "@/lib/api";
import {
  TeachingContentResponse,
  TeachingContent,
  ChapterItem,
  ChapterContent,
} from "@/types/api";

export default function CoursesPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<TeachingContent[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<TeachingContent | null>(null);
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<ChapterContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!StorageService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    loadSubjects();
  }, [router]);

  const loadSubjects = async () => {
    try {
      const cachedContent = StorageService.getTeachingContentData();
      if (cachedContent?.output?.data) {
        setSubjects(cachedContent.output.data);
        setLoading(false);
        return;
      }

      const loginData = StorageService.getLoginData();
      const progression = loginData?.output?.data?.progressionData?.[0];
      const student = loginData?.output?.data?.logindetails?.Student?.[0];

      if (!progression || !student) {
        throw new Error("No student data found");
      }

      const content = await ApiService.getTeachingContent({
        StuID: student.StuID,
        SecID: progression.SecID,
        SemID: progression.SemID,
        AcYr: progression.YrOfAdm,
        InId: progression.InId,
        PrID: progression.PrID,
        CrID: progression.CrID,
        DeptID: progression.DeptID,
      });

      if (content?.output?.data) {
        StorageService.saveTeachingContentData(content);
        setSubjects(content.output.data);
      } else {
        throw new Error("Invalid teaching content response");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const loadChapters = async (subject: TeachingContent) => {
    setSelectedSubject(subject);
    setSelectedChapter(null);
    setLoadingChapters(true);

    try {
      const loginData = StorageService.getLoginData();
      const progression = loginData?.output?.data?.progressionData?.[0];
      const student = loginData?.output?.data?.logindetails?.Student?.[0];

      if (!progression || !student) return;

      const chapterList = await ApiService.getChapterNames(
        subject.CmID,
        progression.SecID,
        student.StuID,
        progression.SemID,
        progression.YrOfAdm,
        progression.InId,
        progression.PrID,
        progression.CrID,
        progression.DeptID
      );

      if (chapterList?.output?.data) {
        setChapters(chapterList.output.data);
      }
    } catch (err) {
      console.error("Failed to load chapters:", err);
    } finally {
      setLoadingChapters(false);
    }
  };

  const loadChapterContent = async (chapter: ChapterItem) => {
    if (!selectedSubject) return;
    setLoadingContent(true);

    try {
      const content = await ApiService.getChapterContent(
        selectedSubject.CmID,
        chapter.ChapID,
        chapter.SubChapID
      );

      if (content?.output?.data) {
        setSelectedChapter(content.output.data);
      }
    } catch (err) {
      console.error("Failed to load chapter content:", err);
    } finally {
      setLoadingContent(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Materials</h1>
              <p className="text-sm text-gray-600">Access your study materials</p>
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
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subjects List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Subjects</h2>
              <div className="space-y-2">
                {subjects.map((subject) => (
                  <button
                    key={subject._id}
                    onClick={() => loadChapters(subject)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      selectedSubject?._id === subject._id
                        ? "bg-blue-100 border-2 border-blue-500"
                        : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{subject.SubNa}</p>
                    <p className="text-sm text-gray-600">{subject.SubjCode}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chapters and Content */}
          <div className="lg:col-span-2">
            {!selectedSubject ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-500">Select a subject to view chapters</p>
              </div>
            ) : loadingChapters ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Selected Subject Header */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900">{selectedSubject.SubNa}</h2>
                  <p className="text-gray-600">{selectedSubject.SubjCode}</p>
                </div>

                {/* Chapters List */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Chapters</h3>
                  <div className="space-y-2">
                    {chapters.map((chapter) => (
                      <button
                        key={chapter.SubChapID}
                        onClick={() => loadChapterContent(chapter)}
                        className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition border-2 border-transparent hover:border-blue-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{chapter.ChapNm}</p>
                            <p className="text-sm text-gray-600 mt-1">{chapter.SubChapNm}</p>
                          </div>
                          {chapter.NofAttahmnts > 0 && (
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {chapter.NofAttahmnts} files
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chapter Content */}
                {loadingContent ? (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : selectedChapter ? (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {selectedChapter.ChapName}
                    </h3>
                    <p className="text-gray-700 mb-6">{selectedChapter.SubChapter.Name}</p>

                    {/* Learning Objectives */}
                    {selectedChapter.SubChapter.Obj && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Learning Objectives</h4>
                        <p className="text-gray-700 whitespace-pre-line">
                          {selectedChapter.SubChapter.Obj}
                        </p>
                      </div>
                    )}

                    {/* Content Summary */}
                    {selectedChapter.SubChapter.ConSum && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Content Summary</h4>
                        <p className="text-gray-700">{selectedChapter.SubChapter.ConSum}</p>
                      </div>
                    )}

                    {/* Web References */}
                    {selectedChapter.SubChapter.webRef && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Web References</h4>
                        <a
                          href={selectedChapter.SubChapter.webRef}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedChapter.SubChapter.webRef}
                        </a>
                      </div>
                    )}

                    {/* Textbooks */}
                    {selectedChapter.SubChapter.txtBk && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Textbooks</h4>
                        <p className="text-gray-700 whitespace-pre-line">
                          {selectedChapter.SubChapter.txtBk}
                        </p>
                      </div>
                    )}

                    {/* Attachments */}
                    {selectedChapter.SubChapter.Attachments.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Study Materials</h4>
                        <div className="space-y-2">
                          {selectedChapter.SubChapter.Attachments.map((attachment) => (
                            <a
                              key={attachment._id}
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                            >
                              <div className="flex items-center">
                                <svg
                                  className="w-6 h-6 text-blue-600 mr-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                <span className="font-medium text-gray-900">
                                  {attachment.AttachNm}
                                </span>
                              </div>
                              <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
