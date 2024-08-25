import { FENChar, Coords, Color } from "../models";
import {Piece} from "./piece";

// declare the king class and extend Piece
export class King extends Piece{
    // We must add another property, which denotes if King piece has moved
    private _hasMoved: boolean = false;
    protected override _FENChar: FENChar;
    // Recall how king can move in all 8 directions
    protected override _directions = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: 1, y: 0 },
        { x: 1, y: -1 },
        { x: 1, y: 1 },
        { x: -1, y: 0 },
        { x: -1, y: 1 },
        { x: -1, y: -1 }
    ];
    constructor(private pieceColor:Color) {
        super(pieceColor);
        this._FENChar = pieceColor === Color.White ? FENChar.WhiteKing : FENChar.PinkKing;
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