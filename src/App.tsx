import { useState } from 'react';
import './App.css';
import {Landing} from './components/pages/Landing/Landing'
import { Explore } from './components/pages/Explore/Explore';
import { Piece } from './components/pages/Piece/Piece';

function App() {
  const [isShowing, setIsShowing] = useState('Piece')

  const changePage = (page: string) => {
    setIsShowing(page)
  }

  return (
    <div className="App">
      {isShowing === 'Landing' && <Landing changePage={changePage}/>}
      {isShowing === 'Explore' && <Explore/>}
      {isShowing === 'Piece' && <Piece/>}
    </div>
  );
}

export default App;
