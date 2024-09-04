import { Component } from '@angular/core';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button"
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { PlayAgainstComputerDialogComponent } from '../play-against-computer-dialog/play-against-computer-dialog.component';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
  standalone: true, // Added this component to make this a standalone component
  imports: [MatToolbarModule, MatButtonModule, RouterModule, MatDialogModule]
})
export class NavMenuComponent { 
  // Injecting dialog into constructor
  constructor(private dialog: MatDialog){ }

  public playAgainstComputer(): void {
    this.dialog.open(PlayAgainstComputerDialogComponent)// Opening the injected dialog in this method
  }
    // Implementing the method that opens the dialog
}
