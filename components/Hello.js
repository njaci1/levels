import Layout from './Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import JackpotCard from './JackpotCard';

// components/Hello.js
export default function Hello() {
  const router = useRouter();
  const { redirect } = router.query;

  const [jackpots, setJackpots] = useState({
    joinersTotal: 0,
    weeklyTotal: 0,
    monthlyTotal: 0,
    annualTotal: 0,
  });

  useEffect(() => {
    fetch('/api/jackpotTotals')
      .then((response) => response.json())
      .then((data) => {
        setJackpots({
          joinersTotal: data.joinersTotal,
          weeklyTotal: data.weeklyTotal,
          monthlyTotal: data.monthlyTotal,
          annualTotal: data.annualTotal,
        });
      });
  }, []);
  return (
    <Layout title="Hello Page">
      <div className="font-sans min-h-screen py-2">
        <header className="bg-gray-200 p-5 text-center">
          <h1 className="text-2xl font-bold mb-2">
            Watch Ads, stand a chance to Win Jackpots!
          </h1>
          <p className="text-lg">
            Watch ads for a chance to win this week&apos;s jackpot of {'KSH '}
            {jackpots.weeklyTotal}.
          </p>
          <Link
            href={`/register?inviteCode=&redirect=${redirect || '/'}`}
            className="mt-2 inline-block px-5 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600"
          >
            Join Now!
          </Link>
        </header>
        <main className="p-5">
          <section className="jackpots flex justify-between mb-5">
            {['Joiners', 'Weekly', 'Monthly', 'Annual'].map((jackpot) => (
              <div
                key={jackpot}
                className="jackpot text-center p-2 border border-gray-300 rounded"
              >
                <h3 className="text-lg font-bold mb-1">{jackpot} Jackpot</h3>
                <p className="text-base">
                  KSH
                  <span id={`${jackpot.toLowerCase()}-jackpot`}>
                    {jackpots[`${jackpot.toLowerCase()}Total`]}
                  </span>
                </p>

                <Link
                  href={`/register?inviteCode=&redirect=${redirect || '/'}`}
                  className="mt-2 inline-block px-5 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600"
                >
                  Join Now!
                </Link>
              </div>
            ))}
          </section>
        </main>
      </div>
    </Layout>
  );
}
