const { streamText } = require('ai');
const { openai } = require('@ai-sdk/openai');
require('dotenv').config({ path: '.env.local' });
async function test() {
  try {
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages: [{role: 'user', content: 'test'}],
      temperature: 0.7,
    });
    console.log('Result acquired. Iterating over stream...');
    for await (const chunk of result.textStream) {
      process.stdout.write(chunk);
    }
  } catch (error) {
    console.error('Catch error:', error);
  }
}
test();
