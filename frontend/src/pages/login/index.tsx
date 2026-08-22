import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { useLoginMutation } from '@/entities/identity';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/components/ui/field';
import { ApiError } from '@/shared/api/client';

const loginSchema = z.object({
    email: z.email('Enter a valid email address.'),
    password: z.string().min(1, 'Password is required.'),
});

export function LoginPage() {
    const navigate = useNavigate();
    const loginMutation = useLoginMutation();

    const form = useForm({
        defaultValues: { email: '', password: '' },
        validators: { onSubmit: loginSchema },
        onSubmit: async ({ value }) => {
            await loginMutation.mutateAsync(value, {
                onSuccess: () => navigate({ to: '/dashboard' }),
            });
        },
    });

    return (
        <div className='flex min-h-screen items-center justify-center p-4'>
            <Card className='w-full sm:max-w-sm'>
                <CardHeader>
                    <CardTitle>Log in</CardTitle>
                    <CardDescription>Enter your email and password to continue.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id='login-form'
                        onSubmit={e => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}>
                        <FieldGroup>
                            <form.Field
                                name='email'
                                children={field => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type='email'
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={e => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder='you@example.com'
                                                autoComplete='email'
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                            <form.Field
                                name='password'
                                children={field => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type='password'
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={e => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                autoComplete='current-password'
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                            {loginMutation.isError && (
                                <p className='text-sm text-destructive'>
                                    {loginMutation.error instanceof ApiError
                                        ? loginMutation.error.message
                                        : 'Something went wrong. Please try again.'}
                                </p>
                            )}
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className='flex flex-col gap-3'>
                    <Button
                        type='submit'
                        form='login-form'
                        className='w-full'
                        disabled={loginMutation.isPending}>
                        {loginMutation.isPending ? 'Logging in…' : 'Log in'}
                    </Button>
                    <p className='text-center text-sm text-muted-foreground'>
                        No account?{' '}
                        <a href='/register' className='underline underline-offset-4'>
                            Register
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
