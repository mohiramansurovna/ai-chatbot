import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { useSessionsQuery } from '@/pages/chat/hooks/useSessionsQuery';
import { useCreateSession } from '@/pages/chat/hooks/useSessionMutations';
import { useChatStore } from '@/pages/chat/hooks/useChatStore';
import { NavUser } from '@/components/nav-user';
import { ApiKeyDialog } from '@/components/api-key-dialog';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuthStore } from '@/pages/dashboard/hooks/useAuthStore';

export function ChatSidebar() {
    const { data: sessions, isLoading, error } = useSessionsQuery();
    const createSession = useCreateSession();
    const { selectedSessionId, setSelectedSessionId } = useChatStore();
    const user = useAuthStore(state => state.user);

    const userData = { name: user?.name ?? '', email: user?.email ?? '', avatar: '' };

    return (
        <Sidebar collapsible='icon'>
            <SidebarHeader className='p-2'>
                <div className='flex items-center gap-2'>
                    <Button
                        className='flex-1 justify-start gap-2'
                        onClick={() => createSession.mutate('New chat')}
                        disabled={createSession.isPending}>
                        {createSession.isPending ? (
                            <Loader2 className='size-4 animate-spin' />
                        ) : (
                            <Plus className='size-4' />
                        )}
                        New chat
                    </Button>
                    <ThemeToggle />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Sessions </SidebarGroupLabel>
                    <SidebarMenu>
                        {isLoading ? (
                            <SidebarMenuItem>
                                <SidebarMenuButton className='text-muted-foreground'>
                                    <Loader2 className='size-4 animate-spin' /> Loading...
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ) : error ? (
                            <SidebarMenuItem>
                                <SidebarMenuButton className='text-destructive'>
                                    <AlertCircle className='size-4' /> {error.message}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ) : sessions?.length ? (
                            sessions.map(session => (
                                <SidebarMenuItem key={session.id}>
                                    <SidebarMenuButton
                                        isActive={selectedSessionId === session.id}
                                        onClick={() => setSelectedSessionId(session.id)}>
                                        <MessageSquare className='size-4' />
                                        <span className='truncate'> {session.title} </span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))
                        ) : (
                            <p className='text-muted-foreground text-sm p-2'> No sessions yet </p>
                        )}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className='gap-2'>
                <ApiKeyDialog />
                <NavUser user={userData} />
            </SidebarFooter>
        </Sidebar>
    );
}
