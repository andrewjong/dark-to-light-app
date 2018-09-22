import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-uploadphoto',
  templateUrl: './upload-photo.component.html',
  // styleUrls: ['./upload-photo.component.css']
})
export class UploadPhotoComponent implements OnInit {
  url:string = '';

  constructor() { }

  ngOnInit() {
  }

  onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      }
    }
  }
}
