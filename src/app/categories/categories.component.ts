import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-categories',
  imports: [FormsModule, CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  private categoryService = inject(CategoriesService);

  constructor() { }

  categories: any[] = [];
  formCategory: string = '';
  formStatus: string = 'Add';
  categoryId: string = '';

  ngOnInit() {
    this.categoryService.loadData().subscribe(data => {
      this.categories = data;
      // console.log('Loaded Categories', data);
    })
  }

  onSubmit(formData: any) {
    let categoryData: Category = {
      category: formData.value.category
    }

    if (this.formStatus === 'Add') {
      this.categoryService.saveData(categoryData);
      formData.reset();
    }

    else if (this.formStatus === 'Edit') {
      this.categoryService.updateData(this.categoryId, categoryData.category)
        .then(() => {
          this.formStatus = 'Add';
          this.formCategory = '';
          formData.reset();
        });
    }



  }

  onEdit(category: any, id: string) {
    this.formCategory = category;
    this.formStatus = 'Edit';
    this.categoryId = id;

    const categoryInput = document.getElementById('categoryInput');
    if (categoryInput) {
      categoryInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

  }

  onDelete(id: string) {
    this.categoryService.deleteData(id);
  }


}
