import React from 'react';
import { Menu } from '@headlessui/react';
import { signOut, useSession, getSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Notifications from './Notifications';

export default function Layout({ title, children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const router = useRouter();
  useEffect(() => {
    getSession().then((session) => {
      setSession(session);
      setLoading(false); // Update the loading state when the session data has been fetched
    });
  }, [router.asPath]);
  // const { status, data: session } = useSession();
  // console.log(session.user);
  const logoutClickHandler = () => {
    signOut({ callbackUrl: '/login' });
  };
  return (
    <>
      <Head>
        <title>{title ? title + ' - Levels' : 'Levels'}</title>
        <meta name="description" content="Mynet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col justify-between ">
        <header>
          <nav className="flex h-12 items-center px-4 justify-between shadow-md">
            <Link className="text-lg font-bold" href="/">
              Levels
            </Link>
            {loading ? (
              'Loading..'
            ) : session?.user ? (
              <Menu as="div" className="relative inline-block z-60">
                <Menu.Button className="text-blue-600 mr-4">
                  {session.user.name}
                </Menu.Button>
                <Menu.Items className="absolute card bg-white opacity-100 right-5 w-40 origin-top-right">
                  <Menu.Item>
                    <Notifications userId={session.user} />
                  </Menu.Item>
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
              <Link id="link" className="p-2" href="/login">
                Login
              </Link>
            )}
          </nav>
        </header>
        {/* <main className="container m-auto mt-4 px-4">{children}</main> */}
        <main className="container m-auto mt-4 px-4">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { session, setSession });
            }
            return child;
          })}
        </main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>Copyright © </p>
        </footer>
      </div>
    </>
  );
}
