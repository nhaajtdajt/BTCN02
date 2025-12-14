import './App.css'
import Body from './pages/home';
import Footer from './components/layout/footer';
import Header from './components/layout/header.jsx';
import Nav from './components/layout/nav';
import { useTheme } from './context/ThemeContext';

function App() {
  const { isDark } = useTheme();

  return (
    <div className={`flex justify-center items-center flex-col min-h-screen transition-colors ${isDark ? 'bg-gray-900' : 'bg-gray-100'
      }`}>
      <Header />
      <Nav />
      <Body />
      <Footer />
    </div>
  )
}

export default App
