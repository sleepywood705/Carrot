import './global.css'
import './font.css'
import './App.css'
import { Header }  from './components/Header'
import { Footer } from './components/Footer'
import { Home } from './routes/Home'
import { Demo } from './routes/Demo';
import Main  from './routes/Main';
import { Route, Routes } from 'react-router-dom';



function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Demo" element={<Demo/>}/>
        <Route path="/Main" element={<Main/>}/>
      </Routes>
      <Footer/>
    </div>
  ); 
}

export default App;
 