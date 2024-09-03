import './global.css'
import './font.css'
import './App.css'
import { Header } from './components/Header'
import { Demo } from './routes/Demo';
import { Route, Routes } from 'react-router-dom';


function App() {
  return (
    <body className="App">
      <Header/>
      <Routes>
        <Route path="/" element={<Demo/>}/>
      </Routes>
    </body>
  );
}

export default App;
