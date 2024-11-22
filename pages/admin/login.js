import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import { getError } from '../../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export default function AdminLoginScreen() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    console.log('Session:', session);
    if (status === 'loading') return;
    if (session?.role === 'admin') {
      router.push(redirect || '/admin/review');
    }
  }, [router, session, status, redirect]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/admin/review',
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        router.push(redirect || '/admin/review');
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <form
      className="max-auto max-w-screen-md justify-center text-center p-10"
      onSubmit={handleSubmit(submitHandler)}
    >
      <div className="mb-4 text-start">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          {...register('email', {
            required: 'Please enter email',
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/,
              message: 'Please enter a valid email',
            },
          })}
          className="w-full"
          id="email"
          autoFocus
        ></input>
        {errors.email && (
          <div className="text-red-500">{errors.email.message}</div>
        )}
      </div>
      <div className="mb-4 text-start">
        <label htmlFor="password" className="text-start">
          Password
        </label>
        <input
          type="password"
          {...register('password', {
            required: 'Please enter password',
            minLength: {
              value: 6,
              message: 'password must be more than 5 chars',
            },
          })}
          className="w-full"
          id="password"
          autoFocus
        ></input>
        {errors.password && (
          <div className="text-red-500">{errors.password.message}</div>
        )}
      </div>
      <div className="mb-4">
        <button className="primary-button">Login</button>
      </div>
      <div className="mb-4">
        Forgot Password?{' '}
        <Link
          id="link"
          href={`/forgotPassword?redirect=${redirect || '/admin/login'}`}
        >
          Reset Password
        </Link>
      </div>
    </form>
  );
}
