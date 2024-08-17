"use client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "../globals.css";
import { getCurrentSessions } from "@/api/api";
import Dropdown from "@/components/Dropdown";
import { SettingData } from "../../../interface";
import { useAtom } from "jotai";
import {
  accessTokenAtom,
  loginAtom,
  useWritingDataAtom,
} from "../../../public/atoms";
import { useMenu } from "../../../public/utils/utils";
import MenuWithTopbar from "@/components/MenuWithTopbar";
import { SideMenu } from "@/components/SideMenu";

export default function ChangeSettings() {
  const router = useRouter();
  const [accessToken] = useAtom(accessTokenAtom);
  const [currentSessionInfo, setCurrentSessionInfo] = useState<any>({});
  const { showMenu, setShowMenu, toggleMenu } = useMenu();
  const [writingTime, setWritingTime] = useState(
    parseInt(currentSessionInfo?.data?.startAt?.hour) < 12 ? "AM" : "PM"
  );
  const [editCount, setEditCount] = useState(0);
  const [isChanged, setIsChanged] = useState(false);
  const [loginState, setLoginState] = useAtom(loginAtom);
  const [changedData, setChangedData] = useState<SettingData>({
    // 초기 상태 설정
    page: 0,
    period: 0,
    startAt: { hour: 0, minute: 0 },
    subject: "",
    writingHours: 0,
  });

  const writingInfo = useWritingDataAtom();
  useEffect(() => {
    const fetchUserData = async () => {
      if (!accessToken) {
        console.error("Access token is not available");
        return;
      }
      try {
        const currentSessionInfo = await getCurrentSessions(accessToken);
        console.log("현재 글쓰기 데이터 정보: ", currentSessionInfo);
        setCurrentSessionInfo(currentSessionInfo);
        setChangedData({
          page: currentSessionInfo?.data?.page,
          period: currentSessionInfo?.data?.period,
          startAt: { hour: 0, minute: 0 },
          subject: currentSessionInfo?.data?.subject,
          writingHours: 0,
        });

        setWritingTime(
          parseInt(currentSessionInfo?.data?.startAt?.hour) < 12 ? "AM" : "PM"
        );
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    console.log("loginState 변경 ---------", loginState);
  }, [loginState]);

  const changeSessionSettings = async () => {
    console.log("바꿀 설정 정보: ", changedData);
    if (!accessToken) {
      console.error("Access token is not available");
      return;
    }
    try {
      setEditCount(editCount + 1);
      setIsChanged(true);
      setTimeout(() => {
        setIsChanged(false);
      }, 3000);
    } catch (error) {
      console.error("Error - change session setting :", error);
    }
  };

  return (
    <div className="flex flex-col my-[50px] w-full">
      <style>{`body { background: #F2EBDD; margin: 0; height: 100%; }`}</style>
      <div className="flex flex-row mx-auto w-full">
        <div className="flex flex-col w-full mx-[120px] sm:max-w-[682px] lg:max-w-none">
          <MenuWithTopbar
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            toggleMenu={toggleMenu}
            accessToken={accessToken}
            router={router}
          />
          <hr
            className="lg:block hidden w-full bg-[#7C766C] h-[1px] lg:my-0 sm:my-[17px]"
            style={{ color: "#7C766C", borderColor: "#7C766C" }}
          />
          <div className="flex mt-[20px] justify-between gap-x-[20px] lg:flex-row flex-col my-[30px]">
            <SideMenu
              accessToken={accessToken}
              loginState={loginState}
              router={router}
            />
            <div className="w-full max-w-[1120px] rounded-sm flex flex-row max-h-[797px]">
              <div className="w-full lg:ml-2">
                <div className="flex flex-row items-center ">
                  <div className="hidden lg:block w-[205px] text-black mt-[8px] lg:text-[32px] text-[25px] font-bold">
                    설정
                  </div>
                </div>
                <div className="flex text-[15px] lg:text-[20px] cursor-pointer text-[#918A7C] lg:mt-[20px]">
                  글쓰기 시간은 세션당 1번만 변경할 수 있어요.
                  {/* (
                  {writingInfo?.data?.modifyingCount}
                  ) */}
                </div>
                {/* <div
                  className="flex text-[14px] cursor-pointer mt-[8px]"
                  style={{ color: "#918A7C" }}
                >
                  *주 최대 2회 변경 가능하며, 설정을 변경한 날은 글을 쓸 수
                  없어요.
                  <br />
                </div> */}
                <div className="w-[250px] mt-[30px] flex flex-row gap-x-[14px]">
                  <button
                    className={`w-[60px] h-[30px] border-1 rounded-md ${
                      writingTime === "AM" ? "bg-black text-white" : " bg-white"
                    }`}
                    style={{ border: "1px solid gray" }}
                    onClick={() => setWritingTime("AM")}
                  >
                    AM
                  </button>
                  <button
                    className={`w-[60px] h-[30px] border-1 rounded-md ${
                      writingTime === "PM" ? "bg-black text-white" : " bg-white"
                    }`}
                    style={{ border: "1px solid gray" }}
                    onClick={() => setWritingTime("PM")}
                  >
                    PM
                  </button>
                </div>
                <div className="flex flex-col mt-[20px] lg:flex-row gap-y-4 lg:gap-x-4">
                  <div className="flex flex-row gap-x-[20px]">
                    <Dropdown
                      items={[
                        { name: "1시", value: 1 },
                        { name: "2시", value: 2 },
                        { name: "3시", value: 3 },
                        { name: "4시", value: 4 },
                        { name: "5시", value: 5 },
                        { name: "6시", value: 6 },
                        { name: "7시", value: 7 },
                        { name: "8시", value: 8 },
                        { name: "9시", value: 9 },
                        { name: "10시", value: 10 },
                        { name: "11시", value: 11 },
                        { name: "12시", value: 12 },
                      ]}
                      onSelect={(selectedHour) => {
                        const newHour =
                          writingTime === "PM" && selectedHour.value !== 12
                            ? selectedHour.value + 12
                            : writingTime === "AM" && selectedHour.value === 12
                            ? 0
                            : selectedHour.value;

                        setChangedData((prevData) => ({
                          ...prevData,
                          startAt: {
                            ...prevData.startAt,
                            hour: newHour,
                          },
                        }));
                      }}
                    />

                    <Dropdown
                      items={[
                        { name: "00분", value: 0 },
                        { name: "15분", value: 15 },
                        { name: "30분", value: 30 },
                        { name: "45분", value: 45 },
                      ]}
                      onSelect={(selectedMinute) => {
                        setChangedData((prevData) => ({
                          ...prevData,
                          startAt: {
                            ...prevData.startAt,
                            minute: selectedMinute.value,
                          },
                        }));
                      }}
                    />
                    <a className="my-auto">부터</a>
                  </div>
                  <div className="flex flex-row gap-x-4">
                    <button className="w-[82px] h-[40px] border-1 border-black rounded-md bg-white">
                      <Dropdown
                        items={[
                          { name: "1시간", value: 1 },
                          { name: "2시간", value: 2 },
                          { name: "3시간", value: 3 },
                          { name: "4시간", value: 4 },
                          { name: "5시간", value: 5 },
                        ]}
                        onSelect={(selectedForHours) => {
                          setChangedData((prevData) => ({
                            ...prevData,
                            writingHours: selectedForHours.value,
                          }));
                        }}
                      />
                    </button>
                    <a className="ml-[20px] my-auto">동안</a>
                  </div>
                </div>
                <button
                  className={`rounded-md mx-auto mt-[20px] w-[115px] h-[30px] text-[15px] ${
                    isChanged ? "bg-orange-500" : "bg-black"
                  } text-white`}
                  onClick={changeSessionSettings}
                >
                  {isChanged ? "변경 완료!" : "변경하기"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
