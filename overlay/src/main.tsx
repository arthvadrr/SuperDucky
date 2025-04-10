import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SpriteProvider } from './context/SpriteContext';
import { MessageProvider } from './providers/MessageProvider';
import Scaffold from './sections/Scaffold';
import './styles/index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MessageProvider>
      <SpriteProvider>
        <Scaffold />
      </SpriteProvider>
    </MessageProvider>
  </StrictMode>,
);
