import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private firestore = inject(Firestore);
  private toastr = inject(ToastrService);

  constructor() { }

  saveData(data: any) {
    const categoriesRef = collection(this.firestore, 'categories');

    addDoc(categoriesRef, data)

      .then(categoryDoc => {
        // console.log('Category added', categoryDoc);
        this.toastr.success('Data Submitted Successfully...')
      })

      .catch(err => {
        console.log(err);
      })
  }

  loadData(): Observable<any[]> {
    const categoriesRef = collection(this.firestore, 'categories');
    return collectionData(categoriesRef, { idField: 'id' });
  }

  async updateData(id: string, updatedCategory: string) {
    const categoriesRef = doc(this.firestore, 'categories', id);
   await updateDoc(categoriesRef, { category: updatedCategory });
    this.toastr.success('Category Updated Successfully...');
  }

  async deleteData(id: string){
    const categoriesRef = doc(this.firestore, 'categories', id);
    await deleteDoc(categoriesRef);
    this.toastr.success('Category Deleted Successfully...');
  }

}
