import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {WebcamImage} from "ngx-webcam";


@Component({
  selector: 'app-uploadphoto',
  templateUrl: './upload-photo.component.html',
  // styleUrls: ['./upload-photo.component.css']
})
export class UploadPhotoComponent implements OnInit {
  url:string = '';
  showWebcam: boolean = false;
  public webcamImage: WebcamImage = null;
  private trigger: Subject<void> = new Subject<void>();

  constructor() { }
  ngOnInit() {}

  onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      }
    }
  }

  toggleWebcam() {
    this.showWebcam = !this.showWebcam
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public triggerSnapshot(): void {
    this.trigger.next();
    this.showWebcam = !this.showWebcam;
  }
  public handleImage(webcamImage: WebcamImage): void {
    this.url = webcamImage.imageAsDataUrl
  }
}
