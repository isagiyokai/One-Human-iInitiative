'use client';

import { useState, useEffect, useCallback } from 'react';
import { getBrowserToken, generateBrowserToken, validateBrowserToken } from '@/lib/browser-token';

export function useBrowserToken() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const initToken = async () => {
      const existingToken = getBrowserToken();
      if (existingToken) {
        const isValid = await validateBrowserToken(existingToken);
        if (isValid) {
          setToken(existingToken);
        } else {
          // Token invalid, clear it
          localStorage.removeItem('oh_participation_token');
        }
      }
      setIsLoading(false);
    };

    initToken();
  }, []);

  const generateToken = useCallback(async () => {
    setIsGenerating(true);
    try {
      const newToken = await generateBrowserToken();
      setToken(newToken);
    } catch (error) {
      console.error('Failed to generate token:', error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Local check for immediate UI feedback - uses localStorage
  const hasVoted = useCallback((petitionId: string) => {
    if (!token) return false;
    const votes = JSON.parse(localStorage.getItem('oh_votes') || '{}');
    return !!votes[petitionId];
  }, [token]);

  const recordVote = useCallback((petitionId: string, choice: 'yes' | 'no') => {
    if (!token) return;
    // Store vote locally for UI feedback
    const votes = JSON.parse(localStorage.getItem('oh_votes') || '{}');
    votes[petitionId] = choice;
    localStorage.setItem('oh_votes', JSON.stringify(votes));
  }, [token]);

  return {
    token,
    isLoading,
    isGenerating,
    generateToken,
    hasVoted,
    recordVote,
  };
}