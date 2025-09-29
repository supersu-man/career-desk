import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    imports: [],
    templateUrl: './home.component.html',
    styles: ``
})
export class HomeComponent implements OnInit {

  constructor() {
    this.getHello()
  }

  ngOnInit(): void {
    
  }

  async getHello() {
    //Acessing ipcRenderer.invoke apis from preload
    const data = await (window as any).api.sayHello("World!!")
    
  }
}
