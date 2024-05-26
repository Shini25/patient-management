import { Component, OnInit } from '@angular/core';
import { faHome, faPlus, faList, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import * as AOS from 'aos';
import { Router, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'FrontVisitor';
  homeIcon = faHome;
  ajoutIcon = faPlus;
  listIcon = faList;
  infoIcon = faInfoCircle;
<<<<<<< HEAD
  isPatientMenuOpen = false;
  isDoctorMenuOpen = false;  
=======
  darkModeEnabled = false;
  isPatientMenuOpen = false;  
  isDoctorMenuOpen = true;  // Initialize to true to open Doctor menu by default
>>>>>>> 6c741d0 (alohanyAtory commit)
  isConsultationMenuOpen = false;
  isAppointmentMenuOpen = false;
  isPatientRoute = false;
  isDoctorRoute = false;
  isConsultationRoute = false;
  isAppointmentRoute = false;
  

  constructor(private router: Router, private viewportScroller: ViewportScroller) {}

  ngOnInit() {
    AOS.init();
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isPatientRoute = this.router.url.includes('/add-patient') || this.router.url.includes('/list-patient');
      this.isDoctorRoute = this.router.url.includes('/add-doctor') || this.router.url.includes('/list-doctor') || this.router.url.includes('/home');
      this.isConsultationRoute = this.router.url.includes('/add-consultation') || this.router.url.includes('/list-consultation');
      this.isAppointmentRoute = this.router.url.includes('/add-appointment') || this.router.url.includes('/list-appointment');
    });
  }

  closeAllMenus(): void {
    this.isPatientMenuOpen = false;
    this.isDoctorMenuOpen = false;
    this.isConsultationMenuOpen = false;
    this.isAppointmentMenuOpen = false;
  }

  toggleMenu(menu: string): void {
    if ((menu === 'patient' && this.isPatientMenuOpen) ||
        (menu === 'doctor' && this.isDoctorMenuOpen) ||
        (menu === 'consultation' && this.isConsultationMenuOpen) ||
        (menu === 'appointment' && this.isAppointmentMenuOpen)) {
      this.closeAllMenus();
    } else {
      this.closeAllMenus();
      if (menu === 'patient') {
        this.isPatientMenuOpen = true;
      } else if (menu === 'doctor') {
        this.isDoctorMenuOpen = true;
      } else if (menu === 'consultation') {
        this.isConsultationMenuOpen = true;
      } else if (menu === 'appointment') {
        this.isAppointmentMenuOpen = true;
      }
    }
  }

<<<<<<< HEAD
  // Ajoutez cette méthode pour gérer le défilement
  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
=======
  isMenuSelected(menu: string): boolean {
    if (menu === 'patient') return this.isPatientMenuOpen;
    if (menu === 'doctor') return this.isDoctorMenuOpen;
    if (menu === 'consultation') return this.isConsultationMenuOpen;
    if (menu === 'appointment') return this.isAppointmentMenuOpen;
    return false;
>>>>>>> 6c741d0 (alohanyAtory commit)
  }
}
