"use client";
import { useRouter } from "next/router";
import React from "react";
import "../globals.css";
import { useAtom } from "jotai";
import {
  accessTokenAtom,
  sessionDataAtom,
  useUserInfoAtom,
  useWritingDataAtom,
} from "../../../public/atoms";
import MenuWithTopbar from "@/components/MenuWithTopbar";
import {
  formatDate,
  randomImageUrl,
  useMenu,
} from "../../../public/utils/utils";
import BookItem from "@/components/BookItem";

export default function NewBook() {
  const router = useRouter();
  const [accessToken] = useAtom(accessTokenAtom);
  const userInfo = useUserInfoAtom();
  const writingInfo = useWritingDataAtom();
  const [sessionData] = useAtom(sessionDataAtom);
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
          <div className="w-full flex mt-[30px] items-center justify-center flex-row my-[30px]">
            <div className="max-w-[1120px] rounded-sm border-1 flex flex-row">
              <div className="w-full ml-2">
                <div className="flex flex-col items-center gap-y-2">
                  <div className="w-full text-black mt-[18px] text-center text-[22px] font-bold">
                    전자책 발행을 축하드립니다!
                  </div>
                  <div>
                    나의 보관함 - 내가 발행한 책 메뉴에서 언제든지 확인이
                    가능합니다.
                  </div>
                </div>
                <div className="flex flex-col overflow-y-auto mt-5 mb-2 items-center justify-center">
                  <div className="mt-[40px] flex flex-row gap-x-[46px]">
                    {sessionData && (
                      <div>
                        <BookItem
                          id={sessionData?.id}
                          imageUrl={randomImageUrl}
                          title={sessionData?.subject}
                          date={formatDate(
                            writingInfo?.data?.nearestFinishDate
                          )}
                          username={userInfo?.data?.nickname}
                          session={sessionData}
                        />
                      </div>
                    )}
                  </div>
                  <div className="mt-[65px] flex flex-col gap-y-[17px]">
                    <button
                      className="bg-black text-[15px] w-[252px] h-[40px] rounded-md text-center text-white"
                      onClick={() =>
                        router.push({
                          pathname: "/mypage/finished",
                        })
                      }
                    >
                      확인
                    </button>
                    <button
                      style={{ backgroundColor: "#FF8126" }}
                      className="text-[15px] w-[252px] h-[40px] rounded-md text-center text-black "
                      onClick={() =>
                        router.push({
                          pathname: "/session-settings",
                        })
                      }
                    >
                      새로운 도전 시작하기
                    </button>
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
