import { Component, signal } from '@angular/core';

import { Navbar } from "./shared/navbar/navbar";
import { Footer } from "./shared/footer/footer";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('shivsatwik');
}
