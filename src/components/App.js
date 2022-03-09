import React,{ useState, useEffect } from 'react';
import Header from './Header.js'
import Main from './Main.js'
import Footer from './Footer.js'
import PopupWithForm from './PopupWithForm.js'
import ImagePopup from './ImagePopup.js'
import api from '../utils/Api.js'
import {CurrentUserContext} from '../contexts/CurrentUserContext.js'
import EditProfilePopup from './EditProfilePopup.js'
import EditAvatarPopup from './EditAvatarPopup.js'
import AddPlacePopup from './AddPlacePopup.js'
import { Route, Switch, Redirect } from 'react-router-dom'
import Register from './Register.js'
import Login from './Login.js'
import ProtectedRoute from './ProtectedRoute';

function App() {

  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({name:'', about:'', avatar:''});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    Promise.all([api.getUser(), api.getInitialCards()])
    .then(([userData, cardsData])=>{
      setCurrentUser(userData);
      setCards(cardsData);
    })
    .catch((err)=>{
      console.log(err);
    });  
  },[]);

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }
  
  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }
  
  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setSelectedCard(null);
  }

  function handleUpdateUser(currentUser) {
    api.patchUserData(currentUser)
        .then((data)=>{
          setCurrentUser(data);
          closeAllPopups();
        })
        .catch((err)=>{
            console.log(err);
        });
  }

  function handleUpdateAvatar(currentUser) {
    api.patchAvatar(currentUser.avatar)
        .then((data)=>{
          setCurrentUser(data);
          closeAllPopups();
        })
        .catch((err)=>{
            console.log(err);
        });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
    .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
    .catch((err)=>{
        console.log(err);
    });
  }

  function handleCardDelete(card) {
      api.deleteCard(card._id)
      .then(() => {
          setCards(cards.filter(item => item._id !== card._id))
      })
      .catch((err)=>{
          console.log(err);
      });
  }

  function handleAddPlaceSubmit(cadr) {
    api.postNewCard(cadr)
        .then((data)=>{
          setCards([data, ...cards]);
          closeAllPopups();
        })
        .catch((err)=>{
            console.log(err);
        });
  }

  return (
    <div className='root'>
      <CurrentUserContext.Provider value={currentUser}>
        {/* <Header /> */}
        <Switch>
          <Route path="/sign-up">
            <Header />
            <Register />
          </Route>
          <Route path="/sign-in">
            <Header text='Войти'/>
            <Login />
          </Route>
          <ProtectedRoute 
              path="/" 
              loggedIn={loggedIn}
              component={Header}
          />
          <ProtectedRoute 
              path="/" 
              loggedIn={loggedIn}
              component={Footer}
          />
              
          
          {/* <ProtectedRoute 
              path="/" 
              loggedIn={loggedIn}
              onEditProfile={handleEditProfileClick} 
              onAddPlace={handleAddPlaceClick} 
              onEditAvatar={handleEditAvatarClick} 
              onCardClick={handleCardClick}
              cards={cards} 
              onCardLike={handleCardLike} 
              onCardDelete={handleCardDelete} 
              component={Main}
          /> */}
          {/* <ProtectedRoute 
              path="/" 
              loggedIn={loggedIn}
              component={Footer}
          /> */}
          {/* <Route exact path="/">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route> */}
        </Switch>
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/>
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} buttonText='Создать' onAddPlace={handleAddPlaceSubmit}/>
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/>
        <PopupWithForm name='delete-place' title='Вы уверены?'>
          <button className="popup__close-button" type="button" aria-label="Close"></button>
          <h2 className="popup__title">Вы уверены?</h2>
          <button className="popup__button" type="submit">Да</button>
        </PopupWithForm>
        <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
