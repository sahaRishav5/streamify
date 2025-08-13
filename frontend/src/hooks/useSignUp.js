import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signup } from '../lib/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router';
const useSignUp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

    const {isPending,error,mutate} = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], { user: data.user });
      toast.success("Signup successful");
      navigate(data?.user?.isOnboarded === false ? "/" : "/onboarding");
    },
    onError: (error) => {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed");
    },
  });

  return { signupMutation: mutate, isPending, error };
}

export default useSignUp
