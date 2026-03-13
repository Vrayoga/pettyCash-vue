import { apiClient, apiDynamic } from "@/helper/ourAxios";

export function callApi(endpoint, data) {
  return apiClient.post(endpoint, data);
}

export function uploadToEndpoint(endpoint, data, options = {}) {
  return apiClient.post(endpoint, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(options.headers || {}),
    },
    responseType: options.responseType || "json",
  });
}

export function dynamicApi(baseurl, contentType, headers, customconfig, data) {
  const customApi = apiDynamic(baseurl, contentType, headers, customconfig);
  return customApi.post("", data);
}
