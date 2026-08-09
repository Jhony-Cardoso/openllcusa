import { renderToString } from 'react-dom/server';
import { useChat } from '@ai-sdk/react';
import * as React from 'react';

function Test() {
  const chat = useChat();
  console.log(Object.keys(chat));
  return <div>Test</div>;
}
renderToString(<Test />);
