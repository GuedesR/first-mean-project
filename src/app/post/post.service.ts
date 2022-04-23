import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private postList: Post[] = [];
  private postListSubject = new Subject<Post[]>();

  getPostList() {
    return [...this.postList];
  }

  getPostListSubject() {
    return this.postListSubject.asObservable()
  }

  addPost(post: Post) {
    this.postList.push(post);
    return this.postListSubject.next(this.postList);
  }
}
