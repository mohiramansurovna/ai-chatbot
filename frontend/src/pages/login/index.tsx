import { Card, CardContent } from '@/components/ui/card';
import { LoginForm } from './ui/login-form';
import { Link } from 'react-router';

export default function LoginPage() {
    return (
        <div className='bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10'>
            <div className='w-full max-w-sm'>
                <Card className='overflow-hidden p-0'>
                    <CardContent className='p-0'>
                        <LoginForm />
                    </CardContent>
                </Card>
                <div className='text-muted-foreground text-center text-xs text-balance mt-4'>
                    By clicking continue, you agree to our{' '}
                    <Link className='hover:text-primary underline underline-offset-4' to='#'>
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link className='hover:text-primary underline underline-offset-4' to='#'>
                        Privacy Policy
                    </Link>
                    .
                </div>
            </div>
        </div>
    );
}
