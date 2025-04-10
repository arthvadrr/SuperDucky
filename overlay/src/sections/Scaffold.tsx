import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import type { ReactElement } from 'react';
import '../styles/Scaffold.scss';

export default function Scaffold(): ReactElement {
  return (
    <main className="scaffold">
      <div className="grid">
        <Header />
        <Footer />
        <Sidebar />
      </div>
    </main>
  );
}
