"use client";
import "../globals.css";
import { unfinishedWritingSetUp } from "@/api/api";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import Dropdown from "@/components/Dropdown";
import {
  accessTokenAtom,
  useUserInfoAtom,
  useWritingDataAtom,
} from "../../../public/atoms";

export default function UnfinishedSettings() {
  const router = useRouter();
  const userInfo = useUserInfoAtom();
  const writingInfo = useWritingDataAtom();
  const lastSession = userInfo?.data?.writingSessions[0];
  const page = lastSession ? lastSession.page : 0;
  const uncompletedPage = lastSession
    ? lastSession.page - lastSession.progressStep
    : 0;
  const [isFirst, setIsFirst] = useState<boolean>(false);
  const [subject, setSubject] = useState(lastSession?.subject || "");
  const [period, setPeriod] = useState(0);
  const [startAt, setStartAt] = useState<
    [string, number | undefined, number | undefined]
  >(["", undefined, undefined]);
  const [writingHours, setWritingHours] = useState(0);
  const disabled =
    !period ||
    !startAt[0] ||
    startAt[1] == undefined ||
    startAt[2] == undefined ||
    !writingHours;

  const [accessToken] = useAtom(accessTokenAtom);
  const idAsString: string = lastSession?.id?.toString() || "";

  const handleStart = async () => {
    let adjustedHour = startAt[1] || 0;

    if (startAt[0] === "AM" && startAt[1] === 12) {
      adjustedHour = 0; // AM 0시로 설정
    }
    if (startAt[0] === "PM") {
      adjustedHour += 12; // PM
    }
    if (!accessToken) {
      console.error("Access token is not available");
      return;
    }

    try {
      const response = await unfinishedWritingSetUp(
        idAsString,
        {
          subject,
          period,
          page,
          startAt: { hour: adjustedHour, minute: startAt[2] },
          writingHours,
        },
        accessToken
      );

      setIsFirst(true);
      router.push({
        pathname: "/glooing",
        query: {
          isFirst: isFirst,
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  if (!writingInfo) return;
  return (
    <div className="flex flex-col my-[50px] w-full">
      <style>{`body { background: #F2EBDD; margin: 0; height: 100%; }`}</style>
      <div className="flex flex-row mx-auto w-full">
        <div className="flex flex-col w-full mx-[120px]">
          <div className="flex flex-row justify-between">
            <Image
              className="lg:mb-[20px] mb-0 w-[74px] lg:w-[105px] h-[24px] lg:h-[35px]"
              src="https://gloo-image-bucket.s3.amazonaws.com/archive/logo.svg"
              width="105"
              height="35"
              alt="Logo"
            />
          </div>
          <hr
            className="w-full bg-[#7C766C] h-[1px] lg:my-0 my-[17px]"
            style={{ color: "#7C766C", borderColor: "#7C766C" }}
          />
          <div className="flex flex-col mx-auto my-auto">
            <div className="flex w-full font-bold items-center justify-center mt-[20px] lg:mt-[40px] text-[30px] lg:text-[40px] h-[55px]">
              못다쓴 책을 이어서 작성해봐요
            </div>
            <div className="w-full text-center mt-[22px]">
              도전을 이어서 진행하시는군요!
              <br />
              <a className="w-full items-center justify-center">
                저번 도전에 대해 간단하게 설명드릴게요.
              </a>
            </div>
            <div className="my-[30px] text-[17px] flex flex-col items-center text-[#7C766C] gap-y-2">
              <a>
                글쓰기 주제는{" "}
                <a className="font-bold">{lastSession?.subject}</a>
                였어요.
              </a>
              <a>
                글쓰기 달성률은{" "}
                <a className="font-bold">{lastSession?.progressPercentage}</a>
                %였어요.
              </a>
              <a>
                <a className="font-bold">{lastSession?.page}</a>편 중{" "}
                <a className="font-bold">{uncompletedPage}</a>
                편만 더 작성하면 책을 완성할 수 있어요.
              </a>
            </div>

            <div>
              <div>
                <div className="flex flex-col mt-[20px] gap-y-[20px]">
                  <div className="flex flex-col gap-y-[20px]">
                    <a className="font-bold">1. 글쓰기 기간</a>
                    <div className="flex flex-row gap-x-[20px]">
                      <button
                        className={`w-[82px] h-[40px] border-1 rounded-md ${
                          period === 14 ? "bg-black text-white" : " bg-white"
                        }`}
                        onClick={() => setPeriod(14)}
                      >
                        14일
                      </button>
                      <button
                        className={`w-[82px] h-[40px] border-1 rounded-md ${
                          period === 30 ? "bg-black text-white" : " bg-white"
                        }`}
                        onClick={() => setPeriod(30)}
                      >
                        30일
                      </button>
                      <button
                        className={`w-[82px] h-[40px] border-1 rounded-md ${
                          period === 100 ? "bg-black text-white" : " bg-white"
                        }`}
                        onClick={() => setPeriod(100)}
                      >
                        100일
                      </button>
                      <textarea
                        className={`w-[82px] flex text-center items-center justify-center h-[40px] border-1 border-black rounded-lg`}
                        placeholder="직접입력"
                        style={{ lineHeight: "40px" }}
                        onChange={(e) => {
                          setPeriod(0);
                          const inputValue = e.target.value;
                          const numericValue = parseInt(inputValue, 10);
                          if (!isNaN(numericValue) && numericValue > 0) {
                            setPeriod(numericValue);
                          }
                        }}
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex flex-col gap-y-[20px] mt-[20px]">
                    <a className="font-bold">2. 글쓰기 시간</a>
                    <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-x-4">
                      <div className="flex flex-row gap-x-[20px]">
                        <button
                          className={`w-[82px] h-[40px] border-1 rounded-md ${
                            startAt[0] === "AM"
                              ? "bg-black text-white"
                              : " bg-white"
                          }`}
                          onClick={() => {
                            setStartAt(["AM", startAt[1], startAt[2]]);
                          }}
                        >
                          AM
                        </button>
                        <button
                          className={`w-[82px] h-[40px] border-1 rounded-md ${
                            startAt[0] === "PM"
                              ? "bg-black text-white"
                              : " bg-white"
                          }`}
                          onClick={() => {
                            setStartAt(["PM", startAt[1], startAt[2]]);
                          }}
                        >
                          PM
                        </button>
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
                            setStartAt([
                              startAt[0],
                              selectedHour.value,
                              startAt[2],
                            ]);
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
                            setStartAt([
                              startAt[0],
                              startAt[1],
                              selectedMinute.value,
                            ]);
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
                              setWritingHours(selectedForHours.value);
                            }}
                          />
                        </button>
                        <a className="ml-[20px] my-auto">동안</a>
                      </div>
                    </div>
                  </div>
                  <button
                    className={`rounded-md mx-auto mt-[100px] lg:w-[386px] w-[321px] font-bold lg:h-[62px] h-[48px] ${
                      disabled
                        ? "bg-gray-800 text-gray-600"
                        : "bg-orange-500 text-black"
                    }`}
                    onClick={handleStart}
                    disabled={disabled}
                  >
                    글쓰기 도전 시작
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
