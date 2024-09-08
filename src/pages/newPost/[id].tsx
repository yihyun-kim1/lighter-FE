"use client";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAtom } from "jotai";
import "../globals.css";
import {
  accessTokenAtom,
  loginAtom,
  remainingTime2Atom,
} from "../../../public/atoms";
import { putWriting, submitWriting, temporarySaveWriting } from "@/api/api";
import React, { useEffect, useState } from "react";
import MenuWithTopbar from "@/components/MenuWithTopbar";
import { useMenu } from "../../../public/utils/utils";

const convertTimeToMinutes = (timeString: Number) => {
  const [hours, minutes, seconds] = timeString
    .toString()
    .split(":")
    .map(Number);
  return hours * 60 + minutes + seconds / 60;
};

export const NewWriting = () => {
  const router = useRouter();
  const { writingId } = router.query;
  const [accessToken] = useAtom(accessTokenAtom);
  const [loginState, setLoginState] = useAtom(loginAtom);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [remainingTime] = useAtom(remainingTime2Atom);
  const { showMenu, setShowMenu, toggleMenu } = useMenu();

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;

    // 최대 길이를 40으로 설정
    if (inputText.length <= 40) {
      // 40자 이내일 때만 setTitle 호출하여 상태 업데이트, 초과하면 무시
      setTitle(inputText);
    }
  };

  useEffect(() => {
    const saveOnUnload = async () => {
      if (accessToken && typeof writingId === "string") {
        try {
          await temporarySaveWriting(writingId, accessToken, {
            title,
            content,
          });
        } catch (error) {
          console.error("임시 저장에 실패했습니다.", error);
        }
      }
    };

    window.addEventListener("beforeunload", saveOnUnload);

    let intervalId: NodeJS.Timeout;
    if (accessToken && typeof writingId === "string") {
      intervalId = setInterval(async () => {
        try {
          await temporarySaveWriting(writingId, accessToken, {
            title,
            content,
          });
          console.log("임시 저장이 완료되었습니다.");
        } catch (error) {
          console.error("임시 저장에 실패했습니다.");
        }
      }, 30000); // 30초마다 호출
    }

    // 컴포넌트 언마운트 시 임시 저장 및 이벤트 리스너 제거
    return () => {
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener("beforeunload", saveOnUnload);
    };
  }, [writingId, accessToken, title, content]);

  const handlePost = async () => {
    // 모달 열기 전에 확인 모달을 띄우도록 수정
    setIsConfirmationModalOpen(true);
  };

  const handleCancelPost = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleConfirmPost = async () => {
    const writingData = {
      title: title || null, // 만약 title이 빈 문자열이면 null로 설정
      content: content || null, // 만약 content가 빈 문자열이면 null로 설정
    };
    const writingIdStr = Array.isArray(writingId) ? writingId[0] : writingId;

    if (typeof writingIdStr !== "string") {
      console.error("Invalid writing ID");
      return;
    }
    if (!accessToken) {
      console.error("Access token is not available");
      return;
    }

    try {
      const response = await submitWriting(
        writingData,
        writingIdStr,
        accessToken
      );

      const currentURL = window.location.href;
      const newURL = `${currentURL}`;
      window.history.replaceState({}, document.title, newURL);

      router.push({
        pathname: "/glooing",
        query: {
          mini: true,
        },
      });
    } catch (error) {
      console.error("Error saving writing:", error);
    }

    setIsConfirmationModalOpen(false);
  };

  return (
    <div className="w-full max-w-[1200px] rounded-sm flex flex-col mx-auto lg:my-[50px]">
      <style>{`body { background: #F2EBDD; margin: 0; height: 100%; }`}</style>
      <div className="hidden lg:block">
        <MenuWithTopbar
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          toggleMenu={toggleMenu}
          accessToken={accessToken}
          router={router}
        />
      </div>
      <hr
        className="lg:block hidden w-full bg-[#7C766C] h-[1px] sm:my-[17px] lg:my-0"
        style={{ color: "#7C766C", borderColor: "#7C766C" }}
      />
      <div className="w-full rounded-sm flex items-center flex-col">
        <div className="w-full h-[950px] mt-[30px] lg:h-[747px] lg:border-black lg:bg-[#E0D5BF] lg:my-[30px] mx-[30px]">
          <div
            className="lg:hidden block text-center mb-5 justify-center text-[20px]"
            style={{ color: "#202020" }}
          >
            글쓰기
          </div>
          <hr
            className="lg:hidden block w-full mx-5 items-center h-[1px]"
            style={{ color: "#DFD8CD", borderColor: "#DFD8CD" }}
          />

          <div className="flex flex-col items-between justify-between w-full h-full lg:bg-none">
            <div className="flex w-full px-[64px] pt-[32px] flex-col">
              <div className="w-full text-black text-[22px] lg:text-[36px]">
                <textarea
                  className="text-[20px] lg:text-[40px] resize-none w-full lg:mb-[10px] h-[30px] lg:h-[50px] bg-[#F2EBDD] lg:bg-[#E0D5BF]"
                  placeholder="제목을 입력해주세요."
                  value={title}
                  onChange={handleTitleChange}
                  maxLength={40}
                />
              </div>
            </div>
            <hr
              className="mx-[64px] items-center h-[1px]"
              style={{ color: "#7C766C", borderColor: "#7C766C" }}
            />
            <div
              className="flex px-[64px] py-[32px] items-center justify-center text-center h-full"
              style={{ color: "#706B61" }}
            >
              <textarea
                className="lg:mt-[20px] resize-none w-full h-full overflow-y-auto flex  bg-[#F2EBDD] lg:bg-[#E0D5BF]"
                placeholder="내용을 입력해주세요."
                value={content}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // 최대 입력 글자수 - 4000자로 제한
                  if (inputValue.length <= 4000) {
                    setContent(inputValue);
                  }
                }}
              />
            </div>
            <div className="flex flex-col rounded-md mx-[30px]">
              <div className="lg:h-[100px] flex justify-between px-[64px] py-[100px] lg:p-8 items-center rounded-md w-full">
                <a
                  className={`items-start justify-center lg:justify-start flex ${
                    convertTimeToMinutes(remainingTime) < 10
                      ? "text-orange-500"
                      : "text-black"
                  }`}
                >
                  남은 시간 {remainingTime}
                </a>
                <button
                  className={`w-[152px] items-center justify-center h-[53px] cursor-pointer rounded-md ${
                    title && content
                      ? "bg-orange-500 text-black"
                      : "bg-[#3F3F3F] text-[#8E887B]"
                  }`}
                  disabled={!title || !content}
                  onClick={handlePost}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isConfirmationModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <div
            className="absolute w-full h-full bg-gray-800 opacity-50"
            onClick={() =>
              router.push({
                pathname: "/mypage/glooing",
              })
            }
          ></div>
          <div className="flex flex-col bg-white w-[300px] h-[155px] text-center justify-center items-center rounded-lg z-50">
            <div className="p-8 ">
              <div className="text-[16px] mb-[30px]">
                해당 내용으로 발행하시겠습니까?
              </div>
              <div className="flex justify-center gap-x-[10px]">
                <button
                  className="w-[120px] text-[14px] cursor-pointer h-[40px] rounded-md"
                  style={{ backgroundColor: "#D9D9D9" }}
                  onClick={handleCancelPost}
                >
                  취소
                </button>
                <button
                  className="w-[120px] text-[14px] cursor-pointer h-[40px] rounded-md"
                  style={{ backgroundColor: "#FF8126" }}
                  onClick={handleConfirmPost}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewWriting;
