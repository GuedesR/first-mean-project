import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

import { Post } from "../post.model";
import { PostService } from "../post.service";

@Component({
  selector: 'app-post-Component',
  templateUrl: './post-create.component.html',
  styleUrls:['./post-create.component.css']
})

export class PostCreateComponent {

  constructor(public postService: PostService) {}

  submitNewPost(form: NgForm) {
    if (form.invalid) {
      return
    }

    const emittedPost: Post = {
      title: form.value.title,
      content: form.value.content
    }

    this.postService.addPost(emittedPost);
    form.resetForm();
  }
}
