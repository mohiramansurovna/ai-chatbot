import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/schemas';

type ChatMessageBubbleProps = { message: ChatMessage; isStreaming?: boolean };

export function ChatMessageBubble({ message, isStreaming = false }: ChatMessageBubbleProps) {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const isUser =
        message.role === 'user' ||
        (message as ChatMessage & { type?: 'user' | 'assistant' }).type === 'user';

    const copyToClipboard = async (value: string) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopiedCode(value);
            window.setTimeout(() => setCopiedCode(null), 1600);
        } catch {
            // Ignore clipboard failures in unsupported environments.
        }
    };

    const renderAssistantContent = () => {
        if (isStreaming) {
            return <div className='whitespace-pre-wrap break-words'>{message.content}</div>;
        }

        return (
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    a: ({ href, children, ...props }) => (
                        <a
                            className='font-medium text-primary underline decoration-primary/60 underline-offset-4'
                            href={href}
                            rel='noreferrer'
                            target='_blank'
                            {...props}>
                            {children}
                        </a>
                    ),
                    code: ({ className, children, ...props }) => {
                        const codeText =
                            typeof children === 'string'
                                ? children
                                : Array.isArray(children)
                                  ? children.join('')
                                  : '';
                        const language = /language-(\w+)/.exec(className ?? '')?.[1] ?? '';

                        if (!className) {
                            return (
                                <code
                                    className='rounded-md border border-border/70 bg-background/80 px-1.5 py-0.5 font-mono text-[0.82rem] text-foreground'
                                    {...props}>
                                    {children}
                                </code>
                            );
                        }

                        return (
                            <div className='group relative my-3 overflow-hidden rounded-xl border border-border bg-card shadow-sm'>
                                <div className='flex items-center justify-between border-b border-border bg-muted/80 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground'>
                                    <span>{language || 'code'}</span>
                                    <button
                                        aria-label='Copy code block'
                                        className='rounded-md border border-border/70 bg-background/80 p-1.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground'
                                        onClick={() => void copyToClipboard(codeText)}
                                        type='button'>
                                        {copiedCode === codeText ? (
                                            <Check className='size-3.5' />
                                        ) : (
                                            <Copy className='size-3.5' />
                                        )}
                                    </button>
                                </div>
                                <SyntaxHighlighter
                                    customStyle={{
                                        margin: 0,
                                        padding: '0.9rem 1rem',
                                        background: 'transparent',
                                        overflowX: 'auto',
                                        whiteSpace: 'pre',
                                    }}
                                    language={language}
                                    showLineNumbers={false}
                                    style={oneLight}
                                    wrapLongLines={false}>
                                    {codeText}
                                </SyntaxHighlighter>
                            </div>
                        );
                    },
                    pre: ({ children }) => <>{children}</>,
                    table: ({ children }) => (
                        <div className='my-3 overflow-x-auto rounded-xl border border-border bg-background/70'>
                            <table className='min-w-full border-collapse text-sm'>{children}</table>
                        </div>
                    ),
                    th: ({ children }) => (
                        <th className='border-b border-border bg-muted/80 px-3 py-2 text-left font-semibold text-foreground'>
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className='border-b border-border px-3 py-2'>{children}</td>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote className='my-3 border-l-2 border-border pl-3 text-muted-foreground italic'>
                            {children}
                        </blockquote>
                    ),
                    hr: () => <hr className='my-4 border-border' />,
                }}>
                {message.content}
            </ReactMarkdown>
        );
    };

    return (
        <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
            <div
                className={cn(
                    'max-w-[70%] rounded-2xl px-4 py-2 text-sm leading-6',
                    isUser
                        ? 'bg-primary text-primary-foreground whitespace-pre-wrap break-words'
                        : 'border border-border/60 bg-muted text-foreground'
                )}>
                {isUser ? (
                    <div className='whitespace-pre-wrap break-words'>{message.content}</div>
                ) : (
                    <div className='markdown-content'>{renderAssistantContent()}</div>
                )}
            </div>
        </div>
    );
}
