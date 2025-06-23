import { Component, inject, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  user: User | null = null;
  isLoginPage: boolean = false;
  private authService = inject(AuthService);
  private router = inject(Router);


  ngOnInit(): void {
    this.authService.$user.subscribe(user => {
      this.user = user;
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isLoginPage = event.url === '/login'; // Or use includes() if you want to support query params
      });
  }




  onLogOut() {
    this.authService.logOut();
  }


}
