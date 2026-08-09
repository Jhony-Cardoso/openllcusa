const { streamText } = require('ai');
const { openai } = require('@ai-sdk/openai');
require('dotenv').config({ path: '.env.local' });
async function test() {
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages: [{role: 'user', content: 'test'}],
  });
  console.log(result.toUIMessageStreamResponse);
  const resp = result.toUIMessageStreamResponse();
  console.log(resp.headers);
}
test();
