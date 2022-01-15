import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import store from "../store";
import { addUser } from "../store/user";
import logger from "../logger";

const init = () => {
  initializeApp({
    apiKey: "AIzaSyCwNo4ArwZJ49BJVGZMvCmtRrHjreEiP1c",
    authDomain: "brainstorm-6e40f.firebaseapp.com",
    projectId: "brainstorm-6e40f",
    storageBucket: "brainstorm-6e40f.appspot.com",
    messagingSenderId: "43210323692",
    appId: "1:43210323692:web:7cc36e10d2290d394017c9",
    measurementId: "G-KECB4ZY1NE",
  });
};

const authChangeListener = (auth) =>
  onAuthStateChanged(auth, (user) => {
    console.log(user);
    if (user) {
      store.dispatch(addUser(user.uid));
      console.log(store.getState());
    } else {
      // User is signed out
      // ...
    }
  });

const reqistry = (auth) =>
  signInAnonymously(auth)
    .then(() => {
      console.log("auth");
    })
    .catch((error) => {
      logger(error);
    });

const database = {
  auth: () => getAuth(),
  init,
  authChangeListener: (auth) => authChangeListener(auth),
  reqistry: (auth) => reqistry(auth),
};

export default database;
