import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, KeyRound } from 'lucide-react';
import { useAddApiKey } from '@/pages/chat/hooks/useAddApiKey';
import type { Provider } from '@/schemas';

export function ApiKeyDialog() {
    const [open, setOpen] = useState(false);
    const [provider, setProvider] = useState<Provider>('gemini');
    const [apiKey, setApiKey] = useState('');
    const addApiKey = useAddApiKey();

    const handleSubmit = () => {
        addApiKey.mutate(
            { apiKey, provider },
            {
                onSuccess: () => {
                    setApiKey('');
                    setOpen(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='ghost' size='sm' className='w-full justify-start gap-2'>
                    <KeyRound className='size-4' /> API Keys
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add API Key</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-3'>
                    <div>
                        <Label>Provider</Label>
                        <select
                            value={provider}
                            onChange={e => setProvider(e.target.value as Provider)}
                            className='w-full border rounded-md px-2 py-2 mt-1'>
                            {/* <option value='openai'>OpenAI</option>
                            <option value='anthropic'>Anthropic</option> */}
                            <option value='gemini'>Gemini</option>
                        </select>
                    </div>
                    <div>
                        <Label>API Key</Label>
                        <Input
                            type='password'
                            value={apiKey}
                            onChange={e => setApiKey(e.target.value)}
                            placeholder='sk-...'
                            className='mt-1'
                        />
                    </div>
                    {addApiKey.isError && (
                        <p className='text-destructive text-sm'>{addApiKey.error.message}</p>
                    )}
                    <Button onClick={handleSubmit} disabled={addApiKey.isPending || !apiKey}>
                        {addApiKey.isPending && <Loader2 className='size-4 animate-spin mr-2' />}
                        Save
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
