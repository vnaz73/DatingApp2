import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';


@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
@Input() photos: Photo[];
@Output() getMemberPhotoChange = new EventEmitter<string>();

uploader: FileUploader;
hasBaseDropZoneOver: boolean;
baseURL = environment.apiUrl;
response: string;
currentMainPhoto: Photo;

constructor(private authService: AuthService, private userService: UserService,
            private alertify: AlertifyService) {
  this.uploader = new FileUploader({
    url: this.baseURL + 'users/' + this.authService.decodedToken.nameid + '/photos',
    authToken: 'Bearer ' + localStorage.getItem('token'),
    isHTML5: true,
    allowedFileType: ['image'],
    removeAfterUpload: true,
    autoUpload: false,
    maxFileSize: 10 * 1024 * 1024,
    // disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
    // formatDataFunctionIsAsync: true,
    // formatDataFunction: async (item) => {
    //   return new Promise( (resolve, reject) => {
    //     resolve({
    //       name: item._file.name,
    //       length: item._file.size,
    //       contentType: item._file.type,
    //       date: new Date()
    //     });
    //   });
    // }
  });

  this.hasBaseDropZoneOver = false;

  this.response = '';
  this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false; };

  this.uploader.response.subscribe( res => this.response = res );

  this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id : res.id,
          desription: res.desription,
          dateAdded: res.dateAdded,
          isMain: res.isMain,
          url: res.url
        };
        this.photos.push(photo);
        if (photo.isMain) {
          this.authService.changeCurrentPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
        }
      }
  };
}



  ngOnInit() {
  }

  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe( () => {
      this.alertify.success('Susseccfully setting main photo');
      this.currentMainPhoto = this.photos.filter(p => p.isMain)[0];
      this.currentMainPhoto.isMain = false;
      photo.isMain = true;
      this.authService.changeCurrentPhoto(photo.url);
      this.authService.currentUser.photoUrl = photo.url;
      localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
      // this.getMemberPhotoChange.emit(photo.url);
    }, error => { this.alertify.error(error); } );
  }

  deletePhoto(id: number) {
    this.alertify.confirm('Are you sure?', () => {
      this.userService.deletePhoto(this.authService.decodedToken.nameid, id).subscribe( () => {
        this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
        this.alertify.success('Photo has been deleted');
      }, error => {
        this.alertify.error('Failed to delete photo');
      });
    });
  }


  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
}
