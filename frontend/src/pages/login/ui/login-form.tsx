import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useLoginMutation } from '../hooks/useLoginMutation';
import { LoginSchema } from '@/schemas';
import FormError from '@/components/form-error';
import { Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@/components/loading';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

export function LoginForm() {
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: { email: '', password: '' },
    });
    const loginMutation = useLoginMutation();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const onSubmit = (data: z.infer<typeof LoginSchema>) => {
        loginMutation.mutate(data);
    };

    useEffect(() => {
        if (loginMutation.isSuccess) navigate('/chat');
    }, [loginMutation.isSuccess, navigate]);

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className='p-6 md:p-8 flex flex-col gap-6'>
            <div className='flex flex-col items-center text-center'>
                <h1 className='text-2xl font-bold'>Welcome back</h1>
                <p className='text-muted-foreground text-balance'>Sign in to continue chatting</p>
            </div>

            <FieldGroup>
                <Controller
                    name='email'
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                type='email'
                                placeholder='m@example.com'
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name='password'
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                            <div className='relative'>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type={showPassword ? 'text' : 'password'}
                                    aria-invalid={fieldState.invalid}
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700'>
                                    {showPassword ? (
                                        <Eye className='h-5 w-5' />
                                    ) : (
                                        <EyeOff className='h-5 w-5' />
                                    )}
                                </button>
                            </div>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </FieldGroup>

            {loginMutation.isError && <FormError error={loginMutation.error.message} />}

            <LoadingButton disabled={loginMutation.isPending} type='submit' className='w-full'>
                Login
            </LoadingButton>

            <div className='text-center text-sm'>
                Don&apos;t have an account?{' '}
                <Link to='/register' className='underline underline-offset-4'>
                    Sign up
                </Link>
            </div>
        </form>
    );
}
