import { Component } from "@angular/core";

@Component({
  selector: 'app-post-Component',
  templateUrl: './post-create.component.html'
})
export class PostCreateComponent {
  inputValue= "";
  newPost = "NO CONTENT"

  onAddPost() {
    this.newPost = this.inputValue
  }
}
