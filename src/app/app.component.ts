import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChildren('scrollSection') scrollSections!: QueryList<ElementRef>;
  @ViewChildren('navLink') navLinks!: QueryList<ElementRef>;
  @ViewChildren('thirdSection') thirdSections!: QueryList<ElementRef>;
  @ViewChildren('circle') circles!: QueryList<ElementRef>;
  @ViewChildren('loginFormContent') loginFormContents!: QueryList<ElementRef>;
  @ViewChildren('loginFormPic') loginFormPics!: QueryList<ElementRef>;
  @ViewChildren('AboutUsContent') aboutUsContents!: QueryList<ElementRef>;
  @ViewChildren('BackToTop') backToTop!: QueryList<ElementRef>;

  /*
  isPatientMenuOpen = false;  
  isDoctorMenuOpen = false;  // Initialize to true to open Doctor menu by default
  isConsultationMenuOpen = false;
  isAppointmentMenuOpen = false;
  */
  isPatientRoute = false;
  isDoctorRoute = false;
  isConsultationRoute = false;
  isAppointmentRoute = false;
  
  showPatientOptions = false;
  showDoctorOptions = false;
  showConsultationOptions = false;
  showAppointmentOptions = false;

  closePatientOptions() {
    this.showPatientOptions = false;
  }

  closeDoctorOptions() {
    this.showDoctorOptions = false;
  }

  closeConsultationOptions() {
    this.showConsultationOptions = false;
  }

  closeAppointmentOptions() {
    this.showAppointmentOptions = false;
  }
  

  constructor(private router: Router, private toastr: ToastrService, private location: Location) {}

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

    //Manual scrollspy 
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5 // Adjust the threshold as needed
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Display a toast message when the section is visible

          // Cast the entry target to HTMLElement to access style property
          const targetElement = entry.target as HTMLElement;
          targetElement.style.opacity = '1';

          // Set opacity to 0 for all other sections
          this.scrollSections.forEach(section => {
            const sectionElement = section.nativeElement as HTMLElement;
            if (sectionElement !== targetElement) {
              sectionElement.style.opacity = '0';
            }
          });

          // Highlight the corresponding navigation link
          this.navLinks.forEach(link => {
            const linkElement = link.nativeElement as HTMLElement;
            if (linkElement.getAttribute('href') === `#${entry.target.id}`) {
              linkElement.style.color = 'blue';
            } else {
              linkElement.style.color = '';
            }
          });

          // Update the URL fragment without scrolling
          this.location.replaceState(`#${entry.target.id}`);
        }
      });
    }, options);

    // Observe each scroll-section element after view init
    this.scrollSections.forEach(section => {
      observer.observe(section.nativeElement);
    });

    // Zoom In animation
    const thirdObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('zoomIn');
        } else {
          entry.target.classList.remove('zoomIn');
        }
      });
    }, { threshold: 0.5 });

    this.thirdSections.forEach(section => {
      thirdObserver.observe(section.nativeElement);
    });

    // Slide in right animation
    const observedElements = new Set(); // Set to store observed elements

    const slideInRightObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !observedElements.has(entry.target)) {
          entry.target.classList.add('slideIn-right');
          observedElements.add(entry.target); // Add element to the set of observed elements
        } else if (!entry.isIntersecting && observedElements.has(entry.target)) {
          entry.target.classList.remove('slideIn-right');
          observedElements.delete(entry.target); // Remove element from the set of observed elements
        }
      });
    });


    // Slide in left animation
    const slideInLeftObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !observedElements.has(entry.target)) {
          entry.target.classList.add('slideIn-left');
          observedElements.add(entry.target); // Add element to the set of observed elements
        } else if (!entry.isIntersecting && observedElements.has(entry.target)) {
          entry.target.classList.remove('slideIn-left');
          observedElements.delete(entry.target); // Remove element from the set of observed elements
        }
      });
    });
  
    // Observing each circle element for slide in right 
    this.circles.forEach(circle => {
      slideInRightObserver.observe(circle.nativeElement);
    });

    // Observing each loginFormContentn element for slide in right
    this.loginFormContents.forEach(loginFormContent => {
      slideInRightObserver.observe(loginFormContent.nativeElement);
    });

    // Observing each loginFormPic element for slide in right
    this.loginFormPics.forEach(loginFormPic => {
      slideInLeftObserver.observe(loginFormPic.nativeElement);
    });

    // Observing each aboutUsContent element for slide in right
    this.aboutUsContents.forEach(aboutUsContent => {
      slideInLeftObserver.observe(aboutUsContent.nativeElement);
    });

    // observing each backToTop element for slide in right
    this.backToTop.forEach(backToTops => {
      slideInRightObserver.observe(backToTops.nativeElement);
    });
    

  }

  /*
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
  */


  // Add this method to handle scrolling
  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
