import axios from "axios";
import { GetUserInfoResponse } from "./api.response";
import { NewWritingData, EditOrSetData } from "../../interface";

const apiUrl: string = process.env.API_URL || "https://core.gloo-lighter.com";

export const getLoginInfo = async (code: string) => {
  try {
    const response = await axios.get(
      `${apiUrl}/account/users/sign-in/kakao?code=${code}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// 글쓰기 설정하는 API
export const postSetUp = async (data: EditOrSetData, accessToken: string) => {
  try {
    const response = await axios.post(`${apiUrl}/writing-session`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

//글루ING - 설정 및 정보 받아오는 API
export const getGlooingInfo = async (accessToken: string) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.get(`${apiUrl}/api/glooing/writings`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// userInfo API
export const getUserInfo = async (accessToken: string) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.get(`${apiUrl}/account/users/me`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// 진행중인 글쓰기 세션만 보여주도록 하는 API
export const getCurrentSessions = async (accessToken: string) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.get(
      `${apiUrl}/writing-session/on-process`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// 글쓰기 시작 시에 POST 필요
export const startWriting = async (id: string, accessToken: string) => {
  try {
    const response = await axios.post(
      `${apiUrl}/writings/start?writingSessionId=${id}`,
      undefined, // axios post 특성을 고려해 수정
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// 글 임시저장 API
export const temporarySaveWriting = async (
  writingId: string,
  accessToken: string,
  data?: NewWritingData
) => {
  try {
    const response = await axios.put(
      `${apiUrl}/writings/${writingId}/temp-save`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// 최종적으로 글 POST하는 API
export const submitWriting = async (
  data: NewWritingData,
  writingId: string,
  accessToken: string
) => {
  try {
    const response = await axios.put(
      `${apiUrl}/writings/${writingId}/submit`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// 클릭한 글의 정보를 가져오는 API
export const getWritingInfo = async (id: string, accessToken: string) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.get(`${apiUrl}/writings/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// 각 글 수정하는 API
export const putWriting = async (
  id: string,
  data: NewWritingData,
  accessToken: string
) => {
  try {
    const response = await axios.put(`${apiUrl}/writings/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// 설정 수정하는 API
export const editWritingSetUp = async (
  id: string,
  data: EditOrSetData,
  accessToken: string
) => {
  try {
    const response = await axios.put(`${apiUrl}/writing-session/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// 못다쓴 책 재개를 위한 설정 변경 API
export const unfinishedWritingSetUp = async (
  id: string,
  data: EditOrSetData,
  accessToken: string
) => {
  try {
    const response = await axios.put(
      `${apiUrl}/writing-session/${id}/continue`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
