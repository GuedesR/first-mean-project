import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostService } from "../post.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{
  postList: Post[] = [];
  isLoading = false;
  private postSubscriber = new Subscription();

  constructor(public postService: PostService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPostList();
    this.postSubscriber = this.postService.getPostListSubject()
      .subscribe( (postList: Post[]) => {
        this.isLoading = false;
        this.postList = postList
      })
  }

  ngOnDestroy(): void {
    this.postSubscriber.unsubscribe()
  }

  onDelete(postId: string): void {
    this.postService.deletePost(postId)
  }
}
