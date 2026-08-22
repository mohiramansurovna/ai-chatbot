import { useEffect, type ReactNode } from 'react';
import { useAuthStore, useRefreshMutation } from '@/entities/identity';

export function AuthBootstrap({ children }: { children: ReactNode }) {
    const isBootstrapping = useAuthStore(s => s.isBootstrapping);
    const finishBootstrapping = useAuthStore(s => s.finishBootstrapping);
    const refresh = useRefreshMutation();

    useEffect(() => {
        refresh.mutate(undefined, { onSettled: () => finishBootstrapping() });
        // run once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isBootstrapping) {
        return <div>Loading…</div>; // swap for a real splash/skeleton later
    }

    return children;
}
