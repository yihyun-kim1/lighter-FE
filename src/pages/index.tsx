"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "./globals.css";
import Image from "next/image";
import Script from "next/script";
import { useAtom } from "jotai";
import { accessTokenAtom, loginAtom } from "../../public/atoms";
import { LoginState } from "../../interface";

interface HomeProps {
  initialLoginState: LoginState;
}

export default function Home({ initialLoginState }: HomeProps) {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [loginState, setLoginState] = useAtom(loginAtom);
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
  const APP_KEY = "67511eea297fb0f856f791b369c67355";
  const REDIRECT_URI = "https://lighter-client.vercel.app";
  const link = `https://kauth.kakao.com/oauth/authorize?client_id=${APP_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  useEffect(() => {
    if (initialLoginState) {
      setLoginState(initialLoginState);
    }
  }, [initialLoginState]);

  const initKakao = () => {
    const Kakao = window.Kakao;
    if (Kakao && !Kakao.isInitialized()) {
      Kakao.init(APP_KEY);
      console.log(Kakao.isInitialized());
    }
  };

  useEffect(() => {
    initKakao();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getToken = async (code: string) => {
    try {
      const response = await fetch(
        `https://core.gloo-lighter.com/account/users/sign-in/kakao`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, redirectUri: REDIRECT_URI }),
        }
      );
      const data = await response.json();

      if (data?.data?.accessToken) {
        const accessToken = data?.data?.accessToken;
        localStorage.setItem("access_token", accessToken);
        setAccessToken(accessToken);
        setLoginState({
          accessToken,
          isLoggedIn: true,
        });
        if (data?.data?.isSignUp === true) {
          // 신규 회원가입인 경우 1
          router.push({
            pathname: "/session-settings",
          });
        } else if (data?.data?.hasOnProcessedWritingSession === true) {
          // 신규 아니고 + 세션 있음 2-a
          router.push({
            pathname: "/glooing",
          });
        }
        // 신규 아니고 + 세션 여부 2-b
        else if (
          data?.data?.writingSession &&
          data?.data?.hasOnProcessedWritingSession === false
        ) {
          router.push({
            pathname: "/completed",
          });
        } else {
          router.push({ pathname: "session-settings" });
        }
      }
    } catch (error) {
      console.error("Error during token request:", error);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const codeFromUrl = searchParams.get("code");

    if (codeFromUrl) {
      setCode(codeFromUrl);
      getToken(codeFromUrl);
    }
  }, []);

  const handleLoginClick = () => {
    if (code) {
      getToken(code);
    } else {
      window.location.href = link;
    }
  };

  return (
    <>
      <Script src="https://developers.kakao.com/sdk/js/kakao.js" />
      <div className="flex flex-col my-[50px]">
        <style>{`body { background: #F2EBDD; margin: 0; height: 100%; }`}</style>
        <div className="flex flex-row mx-auto">
          <div className="flex flex-col mx-[110px] lg:mx-[120px]">
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
            <div className="flex lg:my-[90px] gap-y-[56px] lg:gap-y-[0px] items-start lg:flex-row-reverse flex-col lg:justify-between">
              <div className="flex items-start lg:items-end lg:w-[876px] w-[541px] lg:h-[657px] h-[405px] border-1">
                <Image
                  src="https://gloo-image-bucket.s3.amazonaws.com/archive/badges.svg"
                  priority
                  width="875"
                  height="657"
                  alt="Badges"
                />
              </div>
              <div className="w-[368px] h-[264px] my-auto border-1">
                <div className="mb-[20px] text-[44px]">
                  <a className="font-bold">글로</a>
                  <br />
                  시작하는
                  <br />
                  <a className="font-bold">우리</a>의 이야기
                </div>

                <button
                  className="rounded-xl w-[200px] h-[42px] text-black"
                  style={{ backgroundColor: "#FFE000" }}
                  onClick={handleLoginClick}
                >
                  카카오 로그인
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
