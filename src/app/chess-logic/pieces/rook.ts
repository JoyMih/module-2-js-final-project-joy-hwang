import { Coords, FENChar, Color} from "../models";
import {Piece} from "./piece";

export class Rook extends Piece {
    // We must add another property, which denotes if Rook piece has moved.
    // "Castling" cannot be done if one of the rook pieces has moved
    private _hasMoved: boolean = false;
    protected override _FENChar: FENChar;
    // Recall how rook cannot move diagonally, but can translate only across main and transverse axes
    protected override _directions: Coords[] = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: 1, y: 0 },
        { x: -1, y: 0}
    ];
    constructor(private pieceColor: Color){
        super(pieceColor);
        this._FENChar = pieceColor === Color.White ? FENChar.WhiteRook : FENChar.PinkRook;
    }

    // This is the getter for the .hasMoved property
    public get hasMoved(): boolean{
        return this._hasMoved;
    }
    // This is the setter for the .hasMoved property
    // The setter takes in no arguments, hence _
    public set hasMoved(_){
        this._hasMoved = true; // sets the hasMoved property to true.
    }
}

