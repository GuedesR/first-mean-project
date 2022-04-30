import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private postList: Post[] = [];
  private postListSubject = new Subject<Post[]>();

  constructor(private httpClient: HttpClient, private router: Router) {}

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

  getPost(id: string) {
    return this.httpClient.get<{_id: string, title: string, content: string}>
      ('http://localhost:3000/api/postList/' + id)
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
        this.router.navigate(["/"]);
      });
  }

  updatePost(post: Post) {
    this.httpClient.put('http://localhost:3000/api/postList/' + post.id, post)
      .subscribe(
        response => {
          const updatedPostList = [...this.postList];
          const olPostIndex = updatedPostList.findIndex( p => p.id === post.id );
          updatedPostList[olPostIndex] = post;
          this.postList = updatedPostList;
          this.postListSubject.next([...this.postList]);
          this.router.navigate(["/"]);
        })
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
