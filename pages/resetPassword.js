import React, { useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export default function ResetPasswordScreen() {
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
    getValues,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password, code }) => {
    try {
      await axios.put('/api/auth/resetPassword', {
        email,
        password,
        code,
      });
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
      //  else {
      //   router.push(redirect || '/');
      // }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Reset Password">
      <form
        className="max-auto max-w-screen-md justify-center text-center p-10"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Reset Password</h1>

        <div className="mb-4 text-start">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Please enter email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
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
          <label htmlFor="password">Password</label>
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
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4 text-start">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="w-full"
            type="password"
            id="confirmPassword"
            {...register('confirmPassword', {
              required: 'Please enter confirm password',
              validate: (value) => value === getValues('password'),
              minLength: {
                value: 6,
                message: 'confirm password must be more than 5 chars',
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500 ">
              {errors.confirmPassword.message}
            </div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === 'validate' && (
              <div className="text-red-500">Password do not match</div>
            )}
        </div>
        <div className="mb-4 text-start">
          <label htmlFor="code">Verification Code</label>
          <input
            type="text"
            className="w-full"
            id="code"
            autoFocus
            {...register('code', {
              required: 'Please enter verification code',
              minLength: {
                value: 5,
                message: 'verification code must be 5 digits',
              },
            })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.code.message}</div>
          )}
        </div>

        <div className="mb-4">
          <button className="primary-button">Login</button>
        </div>
        <div className="mb-4">
          Don&apos;t have an account?{' '}
          {/* //&apos is apostrophe(') and &nbsp is admin-admin2 Gv9-5kajZ952@Bn
          space */}
          <Link id="link" href={`/register?redirect=${redirect || '/'}`}>
            Register
          </Link>
        </div>
      </form>
    </Layout>
  );
}
