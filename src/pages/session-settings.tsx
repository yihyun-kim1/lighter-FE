"use client";
import "./globals.css";
import { postSetUp } from "@/api/api";
import axios from "axios";
import { fork } from "child_process";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Dropdown from "../components/Dropdown";
import { useAtom } from "jotai";
import { accessTokenAtom } from "../../public/atoms";

export default function Settings() {
  const router = useRouter();
  const [isFirst, setIsFirst] = useState<boolean>(false);
  const [subject, setSubject] = useState("");
  const [period, setPeriod] = useState(0);
  const [page, setPage] = useState(0);
  const [startAt, setStartAt] = useState<
    [string, number | undefined, number | undefined]
  >(["", undefined, undefined]);
  const [writingHours, setWritingHours] = useState(0);
  const disabled =
    !subject ||
    !period ||
    !page ||
    !startAt[0] ||
    startAt[1] == undefined ||
    startAt[2] == undefined ||
    !writingHours;

  const [accessToken] = useAtom(accessTokenAtom);

  useEffect(() => {
    console.log("subject updated:", subject);
    console.log("period updated:", period);
    console.log("page updated:", page);
    console.log("start_time updated:", startAt);
    console.log("for_hours updated:", writingHours);
  }, [subject, period, page, startAt, writingHours]);

  // 시작하기 버튼 클릭 시 서버로 설정된 값들을 전송
  const isPageValid = page < 10; // 10 미만이면 필수 필드 채워지지 않은 것으로 간주
  const handleStart = async () => {
    let adjustedHour = startAt[1] || 0; // 초기값은 그대로

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
      const response = await postSetUp(
        {
          subject,
          period,
          page,
          startAt: { hour: adjustedHour, minute: startAt[2] },
          writingHours,
        },
        accessToken
      );

      console.log(response.data, "============");
      setIsFirst(true);
      router.push({
        pathname: "/glooing",
        query: {
          isFirst: isFirst,
        },
      });
      // 서버 응답에 따른 처리 추가
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col my-[50px] w-full">
      <style>{`body { background: #F2EBDD; margin: 0; height: 100%; color: black;}`}</style>
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
          <div className="flex flex-col mx-auto">
            <div className="flex w-full font-bold items-center justify-center mt-[20px] lg:mt-[40px] text-[30px] lg:text-[40px] h-[55px]">
              글쓰기의 첫걸음
            </div>
            <div className="w-full text-center mt-[22px]">
              평소 흥미로웠던 주제로 정해진 시간에 글을 쓰는 연습을 함께 해봐요.
              <br />
              <a className="w-full items-center justify-center font-bold">
                타이머가 설정되어 설정한 시간에만 글을 쓸 수 있어요!
              </a>
            </div>
            <div className="flex flex-col items-center justify-center  h-[70px] mt-[40px]">
              <div className="flex w-full font-bold items-center justify-center text-[18px] lg:text-[22px]">
                어떤 주제로 글을 써볼까요?
              </div>
              <div
                className="text-[10px] lg:text-[12px] my-2"
                style={{ color: "#FF8126" }}
              >
                *10자 이내로 작성해주세요.
              </div>
            </div>
            <textarea
              className="w-[466px] lg:w-[593px] rounded-md h-[48px] mx-auto text-center flex items-center justify-center"
              placeholder="ex. 뮤직 비디오, 리뷰, 영화, 맛집 탐방 기록"
              value={subject}
              style={{ lineHeight: "45px" }}
              onChange={(e) => {
                const inputText = e.target.value;
                if (inputText.length <= 10) {
                  setSubject(inputText);
                }
              }}
            ></textarea>
            <div className="flex w-full items-center font-bold justify-center mt-[50px] lg:mt-[60px] text-[18px] lg:text-[22px] h-[30px]">
              글쓰기 목표를 설정해보아요!
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
                          period === 3 ? "bg-black text-white" : " bg-white"
                        }`}
                        onClick={() => setPeriod(3)}
                      >
                        3일
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-[20px]">
                    <a className="font-bold">2. 글쓰기 페이지 수</a>
                    <div className="flex flex-row gap-x-[20px]">
                      <button
                        className={`w-[82px] h-[40px] border-1 rounded-md ${
                          page === 10 ? "bg-black text-white" : " bg-white"
                        }`}
                        onClick={() => {
                          setPage(10);
                        }}
                      >
                        10편
                      </button>
                      <button
                        className={`w-[82px] h-[40px] border-1 rounded-md ${
                          page === 20 ? "bg-black text-white" : " bg-white"
                        }`}
                        onClick={() => {
                          setPage(20);
                        }}
                      >
                        20편
                      </button>
                      <button
                        className={`w-[82px] h-[40px] border-1 rounded-md ${
                          page === 3 ? "bg-black text-white" : " bg-white"
                        }`}
                        onClick={() => {
                          setPage(3);
                        }}
                      >
                        3편
                      </button>
                      <textarea
                        className={`w-[82px] flex text-center items-center justify-center h-[40px] border-1 border-black rounded-lg`}
                        placeholder="직접입력"
                        style={{ lineHeight: "40px" }}
                        onChange={(e) => {
                          setPage(0);
                          const inputValue = e.target.value;
                          const numericValue = parseInt(inputValue, 10); // 문자열을 숫자로 변환
                          // 숫자로 변환 가능한 경우에만 set
                          if (!isNaN(numericValue) && numericValue >= 10) {
                            setPage(numericValue);
                          }
                        }}
                      ></textarea>
                      {isPageValid ? (
                        <div
                          className="items-center flex text-[10px]"
                          style={{ color: "#FF8126" }}
                        >
                          *10편 이상 입력해주세요.
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-[20px]">
                    <a className="font-bold">3. 글쓰기 시간</a>
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
                    className={`rounded-md mx-auto mt-[30px] lg:w-[386px] w-[321px] font-bold lg:h-[62px] h-[48px] ${
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
