// API Response Types

export interface LoginRequest {
  Email: string;
  pwd: string;
  dtype: string;
}

export interface LoginResponse {
  output: {
    data: {
      logindetails: LoginDetails;
      progressionData: ProgressionData[];
    };
    errors: null | string;
  };
}

export interface LoginDetails {
  _id: string;
  Email: string;
  Name: string;
  Type: string;
  Student: StudentInfo[];
  instLangs: string[];
  instDefaultLang: string;
  instTheme: string;
  instFntSze: number;
  instRTL: boolean;
  instFntStl: string;
}

export interface StudentInfo {
  ProfileId: string;
  _id: string;
  StuID: string;
  FNa: string;
  MNa: string;
  LNa: string;
  ApplnId: string;
  PhotoImgID: string;
  CurCrID: string;
  CurPrID: string;
}

export interface ProgressionData {
  _id: string;
  InId: string;
  StuID: string;
  CmProgID: string;
  InName: string;
  CrName: string;
  CrCode: string;
  DepName: string;
  DeptCode: string;
  AcYrNm: string;
  SemName: string;
  SemID: string;
  SecName: string;
  FNa: string;
  LNa: string;
  Sex: string;
  DOB: string;
  PhotoImgID: string;
  FatNa: string;
  MotNa: string;
  CnAdMob: string;
  CnEmail: string;
  AplnNum: string;
  AdmNum: string;
  address: Address;
  Menus: Menus;
  [key: string]: any;
}

export interface Address {
  AdL1: string;
  AdL2: string;
  AdL3: string;
  postcode: string;
  EmAd: string;
  PhNo: string;
}

export interface Menus {
  Activity: boolean;
  Assemnt: boolean;
  Assgnmnt: boolean;
  Attdn: boolean;
  Billing: boolean;
  TimeTable: boolean;
  Profile: boolean;
  [key: string]: boolean;
}

export interface InstituteResponse {
  output: {
    data: InstituteDetails[];
    errors: null | string;
  };
}

export interface InstituteDetails {
  _id: string;
  Name: string;
  address: Address;
  ReceiptImgID: string;
  theme: string;
  fntSze: number;
  fntStl: string;
  RTL: boolean;
}

export interface StudentProgResponse {
  output: {
    data: ProgressionData[];
    errors: null | string;
  };
}

export interface AttendanceResponse {
  output: {
    data: AttendanceData;
    errors: null | string;
  };
}

export interface AttendanceData {
  StuID: string;
  OvrAllPrcntg: number;
  CurMnthPrcntg: number;
  subjectList: SubjectAttendance[];
  OvrAllPCnt: number;
  OvrAllCnt: number;
  CurMPCnt: number;
  CurMCnt: number;
}

export interface SubjectAttendance {
  AttType: string;
  SubjId: string;
  SubjNm: string;
  SubjCd: string;
  pnt: number;
  prsentCnt: number;
  absentCnt: number;
  leaveCnt: number;
  all: number;
  p: number;
  prsPercnt: number;
  absPercnt: number;
  OvrAllPrcntg: number;
}

// Timetable Types
export interface TimetableResponse {
  output: {
    data: [TimetableEntry[], [], [], TimetableDateRange];
    errors: null | string;
  };
}

export interface TimetableEntry {
  _id: string;
  PerNm: string;
  FrTime: string;
  ToTime: string;
  SltDur: string;
  Day: number;
  title: string;
  SubNa?: string;
  SubCd?: string;
  StaffNm?: string;
  FacID?: string;
  SubID?: string;
  eventDate: string;
  desc?: string;
  type: string;
  color: string;
  textColor: string;
}

export interface TimetableDateRange {
  _id: string;
  StDt: string;
  EnDt: string;
  FrDate: string;
  ToDate: string;
}

// Teaching Content Types
export interface TeachingContentResponse {
  output: {
    data: TeachingContent[];
    errors: null | string;
  };
}

export interface TeachingContent {
  _id: string;
  SubjId: string;
  TPID: string;
  CmID: string;
  SubNa: string;
  SubjCode: string;
  DeptID: string;
  PrID: string;
  CrID: string;
  SemID: string;
}

export interface ChapterListResponse {
  output: {
    data: ChapterItem[];
    errors: null | string;
  };
}

export interface ChapterItem {
  ChapNm: string;
  SubChapNm: string;
  NofAttahmnts: number;
  ScNo: string;
  SortNo: number;
  ChapID: string;
  SubChapID: string;
  TargDt: string | null;
  CompDt: string | null;
}

export interface ChapterContentResponse {
  output: {
    data: ChapterContent;
    errors: null | string;
  };
}

export interface ChapterContent {
  SubjId: string;
  SubNa: string;
  ChapName: string;
  SubChapter: SubChapterDetails;
  isFE: boolean;
  PrID: string;
  CrID: string;
  DeptID: string;
  SemID: string;
}

export interface SubChapterDetails {
  Name: string;
  ScNo: string;
  Dur: number;
  _id: string;
  Obj: string;
  TeAct: string;
  LeAct: string;
  AsMet: string;
  TeAid: string;
  ConSum: string;
  ConAbs: string;
  webRef: string;
  txtBk: string;
  StFl: string;
  Attachments: Attachment[];
  posQus: any[];
}

export interface Attachment {
  AttachNm: string;
  AttachID: string;
  url: string;
  t: string;
  _id: string;
}
