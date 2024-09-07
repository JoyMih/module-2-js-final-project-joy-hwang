import { Color, FENChar } from "../../chess-logic/models";

export type StockfishQueryParams = {
    fen: string;
    depth: number; // Removed mode property: Changed the API endpoint to be compatible with the newer version
}

export type ChessMove = {
    prevX: number;
    prevY: number;
    newX: number;
    newY: number;
    promotedPiece: FENChar | null;
}

export type StockfishResponse = {
    success: boolean; // Removed data property: Changed the API endpoint to be compatible with the newer version

    // Added properties: evaluation, mate, bestMove, continuation
    evaluation: number | null;
    bestmove: string;
    mate: number | null;
    continuation: string;
}

// Declaring a new type to be used in play() function for playing against computer
export type ComputerConfiguration = {
    color: Color;
    level: number;
}

// Mapping the levels to Stockfish depth
export const stockfishLevels: Readonly<Record <number, number>> = {
    1: 10,
    2: 11,
    3: 12,
    4: 13,
    5: 15
}