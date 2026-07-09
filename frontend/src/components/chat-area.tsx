import { useEffect, useRef, useState } from 'react';
import { useSessionQuery } from '@/pages/chat/hooks/useSessionQuery';
import { useSendMessage } from '@/pages/chat/hooks/useSessionMutations';
import { useChatStore } from '@/pages/chat/hooks/useChatStore';
import { ChatMessageBubble } from '@/components/chat-message';
import { ChatInput } from '@/components/chat-input';
import { Loader2, MessageSquare } from 'lucide-react';
import type { ChatMessage } from '@/schemas';

export function ChatArea() {
    const { selectedSessionId, provider, setProvider } = useChatStore();
    const { data: session, isLoading, isError } = useSessionQuery(selectedSessionId);
    const sendMessage = useSendMessage(selectedSessionId);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [conversationMessages, setConversationMessages] = useState<ChatMessage[]>([]);
    const initializedSessionIdRef = useRef<number | null>(null);
    const hasInitializedSessionRef = useRef(false);

    useEffect(() => {
        if (!selectedSessionId) {
            initializedSessionIdRef.current = null;
            hasInitializedSessionRef.current = false;
            setConversationMessages([]);
            return;
        }

        if (initializedSessionIdRef.current !== selectedSessionId) {
            initializedSessionIdRef.current = selectedSessionId;
            hasInitializedSessionRef.current = false;
            setConversationMessages([]);
        }
    }, [selectedSessionId]);

    useEffect(() => {
        if (!selectedSessionId || !session?.messages || hasInitializedSessionRef.current) {
            return;
        }

        setConversationMessages(session.messages);
        hasInitializedSessionRef.current = true;
    }, [selectedSessionId, session?.messages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversationMessages.length]);

    if (!selectedSessionId) {
        return (
            <div className='flex h-full items-center justify-center text-muted-foreground gap-2'>
                <MessageSquare className='size-5' />
                Select or create a session to start chatting
            </div>
        );
    }
    if (isError) {
        return (
            <div className='flex h-full items-center justify-center text-destructive gap-2'>
                <MessageSquare className='size-5' />
                Failed to load session. Please try again.
            </div>
        );
    }
    const handleSend = (message: string) => {
        if (!selectedSessionId) return;

        const optimisticUserMessage: ChatMessage = {
            id: `temp-user-${Date.now()}`,
            role: 'user',
            content: message,
            createdAt: new Date(),
        };

        setConversationMessages(prev => [...prev, optimisticUserMessage]);

        sendMessage.mutate(
            { message, provider },
            {
                onSuccess: assistantMessage => {
                    setConversationMessages(prev => [...prev, assistantMessage]);
                },
                onError: () => {
                    setConversationMessages(prev =>
                        prev.filter(item => item.id !== optimisticUserMessage.id)
                    );
                },
            }
        );
    };

    return (
        <div className='flex h-full flex-col'>
            <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-3'>
                {isLoading ? (
                    <Loader2 className='size-5 animate-spin self-center mt-10' />
                ) : (
                    conversationMessages.map((message, index) => (
                        <ChatMessageBubble key={`${message.id}-${index}`} message={message} />
                    ))
                )}
                {sendMessage.isPending && (
                    <div className='flex justify-start'>
                        <div className='bg-muted rounded-2xl px-4 py-2 text-sm text-muted-foreground flex items-center gap-1.5'>
                            <span className='sr-only'>Thinking</span>
                            {[0, 1, 2].map(index => (
                                <span
                                    key={index}
                                    className='h-2 w-2 rounded-full bg-muted-foreground/70 animate-bounce'
                                    style={{ animationDelay: `${index * 0.15}s` }}
                                />
                            ))}
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
            <ChatInput
                onSend={handleSend}
                isSending={sendMessage.isPending}
                provider={provider}
                setProvider={setProvider}
            />
        </div>
    );
}
