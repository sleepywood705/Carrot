import React, { useState, useEffect } from 'react';
import './global.css';
import './font.css';
import './App.css';
import { Header }  from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './routes/Home';
import MyPage from './components/MyPage';
import Main  from './routes/Main';
import { Route, Routes } from 'react-router-dom';



function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > window.innerHeight) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Main" element={<Main/>}/>
        <Route path="/Mypage" element={<MyPage/>}/>
      </Routes>
      <Footer/>
    </div>
  ); 
}

export default App;
