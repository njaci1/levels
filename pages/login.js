import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export default function LoginScreen() {
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

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
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        router.push(redirect || '/');
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Login">
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
          Don&apos;t have an account?{' '}
          {/* //&apos is apostrophe(') and &nbsp is admin-admin2 Gv9-5kajZ952@Bn
          space */}
          <Link
            id="link"
            href={`/register?inviteCode=&redirect=${redirect || '/'}`}
          >
            Register
          </Link>
          &nbsp; Forgot Password?{' '}
          <Link id="link" href={`/forgotPassword?redirect=${redirect || '/'}`}>
            Reset Password
          </Link>
        </div>
      </form>
    </Layout>
  );
}
