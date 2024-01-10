import React, { useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useSession } from 'next-auth/react';
import Hello from '../components/hello';

function Ads() {
  const { data: session } = useSession();

  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <Layout title="Ads">
      {session ? (
        <div>
          <Head>
            <title>Ads</title>
            <script
              async
              src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            ></script>
          </Head>
          <h1>Watch Ads</h1>
          <p>Here are some ads for you to watch:</p>
          {/* Text Ad */}
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
          {/* Video Ad */}
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="1234567890"
            data-ad-format="video"
            data-full-width-responsive="true"
          ></ins>
        </div>
      ) : (
        <Hello />
      )}
    </Layout>
  );
}

export default Ads;

// import React from 'react';
// import Head from 'next/head';
// import Layout from '../components/Layout';
// import { useSession } from 'next-auth/react';
// import Hello from '../components/hello';

// function Ads() {
//   const { data: session } = useSession();
//   return (
//     <Layout title="Ads">
//       {session ? (
//         <div>
//           <Head>
//             <title>Ads</title>
//           </Head>
//           <h1>Watch Ads</h1>
//           <p>Here are some ads for you to watch:</p>
//           {/* Add your ads here */}
//         </div>
//       ) : (
//         <Hello />
//       )}
//     </Layout>
//   );
// }

// export default Ads;
