import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signup } from '../lib/api'
import toast from 'react-hot-toast'
const useSignUp = () => {
  const queryClient = useQueryClient();

    const {isPending,error,mutate} = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Signup successful");
    },
    onError: (error) => {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed");
    },
  });

  return { signupMutation: mutate, isPending, error };
}

export default useSignUp
