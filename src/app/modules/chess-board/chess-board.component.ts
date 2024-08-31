import { Component } from '@angular/core';
import { ChessBoard } from '../../chess-logic/chess-board';
import { CheckState, Color, Coords, FENChar, LastMove, pieceImagePaths, SafeSquares } from '../../chess-logic/models';
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
  public get gameOverMessage(): String | undefined {return this.chessBoard.gameOverMessage;};

  private selectedSquare: SelectedSquare = { piece: null }; // initially empty
  private pieceSafeSquares: Coords[] = []; // initially empty
  private lastMove: LastMove | undefined = this.chessBoard.lastMove;
  private checkState: CheckState = this.chessBoard.checkState;

  // Properties for pawn promotion
  public isPromotionActive: boolean = false; // Open promotion dialogue
  private promotionCoords: Coords | null = null;
  private promotedPiece: FENChar | null = null;
  public promotionPieces(): FENChar[] { // An array of FENCharacters in which we can promote our player's pawn
    return this.playerColor === Color.White ? [FENChar.WhiteKnight, FENChar.WhiteBishop, FENChar.WhiteRook, FENChar.WhiteQueen] : [FENChar.PinkKnight, FENChar.PinkBishop, FENChar.PinkRook, FENChar.PinkQueen];
  };

  public isSquareDark(x: number, y: number): boolean {
    return ChessBoard.isSquareDark(x, y);
  }

  public flipMode: boolean = false;

  public flipBoard(): void{
    this.flipMode = !this.flipMode;
  };

  // Applying special CSS classes
  public isSquareSelected(x: number, y: number): boolean {
    if (!this.selectedSquare.piece) return false;
    return this.selectedSquare.x === x && this.selectedSquare.y === y; // We are checking if the x and y properties from the selected square match in properties
  }

  public isSquareSafeForSelectedPiece(x: number, y: number): boolean {
    return this.pieceSafeSquares.some(coords => coords.x === x && coords.y === y); // Check if contains matching properties
  }

  public isSquareLastMove(x: number, y: number): boolean {
    if (!this.lastMove) return false;
    const { prevX, prevY, currX, currY } = this.lastMove;
    return x === prevX && y === prevY || x === currX && y === currY;
  }

  public isSquareChecked(x: number, y: number): boolean {
    return this.checkState.isInCheck && this.checkState.x === x && this.checkState.y === y;
  }

  public isSquarePromotionSquare(x: number, y: number): boolean {
    if(!this.promotionCoords) return false;
    return this.promotionCoords.x === x && this.promotionCoords.y === y;
  }

  // Creating unmarking method, which we must use in the placingPiece function
  private unmarkingPreviouslySelectedAndSafeSquares(): void {
    this.selectedSquare = { piece: null }; // We set that no piece is selected
    this.pieceSafeSquares = []; // We empty this safe squares array again to unmark

    if (this.isPromotionActive) {
      this.isPromotionActive = false;
      this.promotedPiece = null;
      this.promotionCoords = null;
    }
  }

  public selectingPiece(x: number, y: number): void { // return type is void
    if(this.gameOverMessage !== undefined) return; // If the game is finished and there are no more legal moves that can be played, we disable selectingPiece() function and return from the function.
    const piece: FENChar | null = this.chessBoardView[x][y];
    if (!piece) return; // if the square is empty, return from the function
    if (this.isWrongPieceSelected(piece)) return;

    const isSameSquareClicked: boolean = !!this.selectedSquare.piece && this.selectedSquare.x === x && this.selectedSquare.y === y;
    this.unmarkingPreviouslySelectedAndSafeSquares();
    if (isSameSquareClicked) return;

    // Then we must update the private properties of the selected squares and piece safe squares
    this.selectedSquare = { piece, x, y };
    this.pieceSafeSquares = this.safeSquares.get(x + "," + y) || [];
  }

  // Implementing the placingPiece method
  private placingPiece(newX: number, newY: number): void {
    if (!this.selectedSquare.piece) return; // Checking if the piece is actually selected
    if (!this.isSquareSafeForSelectedPiece(newX, newY)) return; // Checking if the new coordinates are safe for the selected piece

    // Promotion of Pawn is handled here
    const isPawnSelected: boolean = this.selectedSquare.piece === FENChar.WhitePawn || this.selectedSquare.piece === FENChar.PinkPawn;
    const isPawnOnlastRank: boolean = isPawnSelected && (newX === 7 || newX === 0); // Pawn is on last rank
    const shouldOpenPromotionDialog: boolean = !this.isPromotionActive && isPawnOnlastRank;

    if (shouldOpenPromotionDialog) {
      this.pieceSafeSquares = [];
      this.isPromotionActive = true;
      this.promotionCoords = { x: newX, y: newY }; // Since Promotion is happening, we must update the coordinates
      return; // We must wait for the player to choose the pawn to promote
    }

    // Destructuring the properties of the selected square
    const { x: prevX, y: prevY } = this.selectedSquare;

    // Calling the board updating method
    this.updateBoard(prevX, prevY, newX, newY, this.promotedPiece);
  }

  private updateBoard(prevX: number, prevY: number, newX: number, newY: number, promotedPiece: FENChar | null): void {
    this.chessBoard.move(prevX, prevY, newX, newY, this.promotedPiece); // Calling the move function
    // Then update the chessboard view
    this.chessBoardView = this.chessBoard.chessBoardView;
    this.checkState = this.chessBoard.checkState;
    this.lastMove = this.chessBoard.lastMove;
    this.unmarkingPreviouslySelectedAndSafeSquares(); // Removing the previous "safe squares" marks after placing into current position
  }

  // Implementing piece promotion
  public promotePiece(piece: FENChar): void {
    if (!this.promotionCoords || !this.selectedSquare.piece) return;
    this.promotedPiece = piece;
    const { x: newX, y: newY } = this.promotionCoords;
    const { x: prevX, y: prevY } = this.selectedSquare;
    this.updateBoard(prevX, prevY, newX, newY, this.promotedPiece);
  }

  public closePawnPromotionDialog(): void {
    this.unmarkingPreviouslySelectedAndSafeSquares();
  }

  // Creating public move method
  public move(x: number, y: number): void {
    this.selectingPiece(x, y);
    this.placingPiece(x, y);
  }

  private isWrongPieceSelected(piece: FENChar): boolean {
    const isWhitePieceSelected: boolean = piece === piece.toUpperCase();
    return isWhitePieceSelected && this.playerColor === Color.Pink || !isWhitePieceSelected && this.playerColor === Color.White;
  }
}
