const { streamText } = require('ai');
const { openai } = require('@ai-sdk/openai');
require('dotenv').config({ path: '.env.local' });
async function test() {
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages: [{role: 'user', content: 'test'}]
  });
  console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(result)));
}
test();
