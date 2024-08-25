// declare bishop class that extends base piece class
import { Coords, FENChar, Color } from "../models";
import { Piece } from "./piece";
export class Knight extends Piece {
    protected override _FENChar: FENChar;
    // Recall that knight can move in an "L" shape 360 degrees across chess spaces
    protected override _directions: Coords[] = [
        { x: 1, y: 2 },
        { x: 1, y: -2 },
        { x: -2, y: -1 },
        { x: -2, y: 1 },
        { x: -1, y: -2 },
        { x: -1, y: 2 },
        { x: 2, y: -1 },
        { x: 2, y: 1 }
    ];
    constructor(private pieceColor: Color) {
        super(pieceColor); // calling the super constructor
        // implementing the FEN character property that depends on the piece color
        this._FENChar = pieceColor === Color.White ? FENChar.WhiteKnight : FENChar.PinkKnight;
    }
}