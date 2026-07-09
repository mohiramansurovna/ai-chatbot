import { useEffect, useRef } from 'react';
import { useChatStore } from './useChatStore';
import { useAuthStore } from '@/pages/dashboard/hooks/useAuthStore';
import { triggerMemoryExtraction } from './useMemoryExtraction';

/**
 * Hook to trigger memory extraction when the user switches to a different session
 * Runs the extraction for the previously active session before switching
 */
export const useSessionSwitchExtraction = () => {
    const { selectedSessionId } = useChatStore();
    const { accessToken } = useAuthStore();
    const previousSessionIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (selectedSessionId !== previousSessionIdRef.current) {
            // Session changed
            if (previousSessionIdRef.current !== null) {
                // Trigger extraction for the session we're leaving
                triggerMemoryExtraction(previousSessionIdRef.current, accessToken);
            }
            // Update the previous session ref
            previousSessionIdRef.current = selectedSessionId;
        }
    }, [selectedSessionId, accessToken]);
};
