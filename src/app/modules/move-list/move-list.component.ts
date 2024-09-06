import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MoveList } from '../../chess-logic/models';

@Component({
  selector: 'app-move-list',
  templateUrl: './move-list.component.html',
  standalone: true,
  styleUrls: ['./move-list.component.css'],
  imports: [CommonModule, MatButtonModule, MatIconModule]
})
export class MoveListComponent {
  @Input({required: true}) public moveList! : MoveList;
  @Input({ required: true }) public gameHistoryPointer: number = 0;
  @Input({ required: true }) public gameHistoryLength: number = 1;

  // The event emitter emits a new value after clicking a certain move in move list component. This emitter triggers a function that will show previous position.
  @Output() public showPreviousPositionEvent = new EventEmitter<number>();

  // The method that shows the previous positions
  public showPreviousPosition(moveIndex: number): void {
    this.showPreviousPositionEvent.emit(moveIndex);
  }
}
