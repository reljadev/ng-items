import { Component, Input } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'iinv-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  @Input() isLoggedIn = false;
  @Input() userProfile: KeycloakProfile | null = null;

}
