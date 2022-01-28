import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import store from "../store";
import { addUser } from "../store/user";
import logger from "../logger";
import { hideMainLoader, showMainLoader } from "../store/loader";

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
    if (user) {
      store.dispatch(addUser(user.uid));
    } else {
      console.log("exit");
    }
  });

const reqistry = (auth) => {
  store.dispatch(showMainLoader());

  signInAnonymously(auth)
    .catch((error) => logger(error))
    .finally(() => store.dispatch(hideMainLoader()));
};

const writeData = ({ path, data }) => {
  if (!path || !data) return null;

  const firestore = getFirestore();
  const ref = doc(firestore, path);

  return setDoc(ref, data, { merge: true }).catch((e) => {
    logger(e);
  });
};

const getData = ({ path }) => {
  if (!path) return null;

  const firestore = getFirestore();
  const ref = doc(firestore, path);

  return getDoc(ref).catch((e) => {
    logger(e);
  });
};

const deleteData = ({ path }) => {
  if (!path) return null;

  const firestore = getFirestore();
  const ref = doc(firestore, path);

  return deleteDoc(ref).catch((e) => {
    logger(e);
  });
};

const removeFieldObject = ({ path, pathField, data, deleteFieldName }) => {
  if (!path || !data || !deleteFieldName) return null;
  const dataField = data[pathField];
  const firestore = getFirestore();
  const ref = doc(firestore, path);
  const result = { [pathField]: {} };

  Object.keys(dataField).forEach((key) => {
    if (key !== deleteFieldName) {
      result[pathField] = { ...result[pathField], [key]: dataField[key] };
    }
  });

  return updateDoc(ref, result).catch((e) => {
    logger(e);
  });
};

const listenerData = ({ path, subscribe }) => {
  const firestore = getFirestore();
  const ref = doc(firestore, path);

  onSnapshot(ref, (doc) => {
    subscribe(doc.data());
  });
};

const database = {
  auth: getAuth,
  init,
  authChangeListener,
  reqistry,
  writeData,
  getData,
  listenerData,
  deleteData,
  removeFieldObject,
};

export default database;
