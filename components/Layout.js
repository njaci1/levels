import React from 'react';
import { Menu } from '@headlessui/react';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Bell } from 'react-feather';

export default function Layout({ title, children }) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const router = useRouter();
  const [unReadNotifications, setUnReadNotifications] = useState(0);

  useEffect(() => {
    if (session?.user?._id) {
      fetchNotifications();
    }
  }, [session]);

  async function fetchNotifications() {
    try {
      const res = await fetch(`/api/notifications/${session.user._id}`);
      const result = await res.json();
      setUnReadNotifications(result.data.length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }

  const logoutClickHandler = () => {
    signOut({ callbackUrl: '/login' });
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
            <Link className="text-lg font-bold ml-5" href="/">
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
              <Link id="link" className="p-2" href="/login">
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
