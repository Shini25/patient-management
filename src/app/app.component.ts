import { Component, OnInit } from '@angular/core';
import { faHome, faPlus, faList, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import * as AOS from 'aos';

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
  darkModeEnabled = false;
  isPatientMenuOpen = false;  
  isDoctorMenuOpen = true;  // Initialize to true to open Doctor menu by default
  isConsultationMenuOpen = false;
  isAppointmentMenuOpen = false;

  ngOnInit() {
    AOS.init();
  }

  onThemeChanged(darkMode: boolean): void {
    this.darkModeEnabled = darkMode;
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  closeAllMenus(): void {
    this.isPatientMenuOpen = false;
    this.isDoctorMenuOpen = false;
    this.isConsultationMenuOpen = false;
    this.isAppointmentMenuOpen = false;
  }

  toggleMenu(menu: string): void {
    // Ferme tous les menus si celui cliqué est déjà ouvert
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

  isMenuSelected(menu: string): boolean {
    if (menu === 'patient') return this.isPatientMenuOpen;
    if (menu === 'doctor') return this.isDoctorMenuOpen;
    if (menu === 'consultation') return this.isConsultationMenuOpen;
    if (menu === 'appointment') return this.isAppointmentMenuOpen;
    return false;
  }
}
