import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import { home, list, informationCircle } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})

export class AppComponent {
  constructor() {
    addIcons({ home, list, informationCircle });
  }
}
