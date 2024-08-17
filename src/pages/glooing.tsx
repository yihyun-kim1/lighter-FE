// @ts-nocheck
"use client";
import {
  getWritingInfo,
  putWriting,
  startWriting,
  temporarySaveWriting,
} from "@/api/api";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "./globals.css";
import { day } from "@/lib/dayjs";
import Image from "next/image";
import { ModalProps, PostingInfo } from "../../interface";
import { formatDate } from "../../public/utils/utils";
import { useAtom } from "jotai";
import {
  loginAtom,
  accessTokenAtom,
  remainingTimeAtom,
  remainingTime2Atom,
  useUserInfoAtom,
  useWritingDataAtom,
} from "../../public/atoms";
import { useMenu } from "../../public/utils/utils";
import MenuWithTopbar from "../components/MenuWithTopbar";

const EditModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  data,
  id,
  editData,
}) => {
  const [title, setTitle] = useState(editData?.title || "");
  const [content, setContent] = useState(editData?.content || "");
  const [accessToken] = useAtom(accessTokenAtom);
  const [isConfirmationModal2Open, setIsConfirmationModal2Open] =
    useState(false);
  const isChanged =
    !!editData && (title !== editData.title || content !== editData.content);

  useEffect(() => {
    setTitle(editData?.title || "");
    setContent(editData?.content || "");
  }, [editData]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isOpen) {
      intervalId = setInterval(async () => {
        try {
          await temporarySaveWriting(id, accessToken, { title, content });
          alert("임시 저장이 완료되었습니다.");
        } catch (error) {
          alert("임시 저장에 실패했습니다.");
        }
      }, 30000); // 30초마다 호출
    }

    // 컴포넌트 언마운트 or 모달 닫힐 경우 clear interval하도록 설정
    return () => clearInterval(intervalId);
  }, [isOpen, title, content]);

  const handleTitleChange = (e) => {
    const inputText = e.target.value;

    // 최대 길이를 40으로 설정
    if (inputText.length <= 40) {
      // 40자 이내일 때만 setTitle 호출하여 상태 업데이트
      setTitle(inputText);
    } else alert("제목은 40자를 초과할 수 없습니다.");
  };

  const handleCancelPost = () => {
    setIsConfirmationModal2Open(false);
  };

  const handleEditPost = async () => {
    console.log("EDIT");
    // 모달 열기 전에 확인 모달을 띄우도록 수정
    setIsConfirmationModal2Open(true);
  };

  const handleConfirmPost = async () => {
    // 작성한 글을 서버에 저장
    const editedData = {
      title: title || editData?.title || null,
      content: content || editData?.content || null,
    };

    try {
      // 기존 글 수정
      const editedContent = await putWriting(id, editedData, accessToken);
      // 페이지 새로 고침 없이 현재 URL에 토큰을 포함하여 다시 로드
      const currentURL = window.location.href;
      const newURL = `${currentURL}`;
      window.history.replaceState({}, document.title, newURL);
    } catch (error) {
      console.error("Error saving writing:", error);
      alert(error);
    }

    onClose();
    setIsConfirmationModal2Open(false);
  };
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div
        className="absolute w-full h-full bg-gray-800 opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative flex flex-col bg-white w-[800px] h-[550px] rounded-lg z-50">
        <div className="p-8">
          <div className="text-[16px]">{editData?.step + "번째 글"}</div>
          <div
            className="mb-[10px] font-bold text-[22px]"
            style={{ color: "#646464" }}
          >
            {data?.setting?.subject}
          </div>
          <textarea
            className="text-[40px] w-full mb-[10px] h-[50px] resize-none"
            placeholder="제목을 입력해주세요."
            value={title || editData?.title}
            onChange={handleTitleChange}
          />

          <hr
            className="w-full bg-[#7C766C] h-[1px] my-[17px]"
            style={{ color: "#7C766C", borderColor: "#7C766C" }}
          />
          <textarea
            className="mt-[20px] w-full h-[220px] overflow-y-auto resize-none"
            placeholder="내용을 입력해주세요."
            value={content || editData?.content}
            onChange={(e) => {
              const inputValue = e.target.value;
              // 최대 입력 글자수 - 4000자로 제한
              if (inputValue.length <= 4000) {
                setContent(inputValue);
                console.log(content, "content");
              }
            }}
          />
          <div className="text-[14px] text-gray-500 items-end justify-end flex">{`${content.length}/4000`}</div>
        </div>
        <div className="flex flex-col w-full rounded-md">
          <div
            className="h-[100px] flex p-8  justify-end items-center rounded-md w-full"
            style={{ backgroundColor: "#F1F1F1" }}
          >
            <button
              className={`w-[152px] h-[53px] cursor-pointer rounded-md ${
                isChanged
                  ? "bg-orange-500  text-black"
                  : "bg-gray-400 text-gray-800"
              }`}
              onClick={handleEditPost}
            >
              수정
            </button>
          </div>
        </div>
      </div>
      {isConfirmationModal2Open && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <div
            className="absolute w-full h-full bg-gray-800 opacity-50"
            onClick={onClose}
          ></div>
          <div className="flex flex-col bg-white w-[300px] h-[155px] text-center justify-center items-center rounded-lg z-50">
            <div className="p-8 ">
              <div className="text-[16px] mb-[30px]">
                해당 내용으로 수정하시겠습니까?
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

export default function Writer() {
  const router = useRouter();
  const [loginState, setLoginState] = useAtom(loginAtom);
  const [isWriterModalOpen, setIsWriterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMiniModalOpen, setIsMiniModalOpen] = useState(false);
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const userInfo = useUserInfoAtom();
  const writingInfo = useWritingDataAtom();
  const [editData, setEditData] = useState<EditData>({});
  const [selectedWritingId, setSelectedWritingId] = useState("");
  const [remainingTime, setRemainingTime] = useAtom(remainingTimeAtom);
  const [remainingTime2, setRemainingTime2] = useAtom(remainingTime2Atom);
  const [buttonActivated, setButtonActivated] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [isSubmissionSuccessful, setIsSubmissionSuccessful] = useState(false);
  const [writingId, setWritingId] = useState<number | null>(null);
  const [isEndTime, setIsEndTime] = useState(false);
  const isFirst = router.query.isFirst === "true";
  const [showBadge, setShowBadge] = useState(false);
  const [postedWriting, setPostedWriting] = useState<PostingInfo>({});
  const badgeCount = postedWriting?.newBadges?.length || 0;
  const { showMenu, setShowMenu, toggleMenu } = useMenu();
  const [accessToken] = useAtom(accessTokenAtom);
  const [writingInfoLoaded, setWritingInfoLoaded] = useState(false);

  useEffect(() => {
    if (badgeCount > 0) {
      setShowBadge(true);
    } else {
      setShowBadge(false);
    }
  }, [postedWriting?.newBadges?.length]);

  useEffect(() => {
    if (userInfo !== null && writingInfo !== null) {
      setWritingInfoLoaded(true);
    }
  }, [userInfo, writingInfo]);

  useEffect(() => {
    if (isFirst == true) {
      setIsFirstModalOpen(true);
    }
    if (!writingInfoLoaded) {
      return;
    }
    const finishedString = writingInfo?.data?.nearestFinishDate;
    const finishTime = new Date(finishedString);
    const newStartString = writingInfo?.data?.nearestStartDate;
    const newStartTime = new Date(newStartString);

    if (!finishedString || !newStartString) {
      return;
    }

    // 타이머
    const newIntervalId = setInterval(() => {
      const currentTime = new Date();
      const timeDiff = newStartTime?.getTime() - currentTime?.getTime();
      const seconds = Math.floor(timeDiff / 1000);
      const updatedHours = Math.floor(seconds / 3600);
      const updatedMinutes = Math.floor((seconds % 3600) / 60);
      const updatedRemainingSeconds = seconds % 60;

      const timeDiff2 = finishTime?.getTime() - currentTime?.getTime();
      const seconds2 = Math.floor(timeDiff2 / 1000);
      const updatedHours2 = Math.floor(seconds2 / 3600);
      const updatedMinutes2 = Math.floor((seconds2 % 3600) / 60);
      const updatedRemainingSeconds2 = seconds2 % 60;

      if (!buttonActivated) {
        const updatedTime = `${
          updatedHours < 10
            ? updatedHours < 0
              ? updatedHours + 23
              : "0" + updatedHours
            : updatedHours
        }:${
          updatedMinutes < 10
            ? updatedMinutes < 0
              ? updatedMinutes + 59
              : "0" + updatedMinutes
            : updatedMinutes
        }:${
          updatedRemainingSeconds < 0
            ? updatedRemainingSeconds + 59
            : updatedRemainingSeconds < 10
            ? "0" + updatedRemainingSeconds
            : updatedRemainingSeconds
        }`;

        setRemainingTime(updatedTime);
      } else {
        const updatedTime2 = `${
          updatedHours2 < 10
            ? updatedHours2 < 0
              ? updatedHours2 + 23
              : "0" + updatedHours2
            : updatedHours2
        }:${
          updatedMinutes2 < 10
            ? updatedMinutes2 < 0
              ? updatedMinutes2 + 59
              : "0" + updatedMinutes2
            : updatedMinutes2
        }:${
          updatedRemainingSeconds2 < 0
            ? updatedRemainingSeconds2 + 59
            : updatedRemainingSeconds2 < 10
            ? "0" + updatedRemainingSeconds2
            : updatedRemainingSeconds2
        }`;

        setRemainingTime2(updatedTime2);
      }

      if (seconds <= 0 && !buttonActivated) {
        setButtonActivated(true);
        clearInterval(newIntervalId);
      }
    }, 1000);

    setIntervalId(newIntervalId);

    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };
  }, [buttonActivated, writingInfoLoaded]);

  useEffect(() => {
    if (writingInfo?.data?.isActivated === true) {
      setButtonActivated(true);
    } else {
      setButtonActivated(false);
    }
  }, [writingInfo?.data?.isActivated]);

  const isActivated = writingInfo?.data?.isActivated;
  const nearestStartDate = writingInfo?.data?.nearestStartDate;
  const nearestFinishDate = writingInfo?.data?.nearestFinishDate;

  const now = day();
  const seconds = day(isActivated ? nearestFinishDate : nearestStartDate).diff(
    now,
    "second"
  );

  const [timer, setTimer] = useState<number>(seconds);
  useEffect(() => {
    if (timer === 0) {
      return setIsEndTime(true);
    }

    const updateTimer = () => {
      setTimer((prevTimer) => Math.max(prevTimer - 1, 0));
    };
    const intervalId = setInterval(updateTimer, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [timer]);

  const handleNewWriting = async () => {
    try {
      const response = await startWriting(writingInfo?.data?.id, accessToken);
      const newWritingId = response?.data?.writing?.id;
      console.log(writingId, "========ㄴ");
      if (newWritingId) {
        setWritingId(newWritingId);
        router.push({
          pathname: `/newPost/${newWritingId}`,
          query: {
            writingId: newWritingId,
          },
        });
      } else {
        console.error("Failed to get new writing ID");
      }
    } catch (error) {
      console.error("Error start writing:", error);
    }
  };

  useEffect(() => {
    if (isSubmissionSuccessful) {
      setIsMiniModalOpen(true);
      setIsSubmissionSuccessful(false);
    }
  }, [isSubmissionSuccessful]);

  useEffect(() => {
    if (router.query.mini) {
      setIsMiniModalOpen(true);

      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, mini: undefined },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [router.query.mini]);

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    window.location.reload();
  };

  const handleCloseMiniModal = () => {
    setIsMiniModalOpen(false);
    setButtonActivated(false);
    window.location.reload();
  };

  const handleCloseFirstModal = () => {
    setIsFirstModalOpen(false);
  };

  // 수정할 글 클릭했을 때
  const handleEditClick = async (writingId: string) => {
    try {
      console.log(writingId, "0");
      const writingData = await getWritingInfo(writingId, accessToken);
      setEditData(writingData?.data);
      setSelectedWritingId(writingData?.data?.id);
      console.log("writing?", writingData?.data, writingId, selectedWritingId);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Error fetching writing data:", error);
    }
  };

  const handleLogIn = () => {
    if (loginState.isLoggedIn === true) {
      setLoginState({
        username: "",
        isLoggedIn: false,
        accessToken: null,
      });
      router.push("/");
    }
  };

  const completion_percentage = writingInfo?.data?.progressPercentage;

  const startDateString = writingInfo?.data?.startDate;
  const finishDateString = writingInfo?.data?.finishDate;
  const nearestStartDateString = writingInfo?.data?.nearestStartDate;

  const formattedStartDate = formatDate(startDateString);
  const formattedFinishDate = formatDate(finishDateString);
  const formattedNearestStartDate = formatDate(nearestStartDateString);

  const finishDate = new Date(finishDateString);
  const nearestDate = new Date(formattedNearestStartDate);
  const timeDiff = finishDate - nearestDate;

  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  const result = `D-${daysDiff}`;

  const formattedDateRange = `${formattedStartDate} - ${formattedFinishDate}`;

  const WritingList = React.memo(function WritingList({ writings }) {
    return (
      <div className="flex flex-col lg:max-h-[560px] gap-y-2 lg:gap-y-4 max-h-[340px] my-5 overflow-y-scroll rounded-xl">
        {writings?.map((writing, index) => (
          <div
            key={index}
            className="flex cursor-pointer px-5 py-5 flex-row w-full lg:h-[200px] h-[150px] rounded-xl"
            style={{ backgroundColor: "#F4EDE0" }}
            onClick={() => handleEditClick(writing?.id)}
          >
            <div className="my-3 mx-3">
              <div className="w-full text-xl">{writing?.title}</div>
              <div
                className="mt-3 max-w-full truncate text-base"
                style={{ color: "#C5BCAB" }}
              >
                {writing?.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  });
  WritingList.displayName = "WritingList";

  return (
    <div className="flex flex-col my-[50px] w-full overflow-hidden">
      <style>{`body { background: #F2EBDD; margin: 0; height: 100%; }`}</style>
      <div className="flex flex-row mx-auto w-full">
        <div className="flex flex-col w-full mx-[120px]">
          <MenuWithTopbar
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            toggleMenu={toggleMenu}
            accessToken={accessToken}
            loginState={loginState}
            setLoginState={setLoginState}
            router={router}
          />
          <hr
            className="lg:block hidden w-full bg-[#7C766C] h-[1px] sm:my-[17px] lg:my-0"
            style={{ color: "#7C766C", borderColor: "#7C766C" }}
          />
          <div className="w-full flex mt-[20px] lg:flex-row flex-col">
            <div className="w-full bg-black rounded-sm flex flex-row lg:flex-col lg:max-w-[400px] mb-[20px] lg:mb-0 max-w-[682px] lg:h-[600px] h-[272px]">
              <div className="flex flex-col sm:mx-[30px] lg:mx-[20px]">
                <div className="text-white mt-[34px] w-full h-[120px] text-[36px]">
                  <a>{userInfo?.data?.nickname}</a>님의
                  <br />
                  글쓰기 시간
                </div>
                <div className="flex flex-row gap-x-[8px] lg:mt-[8px]">
                  <div
                    className="flex text-[20px] lgtext-[26px]"
                    style={{ color: "#CEB292" }}
                  >
                    <a>
                      {writingInfo?.data?.startAt?.hour
                        .toString()
                        .padStart(2, "0")}
                      :
                      {writingInfo?.data?.startAt?.minute === 0
                        ? "00"
                        : writingInfo?.data?.startAt?.minute}
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex flex-col ml-[200px] lg:mx-[20px] mt-[40px] lg:mt-[76px]">
                <div className="ml-2 lg:ml-0" style={{ color: "#BAB1A0" }}>
                  {buttonActivated === true ? "남은 시간" : "글쓰기 시간까지"}
                </div>
                <div
                  className="flex w-full justify-start lg:text-[72px] text-[48px]"
                  style={{ color: "#F2EBDD" }}
                >
                  {writingInfoLoaded === true && buttonActivated
                    ? remainingTime2
                    : remainingTime}
                </div>
                {!showMenu && (
                  <div className="flex justify-center items-center mt-[50px] lg:mt-[100px] relative">
                    <button
                      className={`rounded-lg text-[14px] lg:text-[16px] lg:rounded-xl w-[210px] lg:w-[333px] h-[40px] lg:h-[62px] ${
                        buttonActivated === true
                          ? "bg-orange-500 text-black"
                          : "bg-zinc-700  text-white"
                      }`}
                      disabled={!buttonActivated}
                      onClick={handleNewWriting}
                    >
                      글 작성하기
                    </button>
                    <div
                      style={{
                        position: "absolute",
                        top: "5%",
                        left: "68%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 1,
                      }}
                    >
                      {buttonActivated === false && (
                        <Image
                          src="https://gloo-image-bucket.s3.amazonaws.com/archive/soon2.png"
                          width={120}
                          height={42}
                          alt="soon2"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              className="w-[682px] h-[550px] lg:h-[817px] lg:w-full rounded-sm flex flex-row px-2 py-2 lg:px-5 lg:py-5 lg:ml-10"
              style={{ border: "1px solid black", backgroundColor: "#E0D5BF" }}
            >
              <div className="w-full my-3 mx-3 sm:mx-5">
                <div className="bg-black text-white w-12 text-center">
                  <a>{result}</a>
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                  <div className="flex flex-col">
                    <div className="text-black mt-2 text-3xl lg:text-4xl">
                      <a>{writingInfo?.data?.subject}</a>
                    </div>
                    <div
                      className="text-sm lg:text-base mt-1"
                      style={{ color: "#706B61" }}
                    >
                      {formattedDateRange}
                    </div>
                  </div>
                  <div className="flex items-center text-3xl lg:text-4xl justify-end">
                    <a className="text-black">
                      {writingInfo?.data?.writings.length}
                    </a>
                    /
                    <a style={{ color: "#706B61" }}>
                      {writingInfo?.data?.page}
                    </a>
                  </div>
                </div>
                <hr
                  className="w-full bg-[#7C766C] h-[1px] my-[17px]"
                  style={{ color: "#7C766C", borderColor: "#7C766C" }}
                />
                {writingInfo?.data?.writings.length === 0 && (
                  <div
                    className="flex items-center justify-center lg:text-lg"
                    style={{ color: "#706B61" }}
                  >
                    나만의 기록으로 채워보아요!
                  </div>
                )}
                {writingInfo?.data?.writings.length !== 0 && (
                  <div
                    className="w-full h-5 flex items-center"
                    style={{
                      backgroundColor: "#F2EBDD",
                      border: "1px solid black",
                      borderColor: "black",
                    }}
                  >
                    <div
                      className="w-full mx-1 h-3"
                      style={{
                        width: `${completion_percentage || 0}%`,
                        backgroundColor: "#FF8126",
                        transition: "width 0.5s ease",
                      }}
                    ></div>
                  </div>
                )}
                {writingInfo?.data?.writings !== null && (
                  <WritingList writings={writingInfo?.data?.writings} />
                )}
              </div>
            </div>
          </div>
          {isFirstModalOpen && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
              <div
                className="absolute w-full h-full bg-gray-800 opacity-50"
                onClick={handleCloseFirstModal}
              ></div>
              <div className="flex flex-col bg-white w-[328px] h-[171px] text-center justify-center items-center rounded-lg z-50">
                <div className="text-center items-center flex flex-col">
                  <div className="text-[15px] mb-[6px]">
                    앞으로 매일
                    {writingInfo?.data?.startAt?.hour}:
                    {writingInfo?.data?.startAt?.minute}시에 만나요!
                  </div>
                  <div
                    className="text-[13px] mb-[10px]"
                    style={{ color: "#7F7F7F" }}
                  >
                    휴대폰 알림에 글쓰기 시간을 등록하면
                    <br />
                    글쓰기를 잊지 않을 수 있어요!
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="w-[120px] text-[15px] font-bold cursor-pointer h-[40px] rounded-md"
                      style={{ backgroundColor: "#FF8126" }}
                      onClick={handleCloseFirstModal}
                    >
                      확인
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isMiniModalOpen &&
            writingInfo?.data?.status == "onProcess" &&
            completion_percentage < 100 && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
                <div
                  className="absolute w-full h-full bg-gray-800 opacity-50"
                  onClick={handleCloseMiniModal}
                ></div>
                <div className="flex flex-col bg-white w-[264px] max-w-[328px] py-[20px] min-h-[171px] max-h-[500px] text-center justify-center items-center rounded-lg z-50">
                  <div className="text-center items-center flex flex-col">
                    <div className="text-[15px] font-bold mb-[2px]">
                      {writingInfo?.data?.writings.length}번째
                    </div>
                    <div className="text-[15px] mb-[6px]">
                      글 등록을 완료했어요!
                    </div>
                    <div
                      className="text-[13px] mb-[10px]"
                      style={{ color: "#7F7F7F" }}
                    >
                      다음{" "}
                      <a>
                        {writingInfo?.data?.startAt?.hour}:
                        {writingInfo?.data?.startAt?.minute === 0
                          ? "00"
                          : writingInfo?.data?.startAt?.minute}
                      </a>
                      에 꼭 다시 만나요!
                    </div>
                    {showBadge && (
                      <div className="w-[140px] h-[148px] mb-[18px]">
                        <Image
                          src={
                            postedWriting?.newBadges[badgeCount - 1]?.badge
                              ?.imageUrl
                          }
                          width={152}
                          height={153}
                          alt={
                            postedWriting?.newBadges[badgeCount - 1]?.badge
                              ?.name
                          }
                        />
                      </div>
                    )}
                    <div className="flex justify-center">
                      <button
                        className="w-[120px] text-[15px] font-bold cursor-pointer h-[40px] rounded-md"
                        style={{ backgroundColor: "#FF8126" }}
                        onClick={handleCloseMiniModal}
                      >
                        확인
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          {isMiniModalOpen && writingInfo?.data?.status == "aborted" && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
              <div
                className="absolute w-full h-full bg-gray-800 opacity-50"
                onClick={handleCloseMiniModal}
              ></div>
              <div className="flex flex-col bg-white w-[264px] max-w-[328px] py-[20px] min-h-[171px] max-h-[500px] text-center justify-center items-center rounded-lg z-50">
                <div className="text-start items-start flex flex-col">
                  {completion_percentage >= 75 ? (
                    <div>
                      <div className="text-[12px] items-start justify-start text-gray-400 mb-[2px]">
                        축하합니다!
                      </div>
                      <div className="text-[15px] font-bold mb-[6px]">
                        목표 {completion_percentage}% 달성으로 <br />
                        글쓰기 도전에 성공했어요!
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[15px] font-bold mb-[6px]">
                        이번에 아쉽게 <br />
                        글쓰기 도전이 끝났어요
                      </div>
                    </div>
                  )}
                  <hr className="w-full h-[1px] text-gray-400 py-2" />
                  {showBadge && (
                    <div className="w-[140px] h-[148px] mb-[18px]">
                      <Image
                        src={
                          postedWriting?.newBadges[badgeCount - 1]?.badge
                            ?.imageUrl
                        }
                        width={152}
                        height={153}
                        alt={
                          postedWriting?.newBadges[badgeCount - 1]?.badge?.name
                        }
                      />
                    </div>
                  )}
                  {completion_percentage >= 75 ? (
                    <div className="flex justify-center">
                      <button
                        className="w-[200px] text-[14px] cursor-pointer h-[40px] rounded-md bg-black text-white"
                        onClick={() =>
                          router.push({
                            pathname: `/challenge/newBook`,
                          })
                        }
                      >
                        나만의 전자책 발행하기
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-y-2 justify-center">
                      <button
                        className="w-[200px] text-[14px] cursor-pointer h-[40px] rounded-md bg-black text-white"
                        onClick={() =>
                          router.push({
                            pathname: `/mypage/unfinished`,
                          })
                        }
                      >
                        이어서 하기
                      </button>
                      <button
                        className="w-[200px] text-[14px] cursor-pointer h-[40px] rounded-md bg-white text-black"
                        style={{
                          border: "1px solid black",
                          borderColor: "black",
                        }}
                        onClick={() =>
                          router.push({
                            pathname: "/mypage/unfinished-settings",
                          })
                        }
                      >
                        새로운 도전하기
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <EditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        id={selectedWritingId}
        editData={editData}
      />
    </div>
  );
}
