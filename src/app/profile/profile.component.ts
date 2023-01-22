import { Component, Input } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import { HttpClient } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { from, mergeMap } from 'rxjs';

@Component({
  selector: 'iinv-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  userItems: Array<UserItemType> = [];
  finishedLoadingItems: Boolean = false;
  @Input() isLoggedIn = false;
  @Input() userProfile: KeycloakProfile | null = null;

  constructor(private http: HttpClient, private readonly keycloak: KeycloakService) { }

  ngOnInit() {
    //TODO: there should be one service for calling API
    from(this.keycloak.isLoggedIn()).subscribe(loggedIn => {
      if(loggedIn) {
        from(this.getUserId())
        .pipe(mergeMap(userId => {
          return this.http.get<Array<UserItemType>>(`https://localhost:7130/items/?userId=${userId}`)
        }))
        .subscribe(res => {
          this.userItems = res;
          this.finishedLoadingItems = true;
        });
      }
    });
  }

  //TODO: should be in service
  parseJwt(token: string) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  async getUserId() {
    let token = await this.keycloak.getToken();
    return this.parseJwt(token)["sub"];
  }

}

interface UserItemType {
  catalogItemId: number;
  name: string;
  description: string;
  quantity: number;
  acquiredDate: Date;
}
