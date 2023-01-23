import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './profile/profile.component';
import { ItemsComponent } from './items/items.component';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080',
        realm: 'samplerealm',
        clientId: 'sampleclient'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
        pkceMethod: "S256"
      },
      shouldAddToken: (request) => {
        const { method, url } = request;
    
        const isGetRequest = 'GET' === method.toUpperCase();
        const excludedUrls = ["https://localhost:7229/items"];
        const isExcludedUrlMatch = excludedUrls.includes(url);
    
        return !(isGetRequest && isExcludedUrlMatch);
      }
    });
}

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    ItemsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    KeycloakAngularModule,
    NgbModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
