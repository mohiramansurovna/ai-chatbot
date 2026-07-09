import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Link, useNavigate } from 'react-router';
import { RegisterSchema } from '@/schemas';
import { useRegisterMutation } from '../hooks/useRegisterMutation';
import FormError from '@/components/form-error';
import FormSuccess from '@/components/form-success';
import { LoadingButton } from '@/components/loading';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';

export function RegisterForm() {
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: { name: '', email: '', password: '' },
    });
    const registerMutation = useRegisterMutation();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
        registerMutation.mutate(data);
    };

    useEffect(() => {
        if (registerMutation.isSuccess) {
            const t = setTimeout(() => navigate('/login'), 1200);
            return () => clearTimeout(t);
        }
    }, [registerMutation.isSuccess, navigate]);

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className='p-6 md:p-8 flex flex-col gap-6'>
            <div className='flex flex-col items-center text-center'>
                <h1 className='text-2xl font-bold'>Create an account</h1>
                <p className='text-muted-foreground text-balance'>Start chatting in minutes</p>
            </div>

            <FieldGroup>
                <Controller
                    name='name'
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                type='text'
                                placeholder='Jane Doe'
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

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

            {registerMutation.isError && <FormError error={registerMutation.error.message} />}
            {registerMutation.isSuccess && (
                <FormSuccess success='Registered successfully, redirecting to login...' />
            )}

            <LoadingButton disabled={registerMutation.isPending} type='submit' className='w-full'>
                Register
            </LoadingButton>

            <div className='text-center text-sm'>
                Already have an account?{' '}
                <Link to='/login' className='underline underline-offset-4'>
                    Sign in
                </Link>
            </div>
        </form>
    );
}
