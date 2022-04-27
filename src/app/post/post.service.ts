import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private postList: Post[] = [];
  private postListSubject = new Subject<Post[]>();

  constructor (private httpClient: HttpClient) {};

  getPostList() {
    this.httpClient.get<{message: string, postList: Post[]}>('http://localhost:3000/api/postList')
      .subscribe( (postData) => {
        this.postList = postData.postList;
        this.postListSubject.next([...this.postList]);
      })
  }

  getPostListSubject() {
    return this.postListSubject.asObservable()
  }

  addPost(post: Post) {
    this.httpClient.post<{message: String}>( 'http://localhost:3000/api/postList', post)
      .subscribe( (responseData) => {
        console.log(responseData.message);
        this.postList.push(post);
        return this.postListSubject.next(this.postList);
      })

  }
}
