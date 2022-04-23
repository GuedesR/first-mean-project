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
  private postSubscriber = new Subscription();

  constructor(public postService: PostService) {}

  ngOnInit(): void {
    this.postList = this.postService.getPostList();
    this.postSubscriber = this.postService.getPostListSubject()
      .subscribe((postList: Post[]) => {
        this.postList = postList
      })
  }

  ngOnDestroy(): void {
    this.postSubscriber.unsubscribe()
  }
}
