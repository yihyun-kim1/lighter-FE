import { loginAtom } from "../atoms";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useState } from "react";

export const imageUrls = [
  "https://gloo-image-bucket.s3.amazonaws.com/archive/cover_1.png",
  "https://gloo-image-bucket.s3.amazonaws.com/archive/cover_2.png",
  "https://gloo-image-bucket.s3.amazonaws.com/archive/cover_3.png",
];

export const useMenu = () => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  return { showMenu, setShowMenu, toggleMenu, router };
};

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return "";
  const dateObject = new Date(dateString);
  const year = dateObject.getFullYear();
  const month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 +1, 두 자리로 맞춤
  const day = dateObject.getDate().toString().padStart(2, "0"); // 두 자리 맞춤
  return `${year}/${month}/${day}`;
}

export const getInitialLoginState = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    return {
      isLoggedIn: token !== null,
      accessToken: token,
    };
  }
  return {
    isLoggedIn: false,
    accessToken: null,
  };
};

export const toggleLoginState = () => {
  const router = useRouter();
  const [loginState, setLoginState] = useAtom(loginAtom);

  const handleToggleLogin = () => {
    setLoginState({
      isLoggedIn: loginState.isLoggedIn,
      accessToken: loginState.isLoggedIn ? null : loginState.accessToken,
    });
    if (loginState.isLoggedIn == true) {
      alert("로그아웃 되었습니다.");
    }
    router.push("/");
  };

  return handleToggleLogin;
};

export const randomImageUrl =
  imageUrls[Math.floor(Math.random() * imageUrls.length)];

export const getRandomImageUrl = () => {
  return imageUrls[Math.floor(Math.random() * imageUrls.length)];
};
