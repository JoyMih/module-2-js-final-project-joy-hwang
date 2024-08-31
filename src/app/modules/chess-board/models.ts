import { FENChar } from "../../chess-logic/models"

type SquareWithPiece = {
    piece: FENChar;
    x: number;
    y: number;
}

type SquareWithoutPiece = {
    piece: null;
}

export type SelectedSquare = SquareWithPiece | SquareWithoutPiece;

// These represent the columns on the chessboard
export const columns = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;