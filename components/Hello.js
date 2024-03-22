import Layout from './Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

// components/Hello.js
export default function Hello() {
  const router = useRouter();
  const { redirect } = router.query;
  return (
    <Layout title="Hello Page">
      <div className="font-sans min-h-screen py-2">
        <header className="bg-gray-200 p-5 text-center">
          <h1 className="text-2xl font-bold mb-2">
            Watch Ads, stand a chance to Win Jackpots!
          </h1>
          <p className="text-lg">
            Watch ads for a chance to win this week&apos;s jackpot of 50K.
          </p>
          <Link
            href={`/register?inviteCode=&redirect=${redirect || '/'}`}
            className="mt-2 inline-block px-5 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600"
          >
            Sign Up Now!
          </Link>
        </header>
        <main className="p-5">
          <section className="jackpots flex justify-between mb-5">
            {['Welcome', 'Weekly', 'Monthly', 'Annual'].map((jackpot) => (
              <div
                key={jackpot}
                className="jackpot text-center p-2 border border-gray-300 rounded"
              >
                <h3 className="text-lg font-bold mb-1">{jackpot} Jackpot</h3>
                <p className="text-base">
                  $<span id={`${jackpot.toLowerCase()}-jackpot`}>100</span>
                </p>

                <p className="text-base">
                  Next Draw:{' '}
                  <span id={`${jackpot.toLowerCase()}-draw-date`}>
                    2024-03-02
                  </span>
                </p>
                <Link
                  href={`/register?inviteCode=&redirect=${redirect || '/'}`}
                  className="mt-2 inline-block px-5 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600"
                >
                  Sign Up Now!
                </Link>
              </div>
            ))}
          </section>
        </main>
      </div>
    </Layout>
  );
}
