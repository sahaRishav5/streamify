import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api.js";
import toast from "react-hot-toast";
const useLogin = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Login successful");
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    },
  });

  return {
    loginMutation: mutate,
    isPending,
    error,
  };
};

export default useLogin;
