import { useState } from 'react';
import './App.css';
import {Landing} from './components/pages/Landing/Landing'
import { Explore } from './components/pages/Explore/Explore';
import React from 'react';

type NavContextType = (page: string) => void

export const NavContext = React.createContext({} as NavContextType)

function App() {
  const [isShowing, setIsShowing] = useState('Landing')

  const changePage = (page: string) => {
    setIsShowing(page)
  }

  return (
    <div className="App bg-coffee min-h-screen">
      <NavContext.Provider value={changePage}>
        {isShowing === 'Landing' && <Landing/>}
        {isShowing === 'Explore' && <Explore/>}
      </NavContext.Provider>
      
    </div>
  );
}

export default App;
