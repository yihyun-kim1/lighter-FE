"use client";
import { useRouter } from "next/router";
import React from "react";
import "./globals.css";
import { useAtom } from "jotai";
import { accessTokenAtom, sessionDataAtom } from "../../public/atoms";
import { formatDate, useMenu } from "../../public/utils/utils";
import MenuWithTopbar from "@/components/MenuWithTopbar";
import { CardProps, ProgressProps } from "../../interface";

const Progress: React.FC<ProgressProps> = ({ progressPercentage }) => (
  <div className="flex flex-col mt-[40px] gap-x-[46px] gap-y-2">
    <div className="flex flex-row items-center justify-between">
      <div>글쓰기 목표 달성률</div>
      <div className="text-[24px] font-bold">{progressPercentage}%</div>
    </div>
    <div
      className="w-[498px] h-3 flex items-center rounded-xl"
      style={{
        backgroundColor: "#DADADA",
      }}
    >
      <div
        className="h-3 rounded-xl"
        style={{
          width: `${progressPercentage}%`,
          backgroundColor: "#FF8126",
          transition: "width 0.5s ease",
        }}
      ></div>
    </div>
  </div>
);

const Card: React.FC<CardProps> = ({ title, description, route }) => {
  const router = useRouter();

  return (
    <div
      className="flex flex-col gap-y-2 w-[161px] h-[200px] rounded-md px-3 py-3 cursor-pointer"
      style={{
        backgroundColor: "#FFFCF6",
        border: "1px solid black",
        borderColor: "black",
      }}
      onClick={() => router.push(route)}
    >
      <span className="font-bold">{title}</span>
      <span>{description}</span>
    </div>
  );
};

export default function CompletedPage() {
  const [sessionData, setSessionData] = useAtom(sessionDataAtom);
  const router = useRouter();
  const [accessToken] = useAtom(accessTokenAtom);
  const { showMenu, setShowMenu, toggleMenu } = useMenu();

  return (
    <div className="flex flex-col my-[50px] w-full">
      <style>{`body { background: #F2EBDD; margin: 0; height: 100%; }`}</style>
      <div className="flex flex-row mx-auto w-full">
        <div className="flex flex-col w-full mx-[120px]">
          <MenuWithTopbar
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            toggleMenu={toggleMenu}
            accessToken={accessToken}
            router={router}
          />
          <hr
            className="w-full bg-[#7C766C] h-[1px] lg:my-0 my-[17px]"
            style={{ color: "#7C766C", borderColor: "#7C766C" }}
          />
          <div className="w-full flex mt-[20px] items-center justify-center flex-row my-[30px]">
            <div className="max-w-[1120px] rounded-sm  border-1 flex flex-row">
              <div className="flex flex-col w-full ml-2 my-[70px]">
                <div className="flex flex-col items-center gap-y-2">
                  <div className="w-full text-black text-center text-[22px] font-bold">
                    <span className="relative">
                      <span className="bg-[#FF8126] opacity-[47%] absolute top-2 left-0 right-0 h-[20px]"></span>
                      <span className="relative">{sessionData?.subject}</span>
                    </span>
                    <br />
                    {sessionData?.progressPercentage &&
                    sessionData?.progressPercentage >= 75
                      ? "글쓰기 도전을 성공했어요!"
                      : "글쓰기 도전이 끝났어요!"}
                  </div>
                  <div className="mt-[12px] text-[#8C8575]">
                    {" "}
                    {formatDate(sessionData?.startDate)} ~
                    {formatDate(sessionData?.finishDate)}
                  </div>
                </div>
                <div className="flex flex-col overflow-y-auto mt-5 mb-2 items-center justify-center">
                  <Progress
                    progressPercentage={sessionData?.progressPercentage}
                  />
                  <div className="flex flex-row items-center my-[50px] gap-x-[15px]">
                    {sessionData?.progressPercentage &&
                    sessionData?.progressPercentage >= 75 ? (
                      <Card
                        title="내가 발행한 전자책"
                        description="보러가기"
                        route="/mypage/finished"
                      />
                    ) : (
                      <Card
                        title="새로운 주제"
                        description="글쓰기 도전 시작"
                        route="/session-settings"
                      />
                    )}
                    {sessionData?.progressPercentage &&
                    sessionData?.progressPercentage >= 75 ? (
                      <Card
                        title="새로운 주제"
                        description="글쓰기 도전 시작"
                        route="/session-settings"
                      />
                    ) : (
                      <Card
                        title="지금 주제"
                        description="이어서 글쓰기"
                        route="/mypage/unfinished-settings"
                      />
                    )}
                    <Card
                      title="이전에 쓰던 주제"
                      description="이어서 글쓰기"
                      route="/mypage/unfinished"
                    />
                  </div>
                  <div className="flex flex-col mt-[100px] text-[#8C8575]">
                    시도하지 않으면 아무것도 얻을 수 없다.
                    <br />
                    도전하는 당신이 진정한 승리자입니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
