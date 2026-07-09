import { useEffect, useRef } from 'react';

// @ts-ignore
const url = import.meta.env.VITE_API_URL as string;

/**
 * Tracks which sessions have been triggered for memory extraction
 * to avoid duplicate calls for the same session
 */
const extractionTriggeredSessions = new Set<number>();

/**
 * Silent fire-and-forget memory extraction trigger
 * Uses fetch with keepalive to ensure the request completes even if the tab closes
 */
export const triggerMemoryExtraction = async (
    sessionId: number | null,
    accessToken: string | null
) => {
    // Validate inputs
    if (!sessionId || !accessToken) return;

    // Deduplicate: skip if already triggered for this session
    if (extractionTriggeredSessions.has(sessionId)) return;

    // Mark as triggered
    extractionTriggeredSessions.add(sessionId);

    try {
        // Fire-and-forget with keepalive to ensure it completes even on tab close
        fetch(`${url}/api/sessions/${sessionId}/memory`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            keepalive: true,
        }).catch(() => {
            // Silent catch - log only to console for debugging
            console.debug(`Memory extraction for session ${sessionId} failed silently`);
        });
    } catch (error) {
        // Silent error - never surface to user
        console.debug('Memory extraction error:', error);
    }
};

/**
 * Hook to automatically trigger memory extraction for the current session
 * when the tab/window loses visibility or is about to close
 */
export const useSessionVisibilityExtraction = (
    sessionId: number | null,
    accessToken: string | null
) => {
    useEffect(() => {
        if (!sessionId || !accessToken) return;

        const handleVisibilityChange = () => {
            // Trigger extraction when document becomes hidden
            if (document.hidden) {
                triggerMemoryExtraction(sessionId, accessToken);
            }
        };

        const handleBeforeUnload = () => {
            // Attempt to trigger extraction on page close/reload
            // Note: sendBeacon is more reliable for beforeunload, but we use fetch with keepalive
            // which is supported and simpler to manage alongside other requests
            triggerMemoryExtraction(sessionId, accessToken);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [sessionId, accessToken]);
};

/**
 * Hook to trigger memory extraction when leaving a route
 * Useful for detecting when the user navigates away from the chat page
 */
export const useRouteExitExtraction = (
    sessionId: number | null,
    accessToken: string | null
) => {
    const previousSessionRef = useRef<number | null>(null);

    useEffect(() => {
        if (sessionId === null && previousSessionRef.current !== null) {
            // Session cleared (likely navigated away)
            triggerMemoryExtraction(previousSessionRef.current, accessToken);
            previousSessionRef.current = null;
        } else if (sessionId !== null) {
            previousSessionRef.current = sessionId;
        }
    }, [sessionId, accessToken]);
};
