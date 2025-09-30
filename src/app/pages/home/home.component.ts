import { Component } from '@angular/core';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {

  
}
