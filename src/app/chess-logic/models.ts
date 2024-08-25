export enum Color{
    White,
    Pink
}

export type Coords = {
    x: number;
    y: number;
}

export enum FENChar{
    WhitePawn = "P",
    WhiteKnight="N",
    WhiteBishop= "B",
    WhiteRook = "R",
    WhiteQueen = "Q",
    WhiteKing = "K",
    PinkPawn = "p",
    PinkKnight="n",
    PinkBishop= "b",
    PinkRook = "r",
    PinkQueen = "q",
    PinkKing = "k",
}

// Declaring the pieceImagePath constant
// It is a read-only object that, for its key, has a FENCharacter and string value for the image
export const pieceImagePaths: Readonly<Record<FENChar, string>> = {
    [FENChar.WhitePawn]: "assets/pieces/white-pawn.png",
    [FENChar.WhiteKnight]: "assets/pieces/white-knight.png",
    [FENChar.WhiteBishop]: "assets/pieces/white-bishop.png",
    [FENChar.WhiteRook]: "assets/pieces/white-rook.png",
    [FENChar.WhiteQueen]: "assets/pieces/white-queen.png",
    [FENChar.WhiteKing]: "assets/pieces/white-king.png",
    [FENChar.PinkPawn]: "assets/pieces/pink-pawn.png",
    [FENChar.PinkKnight]: "assets/pieces/pink-knight.png",
    [FENChar.PinkBishop]: "assets/pieces/pink-bishop.png",
    [FENChar.PinkRook]: "assets/pieces/pink-rook.png",
    [FENChar.PinkQueen]: "assets/pieces/pink-queen.png",
    [FENChar.PinkKing]: "assets/pieces/pink-king.png"
}

// C:\Users\joysp\OneDrive\Documents\BVT-Projects\mod-2\chess-game\src\assets\pieces\pink bishop.png