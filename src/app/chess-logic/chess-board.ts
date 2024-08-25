import { Color, FENChar } from "./models";
import { Piece } from "./pieces/piece";
import { Rook } from "./pieces/rook";
import { Knight } from "./pieces/knight";
import { Bishop } from "./pieces/bishop";
import { Queen } from "./pieces/queen";
import { King } from "./pieces/king";
import { Pawn } from "./pieces/pawn";

export class ChessBoard {
    // Pieces and null: representing empty squares
    private chessBoard: (Piece | null)[][];
    private _playerColor = Color.White;

    constructor() {
        // Implementing the chessBOard properties in the constructor
        this.chessBoard = [
            // White Pieces
            [new Rook(Color.White), new Knight(Color.White), new Bishop(Color.White), new Queen(Color.White), new King(Color.White), new Bishop(Color.White), new Knight(Color.White), new Rook(Color.White)
            ],
            [
                new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White)
            ],
            // Now we set up 4 empty rows
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            // Pink Pieces
            [
                new Pawn(Color.Pink), new Pawn(Color.Pink), new Pawn(Color.Pink), new Pawn(Color.Pink), new Pawn(Color.Pink), new Pawn(Color.Pink), new Pawn(Color.Pink), new Pawn(Color.Pink)
            ],
            [new Rook(Color.Pink), new Knight(Color.Pink), new Bishop(Color.Pink), new Queen(Color.Pink), new King(Color.Pink), new Bishop(Color.Pink), new Knight(Color.Pink), new Rook(Color.Pink)
            ]
        ];
    }
    // Defining the getter for the player Color (global scope)
    public get playerColor(): Color {
        return this._playerColor;
    }
    // Defining the public getter for the chessBoard View to bring in the board
    public get chessBoardView(): (FENChar | null)[][] {
        return this.chessBoard.map(row => {
            // Checking for if each square contains a piece or is just a null empty square
            // This either returns the piece on square or null
            return row.map(piece => piece instanceof Piece ? piece.FENChar : null);
        })
    }
    
    // The return type of this method should be a boolean
    public static isSquareDark(x: number, y: number): boolean {
        // Returning odd or even
        return x % 2 === 0 && y % 2 === 0 || x % 2 === 1 && y % 2 === 1;
    }
}