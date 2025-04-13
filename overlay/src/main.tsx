import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SpriteProvider } from './providers/SpriteProvider';
import { MessageProvider } from './providers/MessageProvider';
import { UserProvider } from './providers/UserProvider';
import Scaffold from './sections/Scaffold';
import './styles/index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <MessageProvider>
        <SpriteProvider>
          <Scaffold />
        </SpriteProvider>
      </MessageProvider>
    </UserProvider>
  </StrictMode>,
);
