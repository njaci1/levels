import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function AdminHome() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/admin/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'authenticated') {
    return (
      <div>
        <h1>Admin Home</h1>
        <button onClick={() => router.push('/admin/uploader')}>
          Upload Ad
        </button>
        <button onClick={() => router.push('/admin/review')}>Review Ads</button>
      </div>
    );
  }

  return null;
}
