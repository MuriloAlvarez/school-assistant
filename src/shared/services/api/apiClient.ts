import axios from "axios";
import {
  createNativeMockAdapter,
  isNativeDevMockEnabled,
} from "./nativeMockAdapter";

const nativeMockAdapter = createNativeMockAdapter();

const isApiRequest = (url?: string) => {
  if (!url) {
    return false;
  }

  return new URL(url, "http://localhost").pathname.startsWith("/api/");
};

export const apiClient = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

if (isNativeDevMockEnabled()) {
  apiClient.interceptors.request.use((config) => {
    if (isApiRequest(config.url)) {
      config.adapter = nativeMockAdapter;
    }

    return config;
  });
}
