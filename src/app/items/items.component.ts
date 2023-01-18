import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'iinv-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {
  items: Array<ItemType> = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    //TODO: there should be one service for calling API
    this.http.get<Array<ItemType>>("https://localhost:7229/items").subscribe(res => {
      this.items = res;
    });
  }
}

export interface ItemType {
  id: number;
  name: string;
  description: string;
  price: number;
  createdDate: Date;
}
