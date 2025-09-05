// // index.js
// const express = require('express');
// const axios = require('axios');
// const app = express();

// app.use(express.json());

// // Test route to check server is running
// app.get('/', (req, res) => {
//   res.send('Finora backend running...');
// });

// // Replace with your actual wallet ID and access token
// const walletId = 'your-wallet-id';
// const accessToken = 'your-bitgo-access-token';

// // Send coins using BitGo Express
// app.post('/send', async (req, res) => {
//   const { address, amount } = req.body;

//   try {
//     const response = await axios.post(
//       `http://localhost:3080/api/v2/tbtc/wallet/${walletId}/sendcoins`,
//       {
//         address,
//         amount, // amount in satoshis (1 BTC = 100,000,000 satoshis)
//         walletPassphrase: 'your-wallet-passphrase',
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error('Error sending coins:', error.response?.data || error.message);
//     res.status(500).json({ error: error.response?.data || 'Internal Server Error' });
//   }
// });

// // Start your Express server
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server started on http://localhost:${PORT}`);
// });


// index.js

// 1. Import necessary libraries
const express = require('express');
const crypto = require('crypto'); // This is built into Node.js, no install needed

// 2. Initialize our Express app
const app = express();
const PORT = process.env.PORT || 3000;

// This is middleware that tells Express to automatically parse incoming JSON
app.use(express.json());

// --- IMPORTANT ---
// 3. Store your BitGo webhook secret securely
// Paste the secret you got from BitGo here.
const BITGO_WEBHOOK_SECRET = 'wh1505a1a8762e1116621e6ccf1d65a112c2c0dbcbb5b0c2086098614f899b6ae6'; // <--- REPLACE THIS

// 4. Create the API route that BitGo will send notifications to
// This is the core of your webhook listener.
app.post('/webhook/bitgo', (req, res) => {
  console.log("A notification was received from BitGo!");

  // **SECURITY CHECK**
  // This verifies that the message is actually from BitGo and not a fake one.
  const signature = req.headers['x-bitgo-signature'];
  const payload = JSON.stringify(req.body);
  const hmac = crypto.createHmac('sha256', BITGO_WEBHOOK_SECRET);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');

  if (signature !== expectedSignature) {
    console.error("Error: Invalid signature. Webhook call is not from BitGo.");
    return res.status(401).send("Invalid Signature");
  }

  // If the signature is valid, we can process the data.
  const webhookData = req.body;

  console.log("Webhook data is authentic. Processing...");
  console.log(webhookData);

  //
  // >>> YOUR LOGIC GOES HERE <<<
  //
  // - Check if webhookData.type is 'transaction'.
  // - Get the address from webhookData.outputs.
  // - Find the user in your database associated with that address.
  // - Check webhookData.confirmations to see if the deposit is confirmed.
  // - Update your database accordingly.
  //

  // 5. Send a success response back to BitGo
  // This tells BitGo "I got your message, thank you."
  res.status(200).send('Webhook Received');
});

// 6. Start the server
app.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
  console.log('Ready to receive BitGo webhooks at /webhook/bitgo');
});

app.get('/', (req, res) => {
  res.send('Finora backend running...');
});
