import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../post.model';
import { PostService } from '../post.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-Component',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})

export class PostCreateComponent implements OnInit {
  post: Post;
  isLoading = false;
  form: FormGroup;

  imageUrl: string;

  private mode = 'create';
  private postId: string = '';

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((postData) => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: null
          };
          this.isLoading = false;
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.postId = '';
      }
    });
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity;

    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = (reader.result as string)
    };
    reader.readAsDataURL(file)
  }

  submitNewPost() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    const emittedPost: Post = {
      id: this.postId,
      title: this.form.value.title,
      content: this.form.value.content,
      imagePath: this.form.value.image
    };

    if (this.mode === 'create') {
      this.postService.addPost(emittedPost, this.form.value.image);
    } else {
      this.postService.updatePost(emittedPost, this.form.value.image);
    }

    this.form.reset();
  }
}
