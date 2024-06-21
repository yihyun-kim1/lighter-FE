"use client";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAtom } from "jotai";
import {
  accessTokenAtom,
  loginAtom,
  userInfoAtom,
  writingDataAtom,
} from "../../../public/atoms";
import "../globals.css";
import BadgeItem from "../../components/BadgeItem";
import { useMenu } from "../../../public/utils/utils";
import MenuWithTopbar from "@/components/MenuWithTopbar";
import { SideMenu } from "@/components/SideMenu";

interface BadgeItem {
  badge: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
  };
  badgeId: number;
  createdAt: string;
  id: number;
  userId: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="absolute w-full h-full" onClick={onClose}></div>
      <div className="relative flex flex-col bg-white w-[800px] h-[550px] rounded-lg z-50">
        <div className="p-8">
          <div className="text-[16px]">4번째 글</div>
          <div className="mb-[10px] text-[22px]">뮤직비디오 해석하기</div>
          <textarea
            className="text-[40px] w-full mb-[30px] h-[50px]"
            placeholder="제목을 입력해주세요."
          />
          <hr
            className="w-full bg-[#7C766C] h-[1px] my-[17px]"
            style={{ color: "#7C766C", borderColor: "#7C766C" }}
          />
          <textarea
            className="mt-[30px] w-full h-[220px] overflow-y-auto"
            placeholder="내용을 입력해주세요."
          />
        </div>
        <div className="flex flex-col w-full rounded-md">
          <div
            className="h-[100px] flex justify-between  p-8 items-center rounded-md w-full"
            style={{ backgroundColor: "#F1F1F1" }}
          >
            <a className="items-start justify-start flex">남은 시간 01:03:55</a>
            <button
              className="w-[152px] h-[53px] rounded-md"
              style={{ backgroundColor: "#979797" }}
              onClick={onClose}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BadgeList() {
  const router = useRouter();
  const [accessToken] = useAtom(accessTokenAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const [writingData, setWritingData] = useAtom(writingDataAtom);
  const [loginState, setLoginState] = useAtom(loginAtom);
  const { showMenu, setShowMenu, toggleMenu } = useMenu();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
            loginState={loginState}
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
                  <div className="hidden lg:block text-black mt-[8px] lg:text-[32px] text-[25px] font-bold">
                    나의 뱃지
                  </div>
                </div>
                <div className="flex flex-col h-[759px] overflow-y-auto mt-[21px] mb-[21px] ">
                  {userInfo?.data?.userBadges.length === 0 && (
                    <div
                      className="flex text-[18px] w-[250px] h-[40px] font-bold"
                      style={{ color: "#D5C8AE" }}
                    >
                      아직 받은 뱃지가 없어요.
                    </div>
                  )}
                  {userInfo?.data?.userBadges.length !== 0 && (
                    <div>
                      <div
                        className="flex text-center items-center jusify-center text-[18px] bg-black w-[80px] h-[40px]"
                        style={{ color: "#D5C8AE" }}
                      >
                        <a className="flex items-center justify-center mx-auto">
                          나비
                        </a>
                      </div>
                      <div className="container space-between flex-wrap mt-[20px] xl:flex-nowrap flex flex-row gap-x-[26px] gap-y-[20px]">
                        {userInfo?.data?.userBadges?.map((item: any) => (
                          <BadgeItem
                            key={item.id}
                            badge={item.badge}
                            createdAt={item.createdAt}
                            badgeId={item.badgeId}
                            id={item.id}
                            userId={item.userId}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
