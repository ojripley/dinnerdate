import React, {useState} from 'react';

import '../styles/Nav.scss';

export default function Nav(props) {

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuBarClasses, setMenuBarClasses] = ('');

  const toggleMenu = function() {
    setMenuOpen(!menuOpen);

    if (menuOpen) {
      setMenuBarClasses()
    }
  }

  return(
    <div id={'nav'}>
      <div id={'menu-icon'} onClick={toggleMenu}>
        <div className={'menu-icon-bar'} id={'bar1'}></div> 
        <div className={'menu-icon-bar'} id={'bar2'}></div>
        <div className={'menu-icon-bar'} id={'bar3'}></div>
        <div className={'menu-icon-bar'} id={'bar4'}></div>
      </div>
      {menuOpen && <p>the menu is open</p>}
    </div>
  );
};