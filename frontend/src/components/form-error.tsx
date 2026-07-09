import { AlertTriangle } from 'lucide-react';

export default function FormError({ error }: { error?: string }) {
    return (
        error && (
            <div className='text-destructive w-full border rounded-sm h-7 border-destructive bg-destructive/20 text-sm mt-4 flex items-center justify-start pl-2 gap-2'>
                <AlertTriangle size={16} />
                {error}
            </div>
        )
    );
}
