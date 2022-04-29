import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private postList: Post[] = [];
  private postListSubject = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) {}

  getPostList() {
    this.httpClient
      .get<{ message: string; postList: any[] }>(
        'http://localhost:3000/api/postList'
      )
      .pipe(map((postData)=> {
        return postData.postList.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          }
        })
      }))
      .subscribe((postData) => {
        this.postList = postData;
        this.postListSubject.next([...this.postList]);
      });
  }

  getPostListSubject() {
    return this.postListSubject.asObservable();
  }

  addPost(post: Post) {
    this.httpClient
      .post<{ message: String , postId: string}>('http://localhost:3000/api/postList', post)
      .subscribe((responseData) => {
        console.log(responseData);
        const postId = responseData.postId;
        post.id = postId;
        this.postList.push(post);
        this.postListSubject.next(this.postList);
      });
  }

  deletePost( postId: string) {
    this.httpClient
      .delete('http://localhost:3000/api/postList/' + postId)
      .subscribe(() => {
        const filteredPostList = this.postList.filter(post => post.id !== postId);
        this.postList = filteredPostList;
        this.postListSubject.next([...this.postList]);
        console.log(`Deleted ${postId}!`);
      })
  }
}
