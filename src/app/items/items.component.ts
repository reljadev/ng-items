import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { from } from 'rxjs';

@Component({
  selector: 'iinv-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {
  items: Array<ItemType> = [];

  constructor(private http: HttpClient, private readonly keycloak: KeycloakService) { }

  ngOnInit() {
    //TODO: there should be one service for calling API
    this.http.get<Array<ItemType>>("https://localhost:7229/items").subscribe(res => {
      this.items = res;
    });
  }

  orderItem(catalogItemId: string) {
    from(this.keycloak.isLoggedIn()).subscribe(loggedIn => {
      if(loggedIn) {
        console.log("logged in")
        this.http.post("https://localhost:7130/items", {
          catalogItemId: catalogItemId,
          quantity: 1
        })
        .subscribe(res => console.log(res));
      }
    })
  }

  // TODO: should be in service
  parseJwt(token: string) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  async getUserId() : Promise<string> {
    let token = await this.keycloak.getToken();
    return this.parseJwt(token)["sub"];
  }

}

interface ItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  createdDate: Date;
}
