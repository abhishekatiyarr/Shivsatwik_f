import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../Service/auth-service'; // adjust path

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isMenuOpen = false;
  isHomeRoute = true;

  constructor(
    private router: Router,
    public auth: AuthService // 👈 public so HTML can access it
  ) {
    // detect current route (for "Back to Home")
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isHomeRoute = event.urlAfterRedirects === '/';
      });
  }


  // used in HTML → auth.user
  get user() {
    return this.auth.user();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  // LOGIN
  openLogin() {
    this.closeMenu();
    this.router.navigate(['/verify-phone']);
  }

  // LOGOUT
  doLogout() {
    this.auth.logout();
    // this.auth.user.set(null);
    this.closeMenu();
    // this.router.navigate(['/']);
  }
}