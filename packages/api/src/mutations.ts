import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  signUp,
  signIn,
  signOut,
  resetPassword
} from './supabase';
import {
  queueCall,
  cancelCall
} from './vapi';
import { CallRequest } from '@voice-agent-caller/shared';

// Auth Mutations
export function useSignUp() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ email, password, fullName }: { email: string; password: string; fullName?: string }) => 
      signUp(email, password, fullName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    }
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      signIn(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    }
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.invalidateQueries();
      queryClient.removeQueries();
    }
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (email: string) => resetPassword(email)
  });
}

// Call Mutations
export function useQueueCall() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, callRequest }: { userId: string; callRequest: CallRequest }) => 
      queueCall(userId, callRequest),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['callHistory', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['userSubscription', variables.userId] });
    }
  });
}

export function useCancelCall() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ callId, userId }: { callId: string; userId: string }) => 
      cancelCall(callId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['callDetails', variables.callId] });
      queryClient.invalidateQueries({ queryKey: ['callHistory', variables.userId] });
    }
  });
}

// Create a Stripe checkout session
export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: ({ priceId, userId }: { priceId: string; userId: string }) => {
      const createCheckoutSession = async () => {
        const supabase = getSupabaseClient();
        
        const { data, error } = await supabase.functions.invoke('create-checkout-session', {
          body: {
            priceId,
            userId
          }
        });
        
        if (error) {
          throw error;
        }
        
        if (!data || !data.url) {
          throw new Error('Failed to create checkout session');
        }
        
        return data.url;
      };
      
      return createCheckoutSession();
    }
  });
}

// Import statement needed for the getSupabaseClient function
import { getSupabaseClient } from './client';
