import { Component, Input } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';
import { BackendService, UserItemType } from '../backend.service';
import { from } from 'rxjs';

@Component({
  selector: 'iinv-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  userItems: Array<UserItemType> = [];
  finishedLoadingItems: Boolean = false;
  @Input() isLoggedIn = false;
  userProfile: KeycloakProfile | null = null;

  constructor(private backend: BackendService, private readonly keycloak: KeycloakService) { }

  ngOnInit() {
    if(this.isLoggedIn) {
      from(this.keycloak.loadUserProfile()).subscribe(profile => {
        this.userProfile = profile;
      })
    }
    
    this.backend.getUserItems().subscribe(res => {
      this.userItems = res;
      this.finishedLoadingItems = true;
    });
  }

}
