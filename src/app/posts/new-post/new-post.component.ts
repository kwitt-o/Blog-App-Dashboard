import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category';
import { CommonModule } from '@angular/common';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PostsService } from '../../services/posts.service';
import { ImagekitioAngularModule } from 'imagekitio-angular';

@Component({
  selector: 'app-new-post',
  imports: [FormsModule, RouterModule, CommonModule, AngularEditorModule, ReactiveFormsModule, ImagekitioAngularModule],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})
export class NewPostComponent implements OnInit {

  permalink: string = '';
  imgSrc: any = 'assets/images/img-placeholder.jpeg';
  selectedImg: any;
  categories: Category[] = [];
  htmlContent = '';
  postForm!: FormGroup;
  post: any;
  formStatus: string = 'Add New';
  postId: string | null = null;

  private categoryService = inject(CategoriesService);
  private fb = inject(FormBuilder);
  private postService = inject(PostsService);
  private route = inject(ActivatedRoute);


  constructor() {

  }



  ngOnInit(): void {
    this.route.queryParams.subscribe(val => {
      const id = val['id'];
      if (id) {
        this.postId = id;
        this.formStatus = 'Edit';
        this.postService.loadOneData(id).subscribe(post => {
          if (post) {
            this.post = post;

            this.postForm = this.fb.group({
              title: [this.post.title, [Validators.required, Validators.minLength(10)]],
              permalink: [this.post.permalink, Validators.required],
              excerpt: [this.post.excerpt, [Validators.required, Validators.minLength(50)]],
              category: [`${this.post.category.categoryId}-${this.post.category.category}`, Validators.required],
              postImg: ['', []],
              content: [this.post.content, Validators.required]
            });

            this.imgSrc = this.post.postImgPath;
          } else {
            console.warn('Post not found!');
          }
        });
      } else {
        this.formStatus = 'Add';
      }
    });


    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      permalink: ['', Validators.required],
      excerpt: ['', [Validators.required, Validators.minLength(50)]],
      category: ['', Validators.required],
      postImg: ['', Validators.required],
      content: ['', Validators.required]
    })

    this.postForm.get('title')?.valueChanges.subscribe((title: string) => {
      const slug = title?.trim().toLowerCase().replace(/\s+/g, '-');
      this.postForm.get('permalink')?.setValue(slug, { emitEvent: false });
    });

    this.categoryService.loadData().subscribe(val => {
      this.categories = val;
    });


  }

  get fc() {
    return this.postForm.controls;
  }

  fieldLabels: { [key: string]: string } = {
    title: 'Title',
    permalink: 'Permalink',
    excerpt: 'Excerpt',
    category: 'Category',
    postImg: 'Post Image',
    content: 'Content'
  };

  getErrorMessage(controlName: string): string {
    const label = this.fieldLabels[controlName] || controlName;
    const control = this.fc[controlName];

    if (control.hasError('required')) {
      return `${label} is required.`;
    }

    if (control.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      return `${label} must be at least ${requiredLength} characters long.`;
    }

    return '';
  }

  showPreview(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imgSrc = reader.result as string;
      };
      reader.readAsDataURL(file);
      this.selectedImg = file;
    }
  }



  // async onSubmit(){
  //   try {
  //     const post = await this.postService.uploadImageAndCreatePost(this.postForm.value, this.selectedImg);

  //     if (this.formStatus === 'Edit' && this.postId) {
  //         await this.postService.updatePostData(this.postId, post)
  //     } else {
  //       await this.postService.savePost(post);
  //     }

  //     this.postForm.reset();
  //     this.imgSrc = 'assets/images/img-placeholder.jpeg';
  //     this.selectedImg = '';
  //   } catch (error) {
  //     console.error('Error submitting post', error);
  //   }
  // }

//   async onSubmit() {
//   try {
//     const post = await this.postService.uploadImageAndCreatePost(
//       this.postForm.value,
//       this.selectedImg,
//       this.formStatus === 'Edit' && this.post
//         ? { url: this.post.postImgPath, fileId: this.post.imageFileId }
//         : undefined
//     );

//     if (this.formStatus === 'Edit' && this.postId) {
//       await this.postService.updatePostData(this.postId, post);
//     } else {
//       await this.postService.savePost(post);
//     }

//     this.postForm.reset();
//     this.imgSrc = 'assets/images/img-placeholder.jpeg';
//     this.selectedImg = '';
//   } catch (error) {
//     console.error('Error submitting post', error);
//   }
// }

async onSubmit() {
  try {
    // ✅ When editing, use existing image if no new file is selected
    const post = await this.postService.uploadImageAndCreatePost(
      this.postForm.value,
      this.selectedImg,
      this.formStatus === 'Edit' && this.post
        ? { url: this.post.postImgPath, fileId: this.post.imageFileId } // ✅ Existing image fallback
        : undefined
    );

    if (this.formStatus === 'Edit' && this.postId) {
      await this.postService.updatePostData(this.postId, post);
    } else {
      await this.postService.savePost(post);
    }

    this.postForm.reset();
    this.imgSrc = 'assets/images/img-placeholder.jpeg';
    this.selectedImg = '';
  } catch (error) {
    console.error('Error submitting post', error);
  }
}

}
