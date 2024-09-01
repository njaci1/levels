import React from 'react';
import { Menu } from '@headlessui/react';
import { signOut, useSession, getSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Bell } from 'react-feather';

export default function Layout({ title, children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const router = useRouter();
  const [unReadNotifications, setUnReadNotifications] = useState(0);

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

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      if (!session?.user?._id) return;
      const res = await fetch(`/api/notifications/${session.user._id}`);
      const result = await res.json();
      const notifications = result.data;
      const unreadNotifications = notifications.length;

      if (notifications.length > 0) {
        setUnReadNotifications(unreadNotifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }

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
              Home
            </Link>
            {loading ? (
              'Loading..'
            ) : session?.user ? (
              <Menu as="div" className="relative inline-block z-60">
                <Menu.Button className="text-blue-600 mr-4 align-middle">
                  <Link href="/notificationsPage" className="relative">
                    <Bell className="h-5 w-5" />
                    {unReadNotifications > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center h-3 w-3 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {unReadNotifications}
                      </span>
                    )}
                  </Link>
                </Menu.Button>
                <Menu.Button className="text-blue-600 mr-4">
                  {session.user.name}
                </Menu.Button>
                <Menu.Items className="absolute card bg-white opacity-100 right-5 w-40 origin-top-right">
                  <Menu.Item>
                    <p>Placeholder</p>
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
