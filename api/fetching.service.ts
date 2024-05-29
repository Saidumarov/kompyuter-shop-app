import { API } from "@/constants/api";
import axios from "axios";
export const getData = async (url: string) => {
  try {
    const response = await axios.get(`${API}${url}`, {
      headers: {
        Authorization: "9876543210",
      },
    });
    const data = await response.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};
