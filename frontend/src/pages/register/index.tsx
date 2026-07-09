import { Card, CardContent } from '@/components/ui/card';
import { RegisterForm } from './ui/register-form';

export default function RegisterPage() {
    return (
        <div className='bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10'>
            <div className='w-full max-w-sm'>
                <Card className='overflow-hidden p-0'>
                    <CardContent className='p-0'>
                        <RegisterForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
