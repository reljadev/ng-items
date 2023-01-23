import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { from } from 'rxjs';

@Component({
  selector: 'iinv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoggedIn = false;

  constructor(private readonly keycloak: KeycloakService) {}

  public ngOnInit() {
    from(this.keycloak.isLoggedIn()).subscribe(isLogged => {
      this.isLoggedIn = isLogged;
    });
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout();
  }
}
