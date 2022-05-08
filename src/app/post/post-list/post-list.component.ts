import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostService } from "../post.service";

@Component({
	selector: "app-post-list",
	templateUrl: "./post-list.component.html",
	styleUrls: ["./post-list.component.css"],
})
export class PostListComponent implements OnInit, OnDestroy {
	postList: Post[] = [];
	isLoading = false;

	totalPosts = 0;
	postsPerPage = 2;
	currPage = 1;
	pageSizeOptions = [1, 2, 5, 10];

	private postSubscriber = new Subscription();

	constructor(public postService: PostService) {}

	ngOnInit(): void {
		this.isLoading = true;
		this.postService.getPostList(this.postsPerPage, this.currPage);
		this.postSubscriber = this.postService
			.getPostListSubject()
			.subscribe((postData: { postList: Post[]; postCount: number }) => {
				this.isLoading = false;
				this.totalPosts = postData.postCount;
				this.postList = postData.postList;
			});
	}

	onChangedPage(pageData: PageEvent): void {
		this.currPage = pageData.pageIndex + 1; //+1 due to the fact that pageData index starts a 0, but server list starts at 1
		this.postsPerPage = pageData.pageSize;
		this.postService.getPostList(this.postsPerPage, this.currPage);
	}

	ngOnDestroy(): void {
		this.postSubscriber.unsubscribe();
	}

	onDelete(postId: string) {
		this.postService.deletePost(postId).subscribe(() => {
			this.postService.getPostList(this.postsPerPage, this.currPage);
		});
	}
}
