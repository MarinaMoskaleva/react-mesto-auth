import React from "react";
import Header from './Header.js'
import Main from './Main.js'
import Footer from './Footer.js'

function MainPage({onEditProfile, onAddPlace, onEditAvatar, onCardClick, cards, onCardLike, onCardDelete, email}){
    return (
        <>
            <Header text='Выйти' link='/sign-in' email={email}/>
            <Main 
                onEditProfile={onEditProfile} 
                onAddPlace={onAddPlace} 
                onEditAvatar={onEditAvatar} 
                onCardClick={onCardClick} 
                cards={cards} 
                onCardLike={onCardLike} 
                onCardDelete={onCardDelete}
            />
            <Footer />
        </>
        
    );
}

export default MainPage;