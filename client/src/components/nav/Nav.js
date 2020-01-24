import React, {useState, useEffect} from 'react';

import '../styles/Nav.scss';

export default function Nav(props) {

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuIconClasses, setMenuIconClasses] = useState('menu-icon');

  const toggleMenu = function() {
    setMenuOpen(!menuOpen);
  }

  useEffect(() => {
    if (menuOpen) {
      console.log('changing menu bars');
      setMenuIconClasses('menu-icon menu-open');
    } else {
      setMenuIconClasses('menu-icon');
    }
  }, [menuOpen]);

  return(
    <div id={'nav'}>
      <div className={menuIconClasses} onClick={toggleMenu}>
        <div className={'menu-icon-bar'} id={'bar1'}></div> 
        <div className={'menu-icon-bar'} id={'bar2'}></div>
        <div className={'menu-icon-bar'} id={'bar3'}></div>
        <div className={'menu-icon-bar'} id={'bar4'}></div>
      </div>
    </div>
  );
};