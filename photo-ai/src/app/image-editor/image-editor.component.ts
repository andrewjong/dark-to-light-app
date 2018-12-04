import {Component, OnInit} from '@angular/core';
import 'fabric';
import 'jquery';
import {ConfirmationService} from 'primeng/api';
import * as JSZip from 'jszip';
import 'file-saver';
import { Canvas, Point } from 'fabric/fabric-impl';
declare const fabric: any;

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.css'],
  providers: [ConfirmationService]
})
export class ImageEditorComponent implements OnInit {
  canCrop: boolean;
  isOriginalOrientation: boolean;
  clipPath: any;
  canvas: any;
  mainImage:any;
  mainImageExists:boolean;
  canSave:boolean;
  isTuning:boolean;
  undoStack: Object[]=[];
  redoStack: Object[]=[];
  savedCoords: Point[]=[];
  savedBound: Object[]=[];
  left: number;
  top: number;
  width: number;
  height: number;

  constructor(private confirmationService: ConfirmationService){}

  /**
   * This will allow to instantiate the canvas and will apply zoom onto canvas.
   * Left means a certain amount of pixels from the left of the object or the canvas.
   * Top mean a certain amount of pixels form the top of the object or the canvas
   */
  ngOnInit() {
    this.canvas = new fabric.Canvas('image-view',{
      backgroundColor: 'rgb(0,0,0,.5)',
      selectionColor: 'grey',
      selectionLineWidth: 10
      });
    this.canSave = false;
    this.mainImageExists = false;
    this.canCrop = false;
    this.isOriginalOrientation = true;
    this.canvas.on('mouse:wheel', function(opt) {
        var delta = opt.e.deltaY;
        var pointer = this.getPointer(opt.e);
        var zoom = this.getZoom();
        zoom = zoom + delta/200;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        this.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });
    }
    
  /**
   * This will allow the person to upload the file after clicking the button to trigger 
   * the preview file 
   * @param event 
   */
  uploadFile(event:any): void {
    const uploadBtn = document.getElementById("upload");
    uploadBtn.click();
  }
  
  /**
   * This will allow the image to show on the canvas after uploading
   * @param event 
   */
  previewFile(event:any): void {
    let reader = new FileReader();
    const file: Blob = event.target.files[0];
    console.log(file.type);
    reader.readAsDataURL(file);

    //Need some sort of if-check here!
    if(file.type.includes('arw')) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to convert photo from dark to light?',
      accept: () => {
        //Actual logic to perform a confirmation
      },
    });
    }

    let ImageEditor = this;
    let canvasHere = this.canvas;
    let MainImageExist = this.mainImageExists;

    reader.onload = function (event: Event) {
      let imageElement = reader.result;
      let imgInstance = new fabric.Image.fromURL(imageElement, function(img) {
        let image = img.set({
            originX: "left",
            originY: "top",
            selectable: false
          });
          if(MainImageExist == false) {
            ImageEditor.setMainImage(image);
          }
          else {
            const clearBtn = document.getElementById("clear-btn");
            clearBtn.click();
            ImageEditor.setMainImage(image);
          }
          canvasHere.add(image);
          canvasHere.centerObject(image);
          image.setCoords();
          ImageEditor.saveOrientationCoords();
          canvasHere.renderAll();
          ImageEditor.canSave = true;
          ImageEditor.isOriginalOrientation = true
        })};
    this.mainImageExists = true;
    event.target.value="";
  }


  /**
   * This will save the bounding rectangle coordinates, original and rotated
   */
  saveOrientationCoords(): void {
    this.savedCoords["original"]= new fabric.Point(this.mainImage.left,this.mainImage.top);
    this.savedBound["original"] = this.mainImage.aCoords;
    this.mainImage.rotate(-90);
    this.mainImage.setCoords();
    this.savedCoords["rotated"]= new fabric.Point(this.mainImage.left,(this.mainImage.top-this.mainImage.width));
    this.savedBound["rotated"] = {tl: this.mainImage.aCoords.tr,tr: this.mainImage.aCoords.br, br: this.mainImage.aCoords.bl, bl: this.mainImage.aCoords.tl};
    this.mainImage.rotate(0);
    this.mainImage.setCoords();
  }
  
  /**
   * This will set the main image to be edited on
   * @param image 
   */
  setMainImage(image): boolean {
    this.mainImage = image;
    return true;
  }
  /**
   * This will push into either the undo or redo stack.
   * @param stack 
   */
  pushIntoStack(stack:Object[]) : void{
    let data = this.canvas.toJSON();
    if(stack.push(data) > 3)
      stack.shift();
  }
  
  /**
   * This will allow the user to undo changes up until 3 times.
   * @param event 
   */
  undo(event:any): void {
    if(this.mainImageExists == false)
      return;
    let ImageEditor = this;
    if(this.undoStack.length > 0){
      this.pushIntoStack(this.redoStack);
      let oldState = this.undoStack.pop();
      this.canvas.loadFromJSON(oldState, this.canvas.renderAll.bind(this.canvas), function(o,object){
        ImageEditor.setMainImage(object);
      });
    }
  }

  /**
   * This will allow the user to redo changes up until 3 times.
   * @param event 
   */
  redo(event:any): void {
    if(this.mainImageExists == false)
      return;
    let ImageEditor = this;
    if(this.redoStack.length > 0){
      this.pushIntoStack(this.undoStack);
      let oldState = this.redoStack.pop();
      this.canvas.loadFromJSON(oldState, this.canvas.renderAll.bind(this.canvas), function(o,object){
        ImageEditor.setMainImage(object);
      });
    }
  }

  //
  //
  // /**
  //  * This will save the image from the canvas
  //  * @param event 
  //  */
  // saveFile(event:any): void {
  //   this.canvas.setViewportTransform([1,0,0,1,0,0]);
  //   if(this.canSave){
  //       let dataUrl = this.canvas.toDataURL({
  //         format:'png',
  //         left:this.mainImage.left,
  //         top:this.mainImage.top,
  //         width:this.mainImage.width,
  //         height:this.mainImage.height,
  //       });
  //       const dlBtn = document.getElementById("save");
  //       dlBtn.setAttribute("href",dataUrl);
  //
  //   }
  // }
  

  /**
   * This will show the applyable crop area
   * @param event 
   */
  showCropArea(event) : void {
    if(this.mainImageExists == false)
      return;
    this.canCrop = true;
    let topBorder :number;
    let leftBorder :number;
    let rightBorder :number;
    let bottomBorder :number;
    if(!this.isOriginalOrientation){
      this.left = this.savedCoords["rotated"].x;
      this.top = this.savedCoords["rotated"].y;
      this.width = this.mainImage.height;
      this.height = this.mainImage.width;
      topBorder = this.savedBound["rotated"].tl.y;
      leftBorder = this.savedBound["rotated"].tl.x;
      rightBorder = this.savedBound["rotated"].tr.x;
      bottomBorder = this.savedBound["rotated"].br.y;
    } else {
      this.left = this.savedCoords["original"].x;
      this.top = this.savedCoords["original"].y;
      this.width = this.mainImage.width;
      this.height = this.mainImage.height;
      topBorder = this.savedBound["original"].tl.y;
      leftBorder = this.savedBound["original"].tl.x;
      rightBorder = this.savedBound["original"].tr.x;
      bottomBorder = this.savedBound["original"].br.y;
    }
    let clippath = new fabric.Rect({
      width:this.width,
      height:this.height,
      opacity: 0,
      originX: "left",
      originY: "top",
      left:this.left,
      top:this.top,
      lockRotation: true
    });
    clippath.on('moved', function(){
      if(this.aCoords.tl.y < topBorder)
        this.top = topBorder;
      if(this.aCoords.bl.y > bottomBorder)
        this.top = bottomBorder-(this.height*this.scaleY);
      if(this.aCoords.tr.x > rightBorder)
        this.left = rightBorder-(this.width*this.scaleX);
      if(this.aCoords.tl.x < leftBorder)
        this.left = leftBorder;
    });
    let canvasHere = this.canvas;
    canvasHere.add(clippath);
    canvasHere.centerObject(clippath);
    canvasHere.setActiveObject(clippath);
    clippath.setCoords();
    canvasHere.renderAll();
    this.clipPath = clippath;
  }
  

  /**
   * This will allow the user to remove the crop area
   * @param event 
   */
  removeCropArea(event) : void {
    this.canvas.remove(this.clipPath);
    this.clipPath = null;
    this.canCrop = false;
    this.canvas.renderAll();
  }
  
  /**
   * This will apply the crop form the cropArea
   * This origin for the cropping is based on the center of the main image.
   * Rendering is not enough to reveal the image. You must set the image cache to be true
   * so it can be rerendered.
   * @param event 
   */
  crop(event) : void {
    // Crop is pushed onto undoStack and resets redoStack
    this.pushIntoStack(this.undoStack); 
    this.redoStack = [];
    this.canvas.setViewportTransform([1,0,0,1,0,0]);
    let ImageEditor = this;
    //If the user rescales, then the cropping will follow the rescaling
    let cropWidth = this.clipPath.width*this.clipPath.scaleX; 
    let cropHeight = this.clipPath.height*this.clipPath.scaleY;
    
    let dataUrl = this.canvas.toDataURL({
      format:'png',
      left:this.clipPath.left,
      top:this.clipPath.top,
      width:cropWidth,
      height:cropHeight
    });
    //This is clipping where the origin is the center of the main image!
    let imgInstance = new fabric.Image.fromURL(dataUrl,function(img){
      let image = img.set({
        originX:"left",
        originY:"top",
        selectable:false
      });
      ImageEditor.canvas.remove(ImageEditor.mainImage);
      ImageEditor.setMainImage(image);
      ImageEditor.isOriginalOrientation = true;
      ImageEditor.canvas.add(image);
      ImageEditor.canvas.centerObject(image);
      ImageEditor.saveOrientationCoords();
      image.setCoords();
    });
    this.canvas.remove(this.clipPath);
    this.canvas.renderAll();
    this.canCrop = false;
  }
  
  /**
   * This will allow the image to rotate
   * @param number 
   */
  rotate(number: number) : void {
    if(this.mainImageExists == false)
      return;
    // Adds the previous rotation state into undo stack
    this.pushIntoStack(this.undoStack);
    this.redoStack = [];
    let currentAngle = this.mainImage.angle;
    this.mainImage.rotate((currentAngle + number) % 360);
    this.mainImage.setCoords(); 
    if(Math.abs(this.mainImage.angle) == 0 || Math.abs(this.mainImage.angle) == 180)
      this.isOriginalOrientation = true;
    else this.isOriginalOrientation = false; 
    this.canvas.renderAll();
  }
  
  /**
   * This removes the image and will clear all information from the canvas
   * @param event 
   */
  clear(event:any) :void {
    if(this.mainImageExists == false)
      return;
    let active = this.canvas.getActiveObject();
    let canvasObjects = this.canvas.getObjects();
    let length=canvasObjects.length;
    for (let i= 0; i< length; i++) {
      this.canvas.remove(canvasObjects[i]);
    } 
    this.resetAllValues();
    this.canvas.renderAll();
  }
  
  /**
   * This returns all instance variables back to default values
   */
  resetAllValues(): void {
    this.canCrop = false;
    this.undoStack=[];
    this.redoStack=[];
    this.mainImage = null;
    this.mainImageExists = false;
    this.canSave = false;
    this.isOriginalOrientation = true;
    this.clipPath = null;
    this.savedCoords = [];
    this.savedBound = [];
    this.left=null;
    this.top=null;
    this.width = null;
    this.height = null;
    this.canvas.setViewportTransform([1,0,0,1,0,0]);
  }

  /**
   * This will save the image from the canvas
   * @param event 
   */
  saveFile(event:any): void {
    if(this.mainImageExists == false)
      return;
    if(this.canSave){
      this.canvas.setViewportTransform([1,0,0,1,0,0]); 
      if(!this.isOriginalOrientation){
        this.left = this.savedCoords["rotated"].x;
        this.top = this.savedCoords["rotated"].y;
        this.width = this.mainImage.height;
        this.height = this.mainImage.width;
      } else {
        this.left = this.savedCoords["original"].x;
        this.top = this.savedCoords["original"].y;
        this.width = this.mainImage.width;
        this.height = this.mainImage.height;
      }
      let dataUrl = this.canvas.toDataURL({
        format:'png',
        left:this.left,
        top:this.top,
        width:this.width,
        height:this.height
      });

      let imageData = dataUrl.split(',')[1];
      let zip = new JSZip();
      zip.file("download.png",imageData,{base64:true});
      zip.generateAsync({type:"blob"}).then(function(content){
        saveAs(content,"image.zip");
      });
    }
  }
  
}
