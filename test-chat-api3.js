const { streamText } = require('ai');
require('dotenv').config({ path: '.env.local' });
async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Hola' }] })
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text.slice(0, 500));
  } catch (err) {
    console.error(err);
  }
}
test();
