import { getCurrentSessions, getUserInfo } from "@/api/api";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { SessionInfo, UserInfo, WritingData } from "../interface";
import { getInitialLoginState } from "./utils/utils";

export const accessTokenAtom = atom<string | null>(null);

export const remainingTimeAtom = atom(0);
export const remainingTime2Atom = atom(0);

export const loginAtom = atom(
  getInitialLoginState(),
  (
    get,
    set,
    update: {
      accessToken: string | null;
      isLoggedIn: boolean;
    }
  ) => {
    set(loginAtom, update);
    if (update.accessToken) {
      localStorage.setItem("access_token", update.accessToken);
    } else {
      localStorage.removeItem("access_token");
    }
  }
);

export const userInfoAtom = atom<UserInfo | null>(null);
export const writingDataAtom = atom<WritingData | null>(null);
export const sessionDataAtom = atom<SessionInfo | null>(null);

export const useUserInfoAtom = () => {
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const [sessionInfo, setSessionInfo] = useAtom(sessionDataAtom);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          const userData = await getUserInfo(accessToken);
          setUserInfo(userData);
          if (!sessionInfo) {
            setSessionInfo(userData?.data?.writingSessions[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserInfo(null);
      }
    };

    fetchUserInfo();
  }, [setUserInfo]);

  return userInfo;
};

export const useWritingDataAtom = () => {
  const [writingData, setWritingData] = useAtom(writingDataAtom);

  useEffect(() => {
    const fetchWritingData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          const currentWritings = await getCurrentSessions(accessToken);
          setWritingData(currentWritings);
        }
      } catch (error) {
        console.error("Error fetching writing data:", error);
        setWritingData(null);
      }
    };

    fetchWritingData();
  }, [setWritingData]);

  return writingData;
};
