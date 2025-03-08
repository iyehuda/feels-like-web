import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:3000",
});
const fetcher = async (url: string) => apiClient.get(url).then((res) => res.data);

export default fetcher;
