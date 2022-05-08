import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

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
      .pipe(
        map((postData) => {
          return postData.postList.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
            };
          });
        })
      )
      .subscribe((postData) => {
        this.postList = postData;
        this.postListSubject.next([...this.postList]);
      });
  }

  getPostListSubject() {
    return this.postListSubject.asObservable();
  }

  getPost(id: string) {
    return this.httpClient.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>('http://localhost:3000/api/postList/' + id);
  }

  addPost(post: Post, image: File) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image, post.title);
    this.httpClient
      .post<{ message: String; post: Post }>(
        'http://localhost:3000/api/postList',
        postData
      )
      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          title: responseData.post.title,
          content: responseData.post.content,
          imagePath: responseData.post.imagePath,
        };
        this.postList.push(post);
        this.postListSubject.next(this.postList);
        this.router.navigate(['/']);
      });
  }

  updatePost(post: Post, image: File | string) {
    let postData: Post | FormData;

    if (typeof image === "object") {
      postData = new FormData();
      postData.append('id', post.id)
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('image', image, post.title);
    } else {
      postData = {
        id: post.id,
        title: post.title,
        content: post.content,
        imagePath: image
      };
    }

    this.httpClient
      .put('http://localhost:3000/api/postList/' + post.id, postData)
      .subscribe((response) => {
        const updatedPostList = [...this.postList];
        const olPostIndex = updatedPostList.findIndex((p) => p.id === post.id);
        const newPost: Post = {
          id: post.id,
          title: post.title,
          content: post.content,
          imagePath: ""
        };
        updatedPostList[olPostIndex] = newPost;
        this.postList = updatedPostList;
        this.postListSubject.next([...this.postList]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.httpClient
      .delete('http://localhost:3000/api/postList/' + postId)
      .subscribe(() => {
        const filteredPostList = this.postList.filter(
          (post) => post.id !== postId
        );
        this.postList = filteredPostList;
        this.postListSubject.next([...this.postList]);
        console.log(`Deleted ${postId}!`);
      });
  }
}
