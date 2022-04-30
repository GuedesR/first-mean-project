import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { Post } from "../post.model";
import { PostService } from "../post.service";

@Component({
  selector: 'app-post-Component',
  templateUrl: './post-create.component.html',
  styleUrls:['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {

  post: Post = {id: '', title: '', content: ''};
  isLoading= false;
  private mode = 'create';
  private postId: string = '';

  constructor(public postService: PostService, public route: ActivatedRoute) {}


  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          this.post = {id: postData._id, title: postData.title, content: postData.content}
          this.isLoading = false;
        });
      } else {
        this.mode = 'create',
        this.postId = ''
      }
    })
  }

  submitNewPost(form: NgForm) {
    if (form.invalid) {
      return
    }

    this.isLoading = true;

    const emittedPost: Post = {
      id: this.postId,
      title: form.value.title,
      content: form.value.content
    }

    if (this.mode === 'create') {
      this.postService.addPost(emittedPost);
    } else {
      this.postService.updatePost(emittedPost)
    }

    form.resetForm();
  }
}
