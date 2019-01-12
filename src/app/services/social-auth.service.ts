import { Injectable } from '@angular/core';
import { SocialAuthCredentialModel } from '../models/social-auth-credential.model';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { SocialAuthProfileModel } from '../models/social-auth-profile.model';
import { UserService } from '../services/user.service';
import { ToasterService } from './toaster.service';

@Injectable({
  providedIn: 'root'
})
export class SocialAuthService {

  constructor(public afAuth: AngularFireAuth,
    private userService: UserService,
    private toasterService: ToasterService) { }

  getGoogleCredential() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    return this.afAuth.auth.signInWithPopup(provider);
  }

  getFacebookCredential() {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email');
    provider.addScope('public_profile');
    return this.afAuth.auth.signInWithPopup(provider);
  }

  loginWithGoogle() {
    this.getGoogleCredential().then(res => {
      const jsonUserInfo = JSON.stringify(res.additionalUserInfo.profile);
      const googleProfile: SocialAuthProfileModel = JSON.parse(jsonUserInfo);
      localStorage.setItem('email', googleProfile.email);
      const jsonCredential = JSON.stringify(res.credential);
      const googleModel: SocialAuthCredentialModel = JSON.parse(jsonCredential);
      this.userService.signinGoogle(googleModel.accessToken);
    }, err => {
      this.toasterService.showToaster('Can`t get access to google server. Please try one more time');
    });
  }

  loginWithFacebook() {
    this.getFacebookCredential().then(res => {
      const jsonUserInfo = JSON.stringify(res.additionalUserInfo.profile);
      const googleProfile: SocialAuthProfileModel = JSON.parse(jsonUserInfo);
      localStorage.setItem('email', googleProfile.email);
      const jsonCredential = JSON.stringify(res.credential);
      const facebookModel: SocialAuthCredentialModel = JSON.parse(jsonCredential);
      this.userService.signinFacebook(facebookModel.accessToken);
    }, err => {
      this.toasterService.showToaster('Can`t get access to facebook server. Please try one more time');
    });
  }
}
