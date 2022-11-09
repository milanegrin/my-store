import {Component, Input, Output, EventEmitter, OnInit, OnChanges,AfterViewInit, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.scss']
})

export class ImgComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @Input()img: string = '';
  @Output() loaded = new EventEmitter<string>();
  imageDefault = './assets/images/noencontrado.jpg';
  counter = 0;
  counterFn: number | undefined;
  constructor() {
    //before render
    //No async-- once time
    console.log('constructor','imgValue =>', this.img);
  }

  ngOnChanges(){
    //before render
    ///changes inputs -- times
    console.log('ngOnChanges', 'imgValue =>', this.img);
  }

  ngOnInit(){
    this.counterFn = 0;
    //before render
    //async - fetch --once time
  /*  console.log('ngOnInit', 'imgValue =>', this.img);
    this.counterFn = window.setInterval(() =>{
      this.counter += 1;
        console.log('run counter');
      }, 1000)*/
  }
 ngAfterViewInit(){
    //after render
   //handler children
   console.log('ngAfterViewInit');

 }
 ngOnDestroy() {
    //delete
  /* console.log(this.counterFn);
   console.log('ngOnDestroy');
   window.clearInterval(this.counterFn);*/
 }

  imgError(){
    this.img = this.imageDefault;
    console.log("img default");
  }

  imgLoaded(){
   // console.log('log hijo')
    this.loaded.emit(this.img);
  }

}
