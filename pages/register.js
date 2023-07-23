import React, { useEffect } from 'react';
import axios from 'axios';
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
  const { redirect, inviteCode } = router.query;

  useEffect(() => {
    if (session?.user) {
      console.log('user found');
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({
    f_name,
    l_name,
    email,
    password,
    inviteCode,
    phoneNumber,
  }) => {
    try {
      await axios.post('/api/auth/signup', {
        f_name,
        l_name,
        email,
        phoneNumber,
        password,
        inviteCode,
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
    <Layout title="Create Account">
      <form
        className="max-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Create Account</h1>
        <div className="mb-4">
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
        <div className="names">
          <div className="mb-4">
            <label htmlFor="fname">First Name</label>
            <input
              type="text"
              className="w-full"
              id="fname"
              autoFocus
              {...register('f_name', {
                required: 'Please enter first name',
              })}
            />
            {errors.f_name && (
              <div className="text-red-500">{errors.f_name.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="l_name">Last Name</label>
            <input
              type="text"
              className="w-full"
              id="l_name"
              autoFocus
              {...register('l_name', {
                required: 'Please enter last name',
              })}
            />
            {errors.l_name && (
              <div className="text-red-500">{errors.l_name.message}</div>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="phoneNumber"
            className="w-full"
            id="phoneNumber"
            {...register('phoneNumber', {
              required: 'Please enter phone number',
            })}
            autoFocus
          ></input>
          {errors.phoneNumber && (
            <div className="text-red-500">{errors.phoneNumber.message}</div>
          )}
        </div>

        <div className="mb-4">
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
        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="w-full"
            type="password"
            id="confirmPassword"
            {...register('confirmPassword', {
              required: 'Please re-enter password',
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
              <div className="text-red-500 ">Password do not match</div>
            )}
        </div>
        <div className="mb-4">
          <label htmlFor="inviteCode">Invited By</label>
          <input
            type="text"
            className="w-full"
            id="inviteCode"
            {...register('inviteCode', { defaultValue: inviteCode || '' })}
            autoFocus
          />
        </div>

        <div className="mb-4">
          <button type="submit" className="primary-button">
            Register
          </button>
        </div>
        <div className="mb-4">
          Have an account? &nbsp;{' '}
          {/* //&apos is apostrophe(') and &nbsp is admin-admin2 Gv9-5kajZ952@Bn
          space */}
          <Link id="link" href={`/login?redirect=${redirect || '/'}`}>
            Login
          </Link>
        </div>
      </form>
    </Layout>
  );
}
