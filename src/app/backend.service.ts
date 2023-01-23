import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, from, Observable, of, switchMap } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(private http: HttpClient, private readonly keycloak: KeycloakService, private auth: AuthService) { }

  getAllItems(): Observable<ItemType[]> {
    return this.http.get<Array<ItemType>>("https://localhost:7229/items");
  }

  getUserItems(): Observable<UserItemType[]> {
    return from(this.keycloak.isLoggedIn()).pipe(
            switchMap(isLogged => {
              if(isLogged) {
                return from(this.auth.getUserId())
              } else {
                throw "user not logged in";
              }
            }),
            switchMap(userId => {
              return this.http.get<Array<UserItemType>>(`https://localhost:7130/items/?userId=${userId}`)
            }),
            catchError(err => of([]))
          );
  }

  orderItem(catalogItemId: string): void {
    from(this.keycloak.isLoggedIn()).subscribe(loggedIn => {
      if(loggedIn) {
        this.http.post("https://localhost:7130/items", {
          catalogItemId: catalogItemId,
          quantity: 1
        }).subscribe();
      }
    });
  }
}

export interface ItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  createdDate: Date;
}

export interface UserItemType {
  catalogItemId: number;
  name: string;
  description: string;
  quantity: number;
  acquiredDate: Date;
}
