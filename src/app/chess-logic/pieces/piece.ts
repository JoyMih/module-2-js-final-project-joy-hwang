// We import the types from models.ts that we created in that file. After importing, we can now implement the abstract classes for each type of piece.
import { Color, Coords, FENChar } from "../models";

export abstract class Piece{ // Declaring abstract class called Piece
    // Creating protected abstract properties. These will be defined later below
    protected abstract _FENChar: FENChar;
    protected abstract _directions: Coords[]; // Directions are stored within array

    //Through constructor, we define private property of Color
    constructor(private _color: Color){}

    // Defining the getters for those properties we made above
    public get FENChar(): FENChar{
        return this._FENChar;
    }
    public get directions(): Coords[] {
        return this._directions;
    }
    public get color(): Color{
        return this._color;
    }
}