// declare bishop class that extends base piece class
import { Coords, FENChar, Color } from "../models";
import { Piece } from "./piece";
export class Bishop extends Piece {
    protected override _FENChar: FENChar;
    // Recall that bishop pieces can only move one space diagonally. Movement options are delineated below.
    protected override _directions: Coords[] = [
        { x: 1, y: 1 },
        { x: 1, y: -1 },
        { x: -1, y: 1 },
        { x: -1, y: -1 }
    ];
    // Specifying now the bishop piece color
    constructor(private pieceColor: Color) {
        super(pieceColor);
        this._FENChar = pieceColor === Color.White ? FENChar.WhiteBishop : FENChar.PinkBishop;
    }
}