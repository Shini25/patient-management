import { Component, OnInit } from '@angular/core';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{


  ngOnInit() {
    AOS.init();
  }

  title = 'FrontVisitor';
  homeIcon = faHome;
  ajoutIcon = faPlus;
  listIcon = faList;
  infoIcon = faInfoCircle;

  darkModeEnabled = false;

onThemeChanged(darkMode: boolean): void {
  this.darkModeEnabled = darkMode;

  if (darkMode) {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }

  // Vous devrez peut-être également rafraîchir l'apparence des éléments de votre interface utilisateur ici
}

}
