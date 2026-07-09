import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import type { Provider } from '@/schemas';

export function ChatInput({
    onSend,
    isSending,
    provider,
    setProvider,
}: {
    onSend: (message: string) => void;
    isSending: boolean;
    provider: Provider;
    setProvider: (p: Provider) => void;
}) {
    const [value, setValue] = useState('');

    const handleSend = () => {
        if (!value.trim() || isSending) return;
        onSend(value.trim());
        setValue('');
    };

    return (
        <div className='border-t p-3 flex flex-col gap-2'>
            <div className='flex items-end gap-2'>
                <Textarea
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder='Send a message...'
                    className='min-h-11 max-h-40 resize-none'
                />
                <Button onClick={handleSend} disabled={isSending || !value.trim()} size='icon'>
                    {isSending ? (
                        <Loader2 className='size-4 animate-spin' />
                    ) : (
                        <Send className='size-4' />
                    )}
                </Button>
            </div>
            <select
                value={provider}
                onChange={e => setProvider(e.target.value as Provider)}
                className='w-fit text-xs bg-transparent border rounded-md px-2 py-1 text-muted-foreground'>
                <option value='openai'>OpenAI</option>
                <option value='anthropic'>Anthropic</option>
                <option value='gemini'>Gemini</option>
            </select>
        </div>
    );
}
