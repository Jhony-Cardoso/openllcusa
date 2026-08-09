const { streamText } = require('ai');
const { openai } = require('@ai-sdk/openai');
require('dotenv').config({ path: '.env.local' });
async function test() {
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages: [{role: 'user', content: 'test'}]
  });
  const res = result.toUIMessageStreamResponse();
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    process.stdout.write(decoder.decode(value));
  }
}
test();
