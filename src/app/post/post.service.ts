import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostService {
	private postList: Post[] = [];
	private postListSubject = new Subject<{
		postList: Post[];
		postCount: number;
	}>();

	constructor(private httpClient: HttpClient, private router: Router) {}

	getPostListSubject() {
		return this.postListSubject.asObservable();
	}

	getPostList(postsPerPage: number, currPage: number) {
		const queryParams = `?pageSize=${postsPerPage}&page=${currPage}`;
		this.httpClient
			.get<{ message: string; postList: any; maxPosts: number }>(
				"http://localhost:3000/api/postList" + queryParams
			)
			.pipe(
				map(postData => {
					return {
						postList: postData.postList.map((post) => {
							return {
								title: post.title,
								content: post.content,
								id: post._id,
								imagePath: post.imagePath,
							};
						}),
						maxPosts: postData.maxPosts,
					};
				})
			)
			.subscribe((tranformedPostData) => {
				this.postList = tranformedPostData.postList;
				this.postListSubject.next({
					postList: [...this.postList],
					postCount: tranformedPostData.maxPosts,
				});
			});
	}

	getPost(id: string) {
		return this.httpClient.get<{
			_id: string;
			title: string;
			content: string;
			imagePath: string;
		}>("http://localhost:3000/api/postList/" + id);
	}

	addPost(post: Post, image: File) {
		const postData = new FormData();
		postData.append("title", post.title);
		postData.append("content", post.content);
		postData.append("image", image, post.title);
		this.httpClient
			.post<{ message: String; post: Post }>(
				"http://localhost:3000/api/postList",
				postData
			)
			.subscribe((responseData) => {
				this.router.navigate(["/"]);
			});
	}

	updatePost(post: Post, image: File | string) {
		let postData: Post | FormData;

		if (typeof image === "object") {
			postData = new FormData();
			postData.append("id", post.id);
			postData.append("title", post.title);
			postData.append("content", post.content);
			postData.append("image", image, post.title);
		} else {
			postData = {
				id: post.id,
				title: post.title,
				content: post.content,
				imagePath: image,
			};
		}

		this.httpClient
			.put("http://localhost:3000/api/postList/" + post.id, postData)
			.subscribe((response) => {
				this.router.navigate(["/"]);
			});
	}

	deletePost(postId: string) {
		return this.httpClient.delete("http://localhost:3000/api/postList/" + postId);
	}
}
