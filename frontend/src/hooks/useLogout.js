import React from 'react'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";

const useLogout = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);
      queryClient.setQueryData(["friendRequests"], null);
    }
  });
  return { logoutMutation: mutate };
}

export default useLogout
