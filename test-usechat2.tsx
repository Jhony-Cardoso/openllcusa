import { renderHook } from '@testing-library/react-hooks';
// Since we don't have testing library, let's just create a dummy component and console log it
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { useChat } from '@ai-sdk/react';

function Test() {
  const chat = useChat({ api: '/api/chat' });
  console.log(Object.keys(chat));
  return <div>Test</div>;
}

renderToString(<Test />);
