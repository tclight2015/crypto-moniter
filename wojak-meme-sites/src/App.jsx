import { activeConfig } from './config/index.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import DrawSection from './components/DrawSection.jsx';
import BuySection from './components/BuySection.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <div className="site">
      <Header config={activeConfig} />
      <Hero config={activeConfig} />
      <DrawSection config={activeConfig} />
      <BuySection config={activeConfig} />
      <Footer config={activeConfig} />
    </div>
  );
}
