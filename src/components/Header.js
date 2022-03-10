import React from 'react';
import { Link } from 'react-router-dom';

function Header({text, link, email=''}) {
    function onSignOut(e){
        if (localStorage.getItem('token')){
            localStorage.removeItem('token');
        }
    }

    return (
        <header className="header">
            <a href="#" className="header__logo"></a>
            <Link to={link} onClick={onSignOut} className="header__sign">{text}</Link>
            <p className="header__email">{email}</p>
        </header>
    );
}

export default Header;