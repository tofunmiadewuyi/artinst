import { useState } from 'react';
import './App.css';
import {Landing} from './components/pages/Landing/Landing'
import { Explore } from './components/pages/Explore/Explore';

function App() {
  const [isShowing, setIsShowing] = useState('Landing')

  const changePage = (page: string) => {
    setIsShowing(page)
  }

  return (
    <div className="App">
      {isShowing === 'Landing' && <Landing changePage={changePage}/>}
      {isShowing === 'Explore' && <Explore/>}
    </div>
  );
}

export default App;
