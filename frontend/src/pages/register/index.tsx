import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { useRegisterMutation } from '@/entities/identity';
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

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    email: z.email('Enter a valid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export function RegisterPage() {
    const navigate = useNavigate();
    const registerMutation = useRegisterMutation();

    const form = useForm({
        defaultValues: { name: '', email: '', password: '' },
        validators: { onSubmit: registerSchema },
        onSubmit: async ({ value }) => {
            await registerMutation.mutateAsync(value, {
                onSuccess: () => navigate({ to: '/login' }),
            });
        },
    });

    return (
        <div className='flex min-h-screen items-center justify-center p-4'>
            <Card className='w-full sm:max-w-sm'>
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>Enter your details to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id='register-form'
                        onSubmit={e => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}>
                        <FieldGroup>
                            <form.Field
                                name='name'
                                children={field => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={e => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder='Mira'
                                                autoComplete='name'
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
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
                                                autoComplete='new-password'
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                            {registerMutation.isError && (
                                <p className='text-sm text-destructive'>
                                    {registerMutation.error instanceof ApiError
                                        ? registerMutation.error.message
                                        : 'Something went wrong. Please try again.'}
                                </p>
                            )}
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className='flex flex-col gap-3'>
                    <Button
                        type='submit'
                        form='register-form'
                        className='w-full'
                        disabled={registerMutation.isPending}>
                        {registerMutation.isPending ? 'Creating account…' : 'Create account'}
                    </Button>
                    <p className='text-center text-sm text-muted-foreground'>
                        Already have an account?{' '}
                        <a href='/login' className='underline underline-offset-4'>
                            Log in
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
