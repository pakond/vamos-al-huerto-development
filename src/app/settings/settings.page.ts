import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  environments = environment;

  constructor() { }

  ngOnInit() {
  }

  async newLanguage(language: string) {
    
    localStorage.setItem('language', language);
    
  }
}
