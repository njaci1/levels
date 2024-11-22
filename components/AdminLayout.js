import React from 'react';
import { Menu } from '@headlessui/react';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Bell } from 'react-feather';

export default function AdminLayout({ title, children }) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const router = useRouter();

  const logoutClickHandler = () => {
    signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <>
      <Head>
        <title>{title ? title + ' - Levels' : 'Levels'}</title>
        <meta name="description" content="Mynet" />
        <link rel="icon" href="/favi.png" />
      </Head>

      <div className="flex min-h-screen flex-col justify-between">
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            background: '#fff',
          }}
        >
          <nav className="flex h-12 items-center px-4 justify-between">
            <Link className="text-lg font-bold ml-5" href="/admin/review">
              Home
            </Link>
            {loading ? (
              'Loading..'
            ) : session?.user ? (
              <Menu as="div" className="relative inline-block z-60">
                <Menu.Button className="text-blue-600 mr-4">
                  {session.user.username}
                </Menu.Button>
                <Menu.Items className="absolute card bg-white opacity-90 right-0 w-25 origin-top-right">
                  {/* <Menu.Item>
                    <p>Placeholder</p>
                  </Menu.Item> */}
                  <Menu.Item>
                    <a
                      className="dropdown-link"
                      href="#"
                      onClick={logoutClickHandler}
                    >
                      Logout
                    </a>
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            ) : (
              <Link id="link" className="p-2" href="/admin/login">
                Login
              </Link>
            )}
          </nav>
        </header>
        <main className="container m-auto">{children}</main>
      </div>
    </>
  );
}
