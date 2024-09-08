export interface LoginState {
  isLoggedIn: boolean;
  accessToken: string | null;
}

export interface StartAt {
  hour: number;
  minute: number;
}

export interface UserInfo {
  success?: boolean;
  code?: string;
  data?: {
    createdAt: string;
    id: string;
    nickname: string;
    providerType: string;
    updatedAt: string;
    userBadges: Badge[];
    writingSessions: SessionInfo[];
  };
  statusCode?: number;
}

export interface SessionInfo {
  id: number;
  coverImageType: string | null;
  createdAt: string;
  finishDate: string;
  isActivated: boolean;
  modifyingCount: number;
  nearestFinishDate?: string;
  nearestStartDate?: string;
  page: number;
  period: number;
  progressPercentage: number;
  progressStep: number;
  startAt: StartAt;
  startDate: string;
  status: string;
  subject: string;
  updatedAt: string;
  userId: string;
  writingHours: number;
  writings: Writing[];
}

export interface Writing {
  content: string;
  createdAt: string;
  id: number;
  title: string;
}

export interface WritingData {
  code?: string;
  data: {
    coverImageType: string;
    createdAt: string;
    finishDate: string;
    id: number;
    isActivated: boolean;
    modifyingCount: number;
    nearestFinishDate?: string;
    nearestStartDate?: string;
    page: number;
    period: number;
    progressPercentage: number;
    progressStep: number;
    startAt: StartAt;
    startDate: string;
    status: string;
    subject: string;
    updatedAt: string;
    userId: string;
    writingHours: number;
    writings?: Writing[];
  };
  statusCode: number;
  success: boolean;
}

export interface SettingData {
  subject: string;
  period: number;
  page: number;
  startAt: StartAt;
  writingHours: number;
}

export interface Badge {
  badgeId: number;
  createdAt: string;
  id: number;
  userId: string;
}

export interface BadgeItemProps {
  badge: {
    condition?: string;
    description: string;
    id: number;
    imageUrl: string;
    name: string;
  };
  badgeId?: number;
  createdAt: string;
  id?: number;
  userId?: string;
}

export interface EditData {
  code: string;
  data: {
    content: string;
    createdAt: string;
    id: number;
    step: number;
    title: string;
    updatedAt: string;
    writingSession: SessionInfo;
    writingSessionId: number;
  };
  statusCode: number;
  success: boolean;
}

export interface BookItemProps {
  imageUrl: string;
  title: string;
  date: string;
  username?: string;
  id: number;
  session: SessionInfo;
}

export interface PostingInfo {
  code: string;
  data: {
    count: number;
    newBadges: Badge[];
    createdAt: string;
    id: string;
    nickname: string;
    providerType: string;
    updatedAt: string;
    userBadges: Badge[];
    writingSessions: WritingData[];
  };
  statusCode: number;
  success: boolean;
}

export interface NewWritingData {
  title: string | null;
  content: string | null;
}

export interface EditOrSetData {
  subject: string;
  period: number;
  page: number;
  startAt: { hour: number; minute?: number };
  writingHours: number;
}

export type MiniFunctionType = (value: boolean) => void;
export type RemainingTimeType = string | number;

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  id?: string;
  writingData: WritingData;
  remainingTime?: RemainingTimeType;
  textColor?: boolean;
  mini?: MiniFunctionType;
  remainingSecond?: RemainingTimeType;
  remainingTime2?: RemainingTimeType;
  postedWriting: PostingInfo;
  setPostedWriting: React.Dispatch<React.SetStateAction<PostingInfo>>;
}

export interface ProgressProps {
  progressPercentage: number | undefined;
}

export interface CardProps {
  title: string;
  description: string;
  route: string;
}
