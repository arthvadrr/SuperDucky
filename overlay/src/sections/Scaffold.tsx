import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

import '../styles/Scaffold.scss';

export default function Scaffold() {
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
