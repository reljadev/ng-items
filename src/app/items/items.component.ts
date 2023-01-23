import { Component } from '@angular/core';
import { BackendService, ItemType } from '../backend.service';

@Component({
  selector: 'iinv-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {
  items: Array<ItemType> = [];

  constructor(private backend: BackendService) { }

  ngOnInit() {
    this.backend.getAllItems().subscribe(res => {
      this.items = res;
    });
  }

  orderItem(catalogItemId: string) {
    this.backend.orderItem(catalogItemId);
  }

}
