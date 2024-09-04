import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StockfishService } from '../computer-mode/stockfish.service';
import { Color } from '../../chess-logic/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-play-against-computer-dialog',
  templateUrl: './play-against-computer-dialog.component.html',
  styleUrls: ['./play-against-computer-dialog.component.css'],
  standalone: true, // We are setting standalone to true
  imports: [MatDialogModule, MatButtonModule, CommonModule] // We also add these imports to the file
})

export class PlayAgainstComputerDialogComponent {
  // We export the stockfish strength
  public stockfishLevels: readonly number[] = [1, 2, 3, 4, 5];
  public stockfishLevel: number = 1; // By default, the initial setting is the easiest difficulty of 1


  // Injecting stockfish service through constructor, as well as injecting the dialog component and router
  constructor(
    private stockfishService: StockfishService,
    private dialog: MatDialog,
    private router: Router
  ) { };

  public selectStockfishLevel(level: number): void {
    this.stockfishLevel = level; // Updating the stockfishLevel property
  }

  public play(color: "w" | "b"): void {
    this.dialog.closeAll();
    this.stockfishService.computerConfiguration$.next({
      color: color === "w" ? Color.Pink : Color.White,
      // level: this.stockfishLevels[this.stockfishLevel] // Passing in the map and accessing the stockfishLevel from thereon
      level: this.stockfishLevel 
    });
    
    this.router.navigate(["against-computer"]); // Once play() function is clicked, navigate to computer-mode component
  }
 
  public closeDialog(): void {
    this.router.navigate(["against-friend"]);  // Navigate to play against friend component if this option is chosen
  }
}
