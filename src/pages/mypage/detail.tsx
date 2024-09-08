"use client";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import "../globals.css";
import { useAtom } from "jotai";
import {
  accessTokenAtom,
  sessionDataAtom,
  useUserInfoAtom,
  useWritingDataAtom,
} from "../../../public/atoms";
import {
  formatDate,
  randomImageUrl,
  useMenu,
} from "../../../public/utils/utils";
import BookItem from "@/components/BookItem";
import MenuWithTopbar from "@/components/MenuWithTopbar";
import { Writing } from "../../../interface";

export default function SelectedItemDetail() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
  const userInfo = useUserInfoAtom();
  const { showMenu, setShowMenu, toggleMenu } = useMenu();
  const [sessionData] = useAtom(sessionDataAtom);

  useEffect(() => {
    setAccessToken(accessToken);
  }, [accessToken, setAccessToken]);

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
            <div className="w-full max-w-[1120px] rounded-sm flex flex-row max-h-[797px]">
              <div className="w-full lg:ml-2 ">
                <div className="flex flex-col max-h-[643px] overflow-y-auto mt-[21px] mb-[21px] ">
                  <div className="flex flex-row gap-x-[20px] relative">
                    <div
                      className="w-[217px] h-[317px]"
                      style={{
                        backgroundColor: "#D5C8AE",
                        border: "1px solid gray",
                      }}
                    >
                      {sessionData && (
                        <div className="flex flex-row gap-x-[46px]">
                          <BookItem
                            id={sessionData?.id}
                            imageUrl={randomImageUrl}
                            title={sessionData?.subject}
                            date={formatDate(sessionData?.nearestFinishDate)}
                            username={userInfo?.data?.nickname}
                            session={sessionData}
                          />
                        </div>
                      )}
                    </div>
                    <div className="justify-end gap-y-2 flex flex-col">
                      <div
                        className="mt-[10px] lg:text-[20px] text-[16px]"
                        style={{ color: "#8A8170" }}
                      >
                        {formatDate(sessionData?.finishDate)} 완료
                      </div>
                      <div className="lg:text-[20px] text-[16px]">
                        총 {sessionData?.progressStep ?? 0}/{sessionData?.page}
                        편
                      </div>
                      <div className="flex flex-row gap-x-5">
                        <button
                          className="rounded-lg text-[14px] bg-black  text-white lg:text-[16px] lg:rounded-xl w-[150px] lg:w-[200px] h-[30px] lg:h-[42px]"
                          onClick={() => router.back()}
                        >
                          목록으로 돌아가기
                        </button>
                        {sessionData &&
                          sessionData?.progressPercentage < 100 && (
                            <button
                              className="rounded-lg text-[14px] bg-orange-500 text-black lg:text-[16px] lg:rounded-xl w-[150px] lg:w-[200px] h-[30px] lg:h-[42px]"
                              onClick={() =>
                                router.push({
                                  pathname: "/mypage/unfinished-settings",
                                })
                              }
                            >
                              이어서 진행하기
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col mt-[30px] max-h-[500px]">
                  <div className="font-bold text-[20px]">기록한 글</div>
                  {sessionData && sessionData?.progressPercentage > 0 ? (
                    <div className="flex flex-col gap-y-2 lg:gap-y-4 my-5 overflow-y-scroll rounded-xl">
                      {sessionData?.writings?.map(
                        (writing: Writing, index: number) => (
                          <div
                            key={index}
                            className="flex cursor-pointer px-5 py-5 flex-row w-full h-52 rounded-xl"
                            style={{ backgroundColor: "#E0D5BF" }}
                          >
                            <div className="my-3 mx-3">
                              <div className="w-full h-10 text-xl">
                                {writing?.title}
                              </div>
                              <div
                                className="mt-3 max-w-full truncate text-base"
                                style={{ color: "#C5BCAB" }}
                              >
                                {writing?.content}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="mt-5">
                      <div className="flex flex-col gap-y-2">
                        <a>이전에 기록한 글이 없어요.</a>
                        <a>
                          <a className="text-orange-500 font-bold">
                            이어서 진행하기
                          </a>
                          를 눌러 책을 완성해보세요!
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
