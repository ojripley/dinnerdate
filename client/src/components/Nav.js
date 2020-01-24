import React, {useState, useEffect} from 'react';

import Menu from './Menu';

import './styles/Nav.scss';
import './styles/Menu.scss';

export default function Nav(props) {

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuIconClasses, setMenuIconClasses] = useState('menu-icon');
  const [menuClasses, setMenuClasses] = useState('menu');

  const toggleMenu = function() {
    setMenuOpen(!menuOpen);
  }

  useEffect(() => {
    if (menuOpen) {
      console.log('changing menu bars');
      setMenuIconClasses('menu-icon menu-icon-open');
      setMenuClasses('menu menu-open');
    } else {
      setMenuIconClasses('menu-icon');
      setMenuClasses('menu');
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
      <Menu menuClasses={menuClasses} />
    </div>
  );
};