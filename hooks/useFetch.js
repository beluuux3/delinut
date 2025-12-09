"use client";

import { useState, useCallback } from "react";
import Cookies from "js-cookie";

const API_BASE = "https://backend-solandre.onrender.com";

export const useFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getHeaders = useCallback(() => {
    const token = Cookies.get("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }, []);

  const fetchData = useCallback(
    async (url, method = "GET", body = null) => {
      setLoading(true);
      setError(null);

      try {
        const config = {
          method,
          headers: getHeaders(),
        };

        if (body && method !== "GET") {
          config.body = JSON.stringify(body);
        }

        const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`;
        const response = await fetch(fullUrl, config);

        if (!response.ok) {
          let errorMessage = `Error: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage =
              typeof errorData.detail === "object"
                ? JSON.stringify(errorData.detail)
                : errorData.detail || errorData.message || errorMessage;
          } catch {
            errorMessage = `Error ${response.status}: ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const result = await response.json();
        setData(result);
        setLoading(false);
        return { success: true, data: result };
      } catch (err) {
        const errorMessage = err.message || "Error de conexión";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [getHeaders]
  );

  return {
    data,
    loading,
    error,
    fetchData,
  };
};
