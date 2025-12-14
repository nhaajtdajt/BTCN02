import './App.css'
import Body from './components/body';
import Footer from './components/footer';
import Header from './components/header.jsx';
import Nav from './components/nav';

function App() {

  return (
    <div className='flex justify-center items-center flex-col'>
      <Header />
      <Nav />
      <Body />
      <Footer />
    </div>
  )
}

export default App
