import { inject, Injectable } from '@angular/core';
import { Post } from '../models/post';
import { collectionData, docData, Firestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { addDoc, collection, deleteDoc, doc, orderBy, query, updateDoc } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private firestore = inject(Firestore);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  // uploadImageAndCreatePost(postFormValue: any, selectedImg: File): Promise<Post> {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       // 1. Get auth
  //       const authRes = await fetch('http://localhost:3000/auth');
  //       const { signature, expire, token } = await authRes.json();

  //       // 2. Upload
  //       const formData = new FormData();
  //       formData.append('file', selectedImg);
  //       formData.append('fileName', selectedImg.name);
  //       formData.append('publicKey', 'public_j9Q5MuMYw5U55rrTDFU11ahhIk4=');
  //       formData.append('signature', signature);
  //       formData.append('expire', expire.toString());
  //       formData.append('token', token);

  //       const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
  //         method: 'POST',
  //         body: formData
  //       });

  //       const uploadResult = await uploadRes.json();
  //       const imageUrl = uploadResult.url;
  //       const imageFileId = uploadResult.fileId;

  //       // 3. Build post
  //       const [categoryId, categoryName] = postFormValue.category.split('-');

  //       const postData: Post = {
  //         title: postFormValue.title,
  //         permalink: postFormValue.permalink,
  //         category: { categoryId, category: categoryName },
  //         postImgPath: imageUrl,
  //         imageFileId: imageFileId,
  //         excerpt: postFormValue.excerpt,
  //         content: postFormValue.content,
  //         isFeatured: false,
  //         views: 0,
  //         status: 'new',
  //         createdAt: new Date()
  //       };

  //       resolve(postData);
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // }

//  
uploadImageAndCreatePost(postFormValue: any, selectedImg?: File, existingImg?: { url: string, fileId: string }): Promise<Post> {
  return new Promise(async (resolve, reject) => {
    try {
      let imageUrl = '';
      let imageFileId = '';

      if (selectedImg) {
        // ✅ New image selected, upload to ImageKit

        // 1. Auth from backend
        const authRes = await fetch('https://imagekit-auth-server-0oml.onrender.com/auth');
        const { signature, expire, token } = await authRes.json();

        // 2. Upload image
        const formData = new FormData();
        formData.append('file', selectedImg);
        formData.append('fileName', selectedImg.name); // ❌ This was crashing when selectedImg was undefined
        formData.append('publicKey', 'public_j9Q5MuMYw5U55rrTDFU11ahhIk4=');
        formData.append('signature', signature);
        formData.append('expire', expire.toString());
        formData.append('token', token);

        const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
          method: 'POST',
          body: formData
        });

        const uploadResult = await uploadRes.json();
        imageUrl = uploadResult.url;
        imageFileId = uploadResult.fileId;
      } else if (existingImg) {
        // ✅ No new image selected — use previous image from database
        imageUrl = existingImg.url;
        imageFileId = existingImg.fileId;
      }

      // Prepare category info
      const [categoryId, categoryName] = postFormValue.category.split('-');

      // ✅ Construct the Post object
      const postData: Post = {
        title: postFormValue.title,
        permalink: postFormValue.permalink,
        category: { categoryId, category: categoryName },
        postImgPath: imageUrl,
        imageFileId: imageFileId,
        excerpt: postFormValue.excerpt,
        content: postFormValue.content,
        isFeatured: false,
        views: 0,
        status: 'new',
        createdAt: new Date()
      };

      resolve(postData);
    } catch (error) {
      reject(error);
    }
  });
}

  async savePost(postData: Post): Promise<void> {
    try {
      const postsRef = collection(this.firestore, 'posts');
      await addDoc(postsRef, postData);
      this.toastr.success('Post created successfully');
    } catch (error) {
      this.toastr.error('Failed to create post. Please try again');
      throw error;
    }
    this.router.navigate(['/posts']);
  }

  loadData(): Observable<any[]> {
    const postsRef = collection(this.firestore, 'posts');
    const postsQuery = query(postsRef, orderBy('createdAt', 'desc'));
    return collectionData(postsQuery, { idField: 'id' });
  }

  loadOneData(id: string) {
    const docRef = doc(this.firestore, 'posts', id);
    return docData(docRef, { idField: 'id' });
  }



  async updatePostData(id: string, postData: Post): Promise<void> {
    const docRef = doc(this.firestore, 'posts', id);

    try {
      await updateDoc(docRef, { ...postData }); // Spread to convert class instance to plain object
      this.toastr.success('Post Updated Successfully');
      this.router.navigate(['/posts']);
    } catch (error) {
      // console.error('Error updating post:', error);
      this.toastr.error('Failed to update post. Please try again.');
      throw error;
    }
  }


  // async deletePostData(id: string){
  //     const docRef = doc(this.firestore, 'posts', id);
  //     await deleteDoc(docRef);
  //     this.toastr.warning('Post Deleted Successfully');
  //   }


  async deletePostData(id: string, imageFileId?: string): Promise<void> {
    try {
      // 1. Delete image from ImageKit
      if (imageFileId) {
        await fetch('https://imagekit-auth-server-0oml.onrender.com/delete-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fileId: imageFileId })
        });
      }

      // 2. Delete Firestore post
      const docRef = doc(this.firestore, 'posts', id);
      await deleteDoc(docRef);
      this.toastr.warning('Post deleted successfully');

    } catch (error) {
      this.toastr.error('Failed to delete post');
      console.error(error);
    }
  }

  async markFeatured(id: string, isFeatured: boolean): Promise<void> {
    const docRef = doc(this.firestore, 'posts', id);
    try {
      await updateDoc(docRef, { isFeatured });
      this.toastr.info('Featured Status Updated')
    }
    catch (error) {
      this.toastr.error('Failed to update Featured Status.');
    }
  }


}



