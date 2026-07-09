// src/pages/chat/index.tsx — simplified now that DashboardPage handles auth/refresh
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { ChatSidebar } from '@/components/chat-sidebar';
import { ChatArea } from '@/components/chat-area';
import { useSessionSwitchExtraction } from './hooks/useSessionSwitchExtraction';
import { useChatStore } from './hooks/useChatStore';
import { useAuthStore } from '@/pages/dashboard/hooks/useAuthStore';
import {
    useSessionVisibilityExtraction,
    useRouteExitExtraction,
} from './hooks/useMemoryExtraction';

export default function ChatPage() {
    // Activate memory extraction hooks
    useSessionSwitchExtraction(); // Trigger extraction when switching sessions

    const { selectedSessionId } = useChatStore();
    const { accessToken } = useAuthStore();

    // Trigger extraction when tab loses visibility or is about to close
    useSessionVisibilityExtraction(selectedSessionId, accessToken);

    // Trigger extraction when navigating away from chat page
    useRouteExitExtraction(selectedSessionId, accessToken);

    return (
        <SidebarProvider>
            <ChatSidebar />
            <SidebarInset>
                <ChatArea />
            </SidebarInset>
        </SidebarProvider>
    );
}
