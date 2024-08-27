import { Component } from '@angular/core';
import { ChessBoard } from '../../chess-logic/chess-board';
import { Color, Coords, FENChar, pieceImagePaths, SafeSquares } from '../../chess-logic/models';
import { SelectedSquare } from './models';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})

export class ChessBoardComponent {
  public pieceImagePaths = pieceImagePaths;

  private chessBoard = new ChessBoard();
  public chessBoardView: (FENChar | null)[][] = this.chessBoard.chessBoardView;
  public get playerColor(): Color { return this.chessBoard.playerColor; };
  
  public get safeSquares(): SafeSquares { return this.chessBoard.safeSquares; };  // note that selectedSquare is imported from models.ts in the MODULES folder
  private selectedSquare: SelectedSquare = { piece: null }; // initially empty
  private pieceSafeSquares: Coords[] = []; // initially empty

  public isSquareDark(x: number, y: number): boolean {
    return ChessBoard.isSquareDark(x, y);
  }

  // Applying special CSS classes
  public isSquareSelected(x: number, y: number): boolean {
    if(!this.selectedSquare.piece) return false;
    return this.selectedSquare.x === x && this.selectedSquare.y === y; // We are checking if the x and y properties from the selected square match in properties
  }

  public isSquareSafeForSelectedPiece(x: number, y: number): boolean {
    return this.pieceSafeSquares.some(coords => coords.x === x && coords.y === y); // Check if contains matching properties
  }

  public selectingPiece(x: number, y: number): void { // return type is void
    const piece: FENChar | null = this.chessBoardView[x][y];
    if (!piece) return; // if the square is empty, return from the function
    if(this.isWrongPieceSelected(piece)) return;
    // Then we must update the private properties of the selected squares and piece safe squares
    this.selectedSquare = { piece, x, y };
    this.pieceSafeSquares = this.safeSquares.get(x + "," + y) || [];
  }

  private isWrongPieceSelected(piece: FENChar): boolean {
    const isWhitePieceSelected: boolean = piece === piece.toUpperCase();
    return isWhitePieceSelected && this.playerColor === Color.Pink || !isWhitePieceSelected && this.playerColor === Color.White;
  }
}
