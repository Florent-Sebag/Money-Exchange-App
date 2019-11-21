import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() {
  }

  loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
          .then(
              res => resolve(res),
              err => reject(err));
    });
  }

  registerUser(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
          .then(
              res => resolve(res),
              err => reject(err));
    });
  }

  updateProfile(username) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {

        if (user) {
          console.log(user);
          user.updateProfile({displayName: username}).then(
              res => resolve(res),
              err => reject(err));
        }
      });
    });
  }


  logoutUser() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut()
            .then(() => {
              console.log('LOG Out');
              resolve();
            }).catch((error) => {
          reject();
        });
      }
    });
  }

  userDetails() {
    return firebase.auth().currentUser;
  }
}
