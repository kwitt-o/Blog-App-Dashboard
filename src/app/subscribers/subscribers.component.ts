import { Component, inject, OnInit } from '@angular/core';
import { SubscribersService } from '../services/subscribers.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-subscribers',
  imports: [CommonModule, RouterModule],
  templateUrl: './subscribers.component.html',
  styleUrl: './subscribers.component.css'
})
export class SubscribersComponent implements OnInit {
  private subService = inject(SubscribersService);

  subscribers: any[] = [];

  ngOnInit(): void {
    this.subService.loadData().subscribe(val => {
      this.subscribers = val;
    })
  }

  onDelete(id: string) {
    this.subService.deleteData(id);
  }
}
