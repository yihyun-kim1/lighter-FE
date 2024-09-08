"use client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "../globals.css";
import { useAtom } from "jotai";
import {
  accessTokenAtom,
  loginAtom,
  useUserInfoAtom,
  useWritingDataAtom,
} from "../../../public/atoms";
import BookItem from "../../components/BookItem";
import {
  formatDate,
  getRandomImageUrl,
  useMenu,
} from "../../../public/utils/utils";
import { SessionInfo, UserInfo } from "../../../interface";
import MenuWithTopbar from "@/components/MenuWithTopbar";
import { SideMenu } from "@/components/SideMenu";

const FinishedItem = ({ data }: UserInfo) => {
  const filteredWritingSessions = data?.writingSessions?.filter(
    (session: SessionInfo) =>
      session?.progressPercentage >= 75 && session?.status === "completed"
  );

  return (
    <div className="container space-between flex-wrap xl:flex-nowrap gap-x-[30px] flex flex-row max-h-[643px] overflow-y-auto mb-[21px]">
      {filteredWritingSessions && filteredWritingSessions?.length > 0 ? (
        filteredWritingSessions.map((session: any) => (
          <div key={session.id} className="mt-2 flex flex-row gap-x-[46px]">
            <BookItem
              id={session?.id}
              imageUrl={getRandomImageUrl()}
              title={session?.subject}
              date={formatDate(session?.finishDate)}
              username={data?.nickname}
              session={session}
            />
          </div>
        ))
      ) : (
        <div
          style={{ color: "#D5C8AE" }}
          className="mt-2 text-[15px] lg:text-[20px] font-bold"
        >
          아직 발행한 책이 없어요.
        </div>
      )}
    </div>
  );
};

export default function MyBook() {
  const router = useRouter();
  const [accessToken] = useAtom(accessTokenAtom);
  const { showMenu, setShowMenu, toggleMenu } = useMenu();
  const [loginState, setLoginState] = useAtom(loginAtom);
  const userInfo = useUserInfoAtom();
  const writingInfo = useWritingDataAtom();
  const filteredWritingSessions = userInfo?.data?.writingSessions?.filter(
    (session: SessionInfo) =>
      session?.progressPercentage >= 75 && session?.status === "completed"
  );

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
            className="lg:block hidden w-full bg-[#7C766C] h-[1px] sm:my-[17px] lg:my-0"
            style={{ color: "#7C766C", borderColor: "#7C766C" }}
          />
          <div className="flex mt-[20px] justify-between gap-x-[20px] lg:flex-row flex-col my-[30px]">
            <SideMenu
              accessToken={accessToken}
              loginState={loginState}
              router={router}
            />
            <div className="w-full max-w-[1120px] rounded-sm flex flex-row max-h-[797px]">
              <div className="w-full lg:ml-2 ">
                <div className="flex flex-row items-center ">
                  <div className="hidden lg:block w-full text-black mt-[8px] lg:text-[32px] text-[25px] font-bold">
                    내가 발행한 책 ({filteredWritingSessions?.length})
                  </div>
                </div>
                <div className="mt-2 text-[15px] lg:text-[20px]">
                  글쓰기 완료 달성한 전자책을 둘러보세요!
                </div>
                <div className="flex flex-col max-h-[643px] overflow-y-auto mb-2">
                  <div className="mt-2 flex flex-row gap-x-[46px]">
                    <div className=" mt-2 flex flex-row gap-x-[46px]">
                      <FinishedItem {...userInfo} />
                    </div>
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
