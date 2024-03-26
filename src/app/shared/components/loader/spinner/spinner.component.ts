import {Component, Input} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {NgClass} from "@angular/common";

@Component({
  selector: 'loader-spinner',
  standalone: true,
  imports: [
    MatIconModule,
    NgClass
  ],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  @Input() size: "S" | "M" | "G" = "S"
  @Input() color: "primary" | "secondary" | "neutral" = "neutral"
}
