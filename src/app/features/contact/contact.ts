import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  contact = {
    name: '',
    email: '',
    message: ''
  };

  submit() {
    console.log('Contact Form:', this.contact);
    alert('Thank you! We will get back to you soon.');
    this.contact = { name: '', email: '', message: '' };
  }
}