import { inject, Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private afAuth = inject(Auth);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private userSubject = new BehaviorSubject<User | null>(null);
  $user = this.userSubject.asObservable();
  isLoggedInGuard: boolean = false;
  private authChecked = new BehaviorSubject<boolean>(false);
  authChecked$ = this.authChecked.asObservable();

  constructor() {
    this.loadUser();
  }



  loadUser() {
    onAuthStateChanged(this.afAuth, (user: User | null) => {
      if (user) {
        this.userSubject.next(user);
        localStorage.setItem('User', JSON.stringify(user));
      } else {
        this.userSubject.next(null);
        localStorage.removeItem('User');
      }

       this.authChecked.next(true);
    });
  }


  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.afAuth, email, password).then(() => {
      this.toastr.success('Logged in Successfully');
      this.loadUser();
      this.isLoggedInGuard = true;
      this.router.navigate(['/']);
    })
      .catch(e => {
        this.toastr.warning('Error: The password is invalid or the user does not have a password');
      })
  }


  logOut() {
    return signOut(this.afAuth).then(() => {
      this.toastr.success('User Logged Out Successfully');
      this.isLoggedInGuard = false;
      this.router.navigate(['/login']);
    });
  }

}
