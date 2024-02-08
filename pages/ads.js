import React, { useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useSession } from 'next-auth/react';
import Hello from '../components/hello';
import { Container, Typography, Box, Paper } from '@mui/material';

function Ads() {
  const { data: session } = useSession();

  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <Layout title="Ads">
      {session ? (
        <Container maxWidth="md">
          <Box my={4}>
            <Typography variant="h4" component="h1" gutterBottom>
              Watch Ads
            </Typography>
            <Typography variant="body1" gutterBottom>
              Here are some ads for you to watch:
            </Typography>
            <Box my={2}>
              <Paper elevation={3}>
                <Box p={2}>
                  <Typography variant="h6" gutterBottom>
                    Text Ad
                  </Typography>
                  <ins
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                    data-ad-slot="1234567890"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                  ></ins>
                </Box>
              </Paper>
            </Box>
            <Box my={2}>
              <Paper elevation={3}>
                <Box p={2}>
                  <Typography variant="h6" gutterBottom>
                    Video Ad
                  </Typography>
                  <ins
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                    data-ad-slot="1234567890"
                    data-ad-format="video"
                    data-full-width-responsive="true"
                  ></ins>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Container>
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
