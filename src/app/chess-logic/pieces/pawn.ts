import { FENChar, Coords, Color } from "../models";
import { Piece } from "./piece";

// declare the king class and extend Piece
export class Pawn extends Piece {
    // We must declare a private class of hasMoved (we used this in other instances such as rook and king due to special move conditions)
    private _hasMoved: boolean = false;
    protected override _FENChar: FENChar;
    // Recall that the pawn piece can only advance forward. There will be no -x, and we must use another method to reverse movements for the opposing sides' pawn pieces.
    protected override _directions: Coords[] = [
        { x: 2, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: -1 },
        { x: 1, y: 1 }
    ];
    constructor(private pieceColor: Color) {
        super(pieceColor);
        // Look towards below for the private method creation
        if (pieceColor === Color.Pink) {
            this.setPinkPawnDirections();
        }
        this._FENChar = pieceColor === Color.White ? FENChar.WhitePawn : FENChar.PinkPawn;
    }

    // Now we implement a private method to have the Pink Pieces work in opposite direction to White Pieces. We simple reverse the x-direction movement, which in this case is the transverse or vertical axis. We must call this method above in the super constructor!
    private setPinkPawnDirections(): void {
        this._directions = this._directions.map(({ x, y }) => ({ x: -1 * x, y }));
    }

    // In addition, the very first moves of pawns provides a one-time option two advance 2 spaces forward instead of 1. This must be disabled after the first use.
    // This is the getter for the .hasMoved property
    public get hasMoved(): boolean {
        return this._hasMoved;
    }
    // This is the setter for the .hasMoved property
    // The setter takes in no arguments, hence _
    public set hasMoved(_) {
        this._hasMoved = true; // sets the hasMoved property to true.

        // When the piece has moved, the directions must be updated. Updated directions provide restricted movement where the leap 2 positions forward on is expunged.
        this._directions = [
            { x: 1, y: 0 },
            { x: 1, y: -1 },
            { x: 1, y: 1 }
        ];
        // Calling the function from lines 26-28
        if(this.pieceColor === Color.Pink){
            this.setPinkPawnDirections();
        }
    }
}