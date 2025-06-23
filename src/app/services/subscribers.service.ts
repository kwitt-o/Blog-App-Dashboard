import { inject, Injectable } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, Firestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscribersService {
  private firestore = inject(Firestore);
  private toastr = inject(ToastrService);
  constructor() { }

  loadData(): Observable<any[]> {
    const subRef = collection(this.firestore, 'subscribers');
    return collectionData(subRef, { idField: 'id' });
  }

  async deleteData(id: string){
      const subRef = doc(this.firestore, 'subscribers', id);
      await deleteDoc(subRef);
      this.toastr.success('Subscriber Deleted Successfully.');
    }
}
