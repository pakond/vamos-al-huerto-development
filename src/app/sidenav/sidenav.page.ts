import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.page.html',
  styleUrls: ['./sidenav.page.scss'],
})

export class SidenavPage implements OnInit {

  active = '';

  nav = [
    {
      name: 'Parcelas',
      link: '/parcela',
      icon: 'grid'
    },
    {
      name: 'Especies',
      link: '/especies',
      icon: 'leaf'
    },
    {
      name: 'Settings',
      link: '/settings',
      icon: 'settings'
    },
    {
      name: 'Logout',
      link: '/logout',
      icon: 'log-out'
    },
    {
      name: 'About',
      link: '/about',
      icon: 'information-circle'
    }
  ];

  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.active = event.url;
    });
  }

  ngOnInit() {}

}
