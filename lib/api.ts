import {
  LoginRequest,
  LoginResponse,
  InstituteResponse,
  StudentProgResponse,
  AttendanceResponse,
  TimetableResponse,
  TeachingContentResponse,
  ChapterListResponse,
  ChapterContentResponse,
} from "@/types/api";

const BASE_URL = "https://www.mycamu.co.in";
const PROXY_URL = "/api/proxy";

export class ApiService {
  // Helper to get auth headers
  private static getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    // Add session cookie if available
    const sessionCookie = StorageService.getSessionCookie();
    if (sessionCookie) {
      headers["x-session-cookie"] = sessionCookie;
    }
    
    return headers;
  }

  // Login and validate user
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${PROXY_URL}?endpoint=/login/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    // Extract and store session cookie from response
    const sessionCookie = response.headers.get("x-session-cookie");
    if (sessionCookie) {
      StorageService.saveSessionCookie(sessionCookie);
      console.log("Session cookie saved");
    }

    return response.json();
  }

  // Get institute details
  static async getInstituteDetails(InId: string): Promise<InstituteResponse> {
    const response = await fetch(`${PROXY_URL}?endpoint=/api/institute/getInstDtls`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ InId }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch institute details");
    }

    return response.json();
  }

  // Get student progression data
  static async getStudentProgression(
    studentIds: string[]
  ): Promise<StudentProgResponse> {
    const response = await fetch(`${PROXY_URL}?endpoint=/api/studentprog/getStudProg`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(studentIds),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch student progression");
    }

    return response.json();
  }

  // Get attendance data
  static async getAttendanceData(
    CmProgID: string
  ): Promise<AttendanceResponse> {
    const response = await fetch(`${PROXY_URL}?endpoint=/api/Attendance/getDtaForStupage`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ CmProgID }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch attendance data");
    }

    return response.json();
  }

  // Get attendance by subject
  static async getAttendanceBySubject(params: {
    CmProgID: string;
    isFE: boolean;
    AttenTy: string[];
    SubID: string;
  }) {
    const response = await fetch(
      `${PROXY_URL}?endpoint=/api/getAttendanceByAttTypAndSubj`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch subject attendance");
    }

    return response.json();
  }

  // Get timetable
  static async getTimetable(params: {
    InId: string;
    PrID: string;
    CrID: string;
    DeptID: string;
    AcYr: string;
    SemID: string;
    SecID: string;
  }): Promise<TimetableResponse> {
    const response = await fetch(`${PROXY_URL}?endpoint=/api/Timetable/get`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch timetable");
    }

    return response.json();
  }

  // Get teaching content (subjects)
  static async getTeachingContent(params: {
    StuID: string;
    SecID: string;
    SemID: string;
    AcYr: string;
    InId: string;
    PrID: string;
    CrID: string;
    DeptID: string;
  }): Promise<TeachingContentResponse> {
    const response = await fetch(`${PROXY_URL}?endpoint=/api/TeachContent/getTeachContent`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch teaching content");
    }

    return response.json();
  }

  // Get chapter names for a subject
  static async getChapterNames(
    CmID: string,
    SecID: string,
    StuID: string,
    SemID: string,
    AcYr: string,
    InId: string,
    PrID: string,
    CrID: string,
    DeptID: string
  ): Promise<ChapterListResponse> {
    const endpoint = `/api/TeachContent/getChapterNamesById/${CmID}/${SecID}/${StuID}/${SemID}/${AcYr}/${InId}/${PrID}/${CrID}/${DeptID}`;
    const response = await fetch(
      `${PROXY_URL}?endpoint=${encodeURIComponent(endpoint)}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch chapter names");
    }

    return response.json();
  }

  // Get chapter content
  static async getChapterContent(
    CmID: string,
    ChapID: string,
    SubChapID: string
  ): Promise<ChapterContentResponse> {
    const endpoint = `/api/TeachContent/getChapterContentByIds/${CmID}/${ChapID}/${SubChapID}`;
    const response = await fetch(
      `${PROXY_URL}?endpoint=${encodeURIComponent(endpoint)}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch chapter content");
    }

    return response.json();
  }
}

// Local Storage Management
export class StorageService {
  private static readonly KEYS = {
    LOGIN_DATA: "loginData",
    INSTITUTE_DATA: "instituteData",
    STUDENT_PROG_DATA: "studentProgData",
    ATTENDANCE_DATA: "attendanceData",
    TIMETABLE_DATA: "timetableData",
    TEACHING_CONTENT_DATA: "teachingContentData",
    IS_AUTHENTICATED: "isAuthenticated",
    SESSION_COOKIE: "sessionCookie",
  };

  static saveSessionCookie(cookie: string) {
    localStorage.setItem(this.KEYS.SESSION_COOKIE, cookie);
  }

  static getSessionCookie(): string | null {
    return localStorage.getItem(this.KEYS.SESSION_COOKIE);
  }

  static saveLoginData(data: LoginResponse) {
    localStorage.setItem(this.KEYS.LOGIN_DATA, JSON.stringify(data));
    localStorage.setItem(this.KEYS.IS_AUTHENTICATED, "true");
  }

  static getLoginData(): LoginResponse | null {
    const data = localStorage.getItem(this.KEYS.LOGIN_DATA);
    return data ? JSON.parse(data) : null;
  }

  static saveInstituteData(data: InstituteResponse) {
    localStorage.setItem(this.KEYS.INSTITUTE_DATA, JSON.stringify(data));
  }

  static getInstituteData(): InstituteResponse | null {
    const data = localStorage.getItem(this.KEYS.INSTITUTE_DATA);
    return data ? JSON.parse(data) : null;
  }

  static saveStudentProgData(data: StudentProgResponse) {
    localStorage.setItem(this.KEYS.STUDENT_PROG_DATA, JSON.stringify(data));
  }

  static getStudentProgData(): StudentProgResponse | null {
    const data = localStorage.getItem(this.KEYS.STUDENT_PROG_DATA);
    return data ? JSON.parse(data) : null;
  }

  static saveAttendanceData(data: AttendanceResponse) {
    localStorage.setItem(this.KEYS.ATTENDANCE_DATA, JSON.stringify(data));
  }

  static getAttendanceData(): AttendanceResponse | null {
    const data = localStorage.getItem(this.KEYS.ATTENDANCE_DATA);
    return data ? JSON.parse(data) : null;
  }

  static saveTimetableData(data: TimetableResponse) {
    localStorage.setItem(this.KEYS.TIMETABLE_DATA, JSON.stringify(data));
  }

  static getTimetableData(): TimetableResponse | null {
    const data = localStorage.getItem(this.KEYS.TIMETABLE_DATA);
    return data ? JSON.parse(data) : null;
  }

  static saveTeachingContentData(data: TeachingContentResponse) {
    localStorage.setItem(this.KEYS.TEACHING_CONTENT_DATA, JSON.stringify(data));
  }

  static getTeachingContentData(): TeachingContentResponse | null {
    const data = localStorage.getItem(this.KEYS.TEACHING_CONTENT_DATA);
    return data ? JSON.parse(data) : null;
  }

  static isAuthenticated(): boolean {
    return localStorage.getItem(this.KEYS.IS_AUTHENTICATED) === "true";
  }

  static clearAll() {
    Object.values(this.KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}
