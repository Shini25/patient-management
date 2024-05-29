import { Component, OnInit, AfterViewInit } from '@angular/core';
import { faHome, faPlus, faList, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import * as AOS from 'aos';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit  {

  title = 'FrontVisitor';
  homeIcon = faHome;
  ajoutIcon = faPlus;
  listIcon = faList;
  infoIcon = faInfoCircle;

  isPatientMenuOpen = false;  
  isDoctorMenuOpen = false;  // Initialize to true to open Doctor menu by default
  isConsultationMenuOpen = false;
  isAppointmentMenuOpen = false;
  isPatientRoute = false;
  isDoctorRoute = false;
  isConsultationRoute = false;
  isAppointmentRoute = false;
  

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isPatientRoute = this.router.url.includes('/add-patient') || this.router.url.includes('/list-patient');
      this.isDoctorRoute = this.router.url.includes('/add-doctor') || this.router.url.includes('/list-doctor') || this.router.url.includes('/home');
      this.isConsultationRoute = this.router.url.includes('/add-consultation') || this.router.url.includes('/list-consultation');
      this.isAppointmentRoute = this.router.url.includes('/add-appointment') || this.router.url.includes('/list-appointment');
    });
  }

  ngAfterViewInit() {
    AOS.init();
    const aosElements = document.querySelectorAll('[data-aos]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            console.log(entry); // Pour voir l'état de chaque entrée
            if (entry.intersectionRatio > 0) {
                entry.target.classList.add('aos-animate');
            } else {
                entry.target.classList.remove('aos-animate');
            }
        });
    }, {threshold: 0.1});  // Ajustez le seuil selon les besoins

    aosElements.forEach(element => {
        observer.observe(element);
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
  
  // Ajoutez cette méthode pour gérer le défilement
  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
