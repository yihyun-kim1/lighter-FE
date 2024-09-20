import router from "next/router";
import React from "react";
import { sessionDataAtom } from "../../public/atoms";
import { useAtom } from "jotai";
import { BookItemProps } from "../../interface";
import Image from "next/image";

const BookItem: React.FC<BookItemProps> = ({
  imageUrl,
  title,
  date,
  username,
  id,
  session,
}) => {
  const [, setSessionData] = useAtom(sessionDataAtom);

  const handleClick = () => {
    setSessionData(session);
    setTimeout(() => {
      router.push({
        pathname: "/mypage/detail",
      });
    }, 0);
  };

  return (
    <div>
      <div
        className="w-[217px] h-[317px] relative"
        style={{ backgroundColor: "#D5C8AE", border: "1px solid gray" }}
      >
        <Image
          className="z-50"
          src={imageUrl}
          alt={session?.subject}
          width={217}
          height={317}
        />
        <a className="absolute bottom-60 left-8 right-0 text-white px-2 py-1">
          {session?.subject}
        </a>
        <a className="absolute bottom-10 right-2 text-white px-2 py-1 text-[14px]">
          {username}
        </a>
      </div>
      <div
        className="mt-[20px] text-[20px] cursor-pointer"
        onClick={handleClick}
      >
        {session?.subject}
      </div>
      <div className="mt-[10px] text-[16px]" style={{ color: "#8A8170" }}>
        {date}
      </div>
    </div>
  );
};

export default BookItem;
