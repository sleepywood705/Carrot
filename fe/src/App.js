import './global.css';
import './font.css';
import './App.css';
import { Landing } from './routes/Landing';
import Main  from './routes/Main';
import { Header }  from './components/Header';
import { Footer } from './components/Footer';
import { Route, Routes } from 'react-router-dom';


function App() {
  
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/Main" element={<Main/>}/>
      </Routes>
      <Footer/>
    </div>
  ); 
}

export default App;
