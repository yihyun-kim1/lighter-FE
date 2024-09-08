"use client";
import { useRouter } from "next/router";
import React from "react";
import { useAtom } from "jotai";
import {
  accessTokenAtom,
  loginAtom,
  useUserInfoAtom,
} from "../../../public/atoms";
import "../globals.css";
import BadgeItem from "../../components/BadgeItem";
import { useMenu } from "../../../public/utils/utils";
import MenuWithTopbar from "@/components/MenuWithTopbar";
import { SideMenu } from "@/components/SideMenu";

export default function BadgeList() {
  const router = useRouter();
  const [accessToken] = useAtom(accessTokenAtom);
  const userInfo = useUserInfoAtom();
  const [loginState, setLoginState] = useAtom(loginAtom);
  const { showMenu, setShowMenu, toggleMenu } = useMenu();

  const showBadgeList = () => {
    if (!userInfo) {
      return <div className="text-[20px]">Loading...</div>;
    } else if (userInfo && userInfo != null) {
      return userInfo?.data?.userBadges?.map((item: any) => (
        <BadgeItem
          key={item?.id}
          badge={item?.badge}
          createdAt={item?.createdAt}
          badgeId={item?.badgeId}
          id={item?.id}
          userId={item?.userId}
        />
      ));
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
                        {showBadgeList()}
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
