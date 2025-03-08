import { useQuery } from '@tanstack/react-query';
import {
  getCurrentUser,
  getSubscriptionPlans,
  getUserSubscription,
  getCallTemplates,
  getCallHistory,
  getCallDetails,
  getProviders,
  getProviderAssistants,
  getProviderPhoneNumbers,
  getCallTranscript
} from './supabase';

// Auth Queries
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => getCurrentUser()
  });
}

// Subscription Queries
export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: () => getSubscriptionPlans()
  });
}

export function useUserSubscription(userId: string | undefined) {
  return useQuery({
    queryKey: ['userSubscription', userId],
    queryFn: () => userId ? getUserSubscription(userId) : Promise.resolve(null),
    enabled: !!userId
  });
}

// Call Queries
export function useCallTemplates() {
  return useQuery({
    queryKey: ['callTemplates'],
    queryFn: () => getCallTemplates()
  });
}

export function useCallHistory(userId: string | undefined) {
  return useQuery({
    queryKey: ['callHistory', userId],
    queryFn: () => userId ? getCallHistory(userId) : Promise.resolve([]),
    enabled: !!userId
  });
}

export function useCallDetails(callId: string | undefined) {
  return useQuery({
    queryKey: ['callDetails', callId],
    queryFn: () => callId ? getCallDetails(callId) : Promise.resolve(null),
    enabled: !!callId
  });
}

export function useCallTranscript(callId: string | undefined) {
  return useQuery({
    queryKey: ['callTranscript', callId],
    queryFn: () => callId ? getCallTranscript(callId) : Promise.resolve(null),
    enabled: !!callId
  });
}

// Provider Queries
export function useProviders() {
  return useQuery({
    queryKey: ['providers'],
    queryFn: () => getProviders()
  });
}

export function useProviderAssistants(providerId: string | undefined) {
  return useQuery({
    queryKey: ['providerAssistants', providerId],
    queryFn: () => providerId ? getProviderAssistants(providerId) : Promise.resolve([]),
    enabled: !!providerId
  });
}

export function useProviderPhoneNumbers(providerId: string | undefined) {
  return useQuery({
    queryKey: ['providerPhoneNumbers', providerId],
    queryFn: () => providerId ? getProviderPhoneNumbers(providerId) : Promise.resolve([]),
    enabled: !!providerId
  });
}
