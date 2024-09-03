import { Color, FENChar } from "../../chess-logic/models";

export type StockfishQueryParams = {
    fen: string;
    depth: number;
    mode: string;
}

export type ChessMove = {
    prevX: number;
    prevY: number;
    newX: number;
    newY: number;
    promotedPiece: FENChar | null;
}

export type StockfishResponse = {
    success: boolean;
    data: string;
}

// Declaring a new type to be used in play() function for playing against computer
export type ComputerConfiguration = {
    color: Color;
    level: number;
}

// Mapping the levels to Stockfish depth
export const stockfishLevels: Readonly<Record <number, number>> = {
    1: 1,
    2: 4,
    3: 7,
    4: 10,
    5: 13
}