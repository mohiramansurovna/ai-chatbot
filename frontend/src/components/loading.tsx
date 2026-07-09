import { Button, type ButtonProps } from './ui/button.tsx';
import React from 'react';
import { Loader } from 'lucide-react';

export function LoadingButton({ children, ...props }: ButtonProps & { children: React.ReactNode }) {
    return (
        <Button {...props}>
            {props.disabled && <Loader size={10} className='animate-spin ml-2' />}
            {children}
        </Button>
    );
}

export function LoadingSmall({
    isLoading,
    children,
}: {
    isLoading: boolean;
    children: React.ReactNode;
}) {
    return isLoading ? (
        <div className={'h-full w-full flex items-center justify-center'}>
            <Loader className='size-1/3 animate-spin' />
        </div>
    ) : (
        children
    );
}
