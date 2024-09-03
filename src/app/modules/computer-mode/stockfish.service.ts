import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChessMove, ComputerConfiguration, StockfishQueryParams, StockfishResponse } from './models';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { Color, FENChar } from '../../chess-logic/models';

@Injectable({
  providedIn: 'root'
})
export class StockfishService {
  private readonly api: string = "https://stockfish.online/api/s/v2.php";
  
  // Map for ComputerConfigurations exported from models.ts: here, we set the default computer color and level
  public computerConfiguration$ = new BehaviorSubject<ComputerConfiguration>({color: Color.Pink, level: 1});
  
  constructor(private http: HttpClient) { }

  private convertColumnLetterToYCoord(string: string): number {
    return string.charCodeAt(0) - "a".charCodeAt(0);
  }

    // Recalling that some of the available "best moves" provided with Stockfish API can actually be 5 letters
  private promotedPiece(piece: string | undefined): FENChar | null {
    if(!piece) return null;
    
    const computerColor = this.computerConfiguration$.value.color;
    // Accounting for if the computer is playing with White pieces
    if(piece === "n") return computerColor === Color.White ? FENChar.WhiteKnight : FENChar.PinkKnight;
    if(piece === "b") return computerColor === Color.White ? FENChar.WhiteBishop : FENChar.PinkBishop;
    if(piece === "r") return computerColor === Color.White ? FENChar.WhiteRook : FENChar.PinkRook;
    return computerColor === Color.White ? FENChar.WhiteQueen : FENChar.PinkQueen;
  }


  private moveFromStockfishString (move: string): ChessMove {
    const prevY: number = this.convertColumnLetterToYCoord(move[0]); // We implement this method privately above
    const prevX: number = Number(move[1]) - 1; // Is the 2nd character in the move string, minus 1
    const newY: number = this.convertColumnLetterToYCoord(move[2]);
    const newX: number = Number(move[3]) - 1;
    const promotedPiece = this.promotedPiece(move[4]); // For the last letter of the Stockfish string
    return {prevX, prevY, newX, newY, promotedPiece}; // Return the chess move type
  }

  // Implement the method to get the best moves from the API
  // Notice the brackets<>. This denotes a custom type we define here. We import from computer-mode/models.ts.
  public getBestMove(fen: string): Observable<ChessMove> {
    const queryParams: StockfishQueryParams = {
      fen,
      depth: this.computerConfiguration$.value.level,
      mode: "bestMove"
    };
    // Creating the HttpParams Object
    let params = new HttpParams().appendAll(queryParams)
    return this.http.get<StockfishResponse>(this.api, { params })
      .pipe(
        switchMap(response => {
          const bestMove = response.data.split(" ")[1];
          return of(this.moveFromStockfishString(bestMove));
        }) // switchMap operator to create new observable from the response
      )
  }
}
