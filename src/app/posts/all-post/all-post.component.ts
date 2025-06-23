import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-post',
  imports: [RouterModule, CommonModule],
  templateUrl: './all-post.component.html',
  styleUrl: './all-post.component.css'
})
export class AllPostComponent implements OnInit {
  postData: any[] = [];

  private postService = inject(PostsService);

  ngOnInit() {
    this.postService.loadData().subscribe(data => {
      // console.log(data);
      this.postData = data;
    })
  }

  async onDelete(post: any) {
    await this.postService.deletePostData(post.id, post.imageFileId);
  }

  // async onDelete(postId: string) {
  //   await this.postService.deletePostData(postId);
  // }


  async onFeatured(id: string, status: boolean) {
    await this.postService.markFeatured(id, status);
  }




}
