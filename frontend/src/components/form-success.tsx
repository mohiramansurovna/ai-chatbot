import { CheckCheckIcon } from 'lucide-react';

export default function FormSuccess({ success }: { success?: string }) {
    return (
        success && (
            <div className='text-emerald-600 w-full border rounded-sm h-7 border-emerald-600 bg-emerald-600/20 text-sm mt-4 flex items-center justify-start pl-2 gap-2'>
                <CheckCheckIcon size={16} />
                {success}
            </div>
        )
    );
}