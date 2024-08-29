import { CheckState, Color, Coords, FENChar, LastMove, MoveType, SafeSquares } from "./models";
import { Piece } from "./pieces/piece";
import { Rook } from "./pieces/rook";
import { Knight } from "./pieces/knight";
import { Bishop } from "./pieces/bishop";
import { Queen } from "./pieces/queen";
import { King } from "./pieces/king";
import { Pawn } from "./pieces/pawn";

export class ChessBoard {
    // Pieces and null: representing empty squares
    private chessBoard: (Piece | null)[][];
    private _playerColor = Color.White;
    // We are storing the chessboard dimensions (8x8 squares)
    private readonly chessBoardSize: number = 8;
    private _safeSquares: SafeSquares; // Holding safe squares for the player: this value is defined in the constructor below
    private _lastMove: LastMove | undefined;
    private _checkState: CheckState = { isInCheck: false };

    // We set prepare to set a condition limiting 50 moves of no-capture
    private fiftyMoveRuleCounter: number = 0;

    private _isGameOver: boolean = false;
    private _gameOverMessage: string | undefined;

    constructor() {
        // Implementing the chessBOard properties in the constructor
        this.chessBoard = [
            // White Pieces
            [new Rook(Color.White), new Knight(Color.White), new Bishop(Color.White), new Queen(Color.White), new King(Color.White), new Bishop(Color.White), new Knight(Color.White), new Rook(Color.White)
            ],
            [
                new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White)
            ],
            // Now we set up 4 empty rows
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            // Pink Pieces
            [
                new Pawn(Color.Pink), new Pawn(Color.Pink), new Pawn(Color.Pink), new Pawn(Color.Pink), new Pawn(Color.Pink), new Pawn(Color.Pink), new Pawn(Color.Pink), new Pawn(Color.Pink)
            ],
            [new Rook(Color.Pink), new Knight(Color.Pink), new Bishop(Color.Pink), new Queen(Color.Pink), new King(Color.Pink), new Bishop(Color.Pink), new Knight(Color.Pink), new Rook(Color.Pink)
            ],
        ];

        // Defining the private _safeSquares property
        this._safeSquares = this.findSafeSquares();
    }
    // Defining the getter for the player Color (global scope)
    public get playerColor(): Color {
        return this._playerColor;
    }
    // Defining the public getter for the chessBoard View to bring in the board
    public get chessBoardView(): (FENChar | null)[][] {
        return this.chessBoard.map(row => {
            // Checking for if each square contains a piece or is just a null empty square
            // This either returns the piece on square or null
            return row.map(piece => piece instanceof Piece ? piece.FENChar : null);
        });
    }

    // Create getter for the private safeSquares property
    public get safeSquares(): SafeSquares {
        return this._safeSquares;
    }

    public get lastMove(): LastMove | undefined {
        return this._lastMove;
    }

    public get checkState(): CheckState {
        return this._checkState;
    }

    public get isGameOver(): boolean {
        return this.isGameOver;
    }

    public get gameOverMessage(): string | undefined {
        return this._gameOverMessage
    }

    // The return type of this method should be a boolean
    public static isSquareDark(x: number, y: number): boolean {
        // Returning odd or even
        return x % 2 === 0 && y % 2 === 0 || x % 2 === 1 && y % 2 === 1;
    }


    // Creating a new private method to check whether or not a move is in range. It intakes coordinates and returns a boolean.
    private areCoordsValid(x: number, y: number): boolean {
        // Coordinate values must fit within the 8 rows and 8 columns
        return x >= 0 && y >= 0 && x < this.chessBoardSize && y < this.chessBoardSize;
    }


    // We are implementing the method to check for whether or not the king is in check. It will intake player color as argument and return us a boolean.
    public isInCheck(playerColor: Color, checkingCurrentPosition: boolean): boolean {
        // Checking the positions on the board. Recall the 8x8 squares we are iterating through. We created a private property above called chessBoardSize to avoid hardcoding the number.
        for (let x = 0; x < this.chessBoardSize; x++) {
            for (let y = 0; y < this.chessBoardSize; y++) {
                // Declaring a variable, piece, that is either Piece or null (square with piece on it or empty square) in the [x][y] position on this chessboard.
                const piece: Piece | null = this.chessBoard[x][y];

                // Checking if piece variable is empty square (null), as well as the case where if there is a piece, we check the color
                if (!piece || piece.color === playerColor) continue;

                for (const { x: dx, y: dy } of piece.directions) {
                    // Declaring new x,y coordinates
                    let newX: number = x + dx;
                    let newY: number = y + dy;

                    // However, if coordinates are not valid, the checks must continue still
                    if (!this.areCoordsValid(newX, newY)) continue;

                    // Checking if the piece is an instance of pawn, knight, or king
                    if (piece instanceof Pawn || piece instanceof Knight || piece instanceof King) {
                        if (piece instanceof Pawn && dy === 0) continue; // Recall that pawns can only attack diagonally. The change in y direction is 0.

                        const attackedPiece: Piece | null = this.chessBoard[newX][newY];
                        // Checking if the player color's king piece has been attacked
                        if (attackedPiece instanceof King && attackedPiece.color === playerColor) {
                            if (checkingCurrentPosition) this._checkState = { isInCheck: true, x: newX, y: newY }
                            return true;
                        }
                    }
                    else { // This case is now for pieces that are instances of bishop, rook, or queen. These pieces can move multiple squares at a time along a direction.
                        while (this.areCoordsValid(newX, newY)) {
                            const attackedPiece: Piece | null = this.chessBoard[newX][newY];
                            // Checking if the player color's king piece has been attacked (here again.)
                            if (attackedPiece instanceof King && attackedPiece.color === playerColor) {
                                if (checkingCurrentPosition) this._checkState = { isInCheck: true, x: newX, y: newY };
                                return true;
                            }

                            // If the attacked piece is null or an empty square, we are stopping the piece from traversing in that direction.
                            if (attackedPiece !== null) break;

                            // We implement another chess rule in that bishops, rooks, and queens cannot "jump" over other pieces. It is important that we update the new x and y coordinates with each increment.
                            newX += dx;
                            newY += dy;
                        }
                    }
                }
            }
        }
        if (checkingCurrentPosition) this._checkState = { isInCheck: false };
        return false;
    }

    // Implementing a private method that checks if the move is saved. It intakes the piece type, previous x & y positions, as well as new x & y coordinates. Five total input parameters.
    private isPositionSafeAfterMove(prevX: number, prevY: number, newX: number, newY: number): boolean {
        const piece: Piece | null = this.chessBoard[prevX][prevY];
        if (!piece) return false;

        // declare newPiece that represents an empty square on the new coordinates
        const newPiece: Piece | null = this.chessBoard[newX][newY];
        // Following, checking if this new piece is a piece and is the player's color. In chess, a piece cannot be placed on a space occupied by your own color's piece.
        if (newPiece && newPiece.color === piece.color) return false;

        // Simulating what this action would look like
        this.chessBoard[prevX][prevY] = null; // The old position is emptied
        this.chessBoard[newX][newY] = piece; // This is where we next place our piece


        // Checking if the player is in check
        const isPositionSafe: boolean = !this.isInCheck(piece.color, false);

        // Restoring the piece's position based on if the player is safe and still not in check after their move, we must restart and restore.
        this.chessBoard[prevX][prevY] = piece; // The old position is emptied
        this.chessBoard[newX][newY] = newPiece; // This is where we next place our piece

        return isPositionSafe; // Recall this method returns a boolean
    }

    // Finally, we implement the findSafeSquares method, which intakes no arguments and returns a custom value of SafeSquares (this is declared in the models.ts file).
    private findSafeSquares(): SafeSquares {
        const safeSquares: SafeSquares = new Map<string, Coords[]>();

        // Traversing the board to find those safe squares
        for (let x = 0; x < this.chessBoardSize; x++) {
            for (let y = 0; y < this.chessBoardSize; y++) {
                // Declaring a variable, piece, that is either Piece or null (square with piece on it or empty square) in the [x][y] position on this chessboard.
                const piece: Piece | null = this.chessBoard[x][y];
                // If piece is an empty square or if the piece differs player's color, we continue
                if (!piece || piece.color !== this._playerColor) continue;

                // Safe squares are initially an empty array
                const pieceSafeSquares: Coords[] = [];

                // Declaring a constant for all pieces directions
                for (const { x: dx, y: dy } of piece.directions) {
                    let newX: number = x + dx;
                    let newY: number = y + dy;

                    // Validate if the coordinates are valid and traversable
                    if (!this.areCoordsValid(newX, newY)) continue;

                    // Declaring a new piece representing the newX and newY coordinate
                    let newPiece: Piece | null = this.chessBoard[newX][newY];
                    // If piece is not empty and is the same color as the player's color, we cannot proceed into that square.
                    if (newPiece && newPiece.color === piece.color) continue;


                    // Restricting the movement of pawns, as they only advance forward/diagonal AND can only take pieces diagonally. We are addressing all instances and cases of pawns.
                    if (piece instanceof Pawn) {
                        if (dx === -2 || dx === 2) { // Pawns cannot advance forward if a piece is blocking them. Here, we check this for both colors by taking advantage of the color directions. Pink as dx === -2 and White for dx === 2.
                            if (newPiece) continue;
                            // Here, we check for if the attempted illegal in-front pawn move is 2 spaces, we limit the dx to 1 or -1 only for either direction.
                            if (this.chessBoard[newX + (dx === 2 ? -1 : 1)][newY]) continue;
                        }
                        // The pawn also cannot proceed straight if there is a pawn directly in front
                        if ((dx === -1 || dx === 1) && dy === 0 && newPiece) continue;

                        // We also restrict diagonal movement if either case is true: the space is occupied by the same color piece OR that target square location is empty (i.e. there is no opponent piece to be taken in that spot)
                        if ((dy === -1 || dy === 1) && (!newPiece || piece.color === newPiece.color)) continue;
                    }

                    // Checking for pawn, king, knight
                    if (piece instanceof Pawn || piece instanceof King || piece instanceof Knight) {
                        if (this.isPositionSafeAfterMove(x, y, newX, newY)) {
                            // If the position is safe, then we can push and append these new coordinates
                            pieceSafeSquares.push({ x: newX, y: newY });
                        }
                    }
                    else { // Now we are checking for the other pieces
                        // Recall how bishops, rooks, and queens can move several squares along a direction. This necessitates a while loop, which will allow the traversal through all possible spaces in each direction.
                        while (this.areCoordsValid(newX, newY)) {
                            newPiece = this.chessBoard[newX][newY];
                            // Break the while loop when the desired end location contains a piece of the player's color, as it is not an takeable position.
                            if (newPiece && newPiece.color === piece.color) break;

                            if (this.isPositionSafeAfterMove(x, y, newX, newY)) {
                                // If the position is safe, then we can push and append these new coordinates
                                pieceSafeSquares.push({ x: newX, y: newY });
                            }

                            if (newPiece !== null) break;

                            newX += dx;
                            newY += dy;
                        }
                    }
                }

                if (piece instanceof King) {
                    if (this.canCastle(piece, true))
                        pieceSafeSquares.push({ x, y: 6 });

                    if (this.canCastle(piece, false))
                        pieceSafeSquares.push({ x, y: 2 });
                }
                else if (piece instanceof Pawn && this.canCaptureEnPassant(piece, x, y))
                    pieceSafeSquares.push({ x: x + (piece.color === Color.White ? 1 : -1), y: this._lastMove!.prevY });

                // This delineated that if piece contains any safe squares, we must push those safe squares into the map of safe squares we are creating
                if (pieceSafeSquares.length) {
                    safeSquares.set(x + "," + y, pieceSafeSquares);
                }
            }
        }
        return safeSquares;
    }

    // Implementing EnPassant
    private canCaptureEnPassant(pawn: Pawn, pawnX: number, pawnY: number): boolean {
        if (!this._lastMove) return false; // If the last move is undefined we must return false
        const { piece, prevX, prevY, currX, currY } = this._lastMove;

        if (
            !(piece instanceof Pawn) ||
            pawn.color !== this._playerColor ||
            Math.abs(currX - prevX) !== 2 ||
            pawnX !== currX ||
            Math.abs(pawnY - currY) !== 1
        ) return false;

        const pawnNewPositionX: number = pawnX + (pawn.color === Color.White ? 1 : -1);
        const pawnNewPositionY: number = currY;

        this.chessBoard[currX][currY] = null;
        const isPositionSafe: boolean = this.isPositionSafeAfterMove(pawnX, pawnY, pawnNewPositionX, pawnNewPositionY);
        this.chessBoard[currX][currY] = piece;

        return isPositionSafe;
    }

    // Implementing Castling
    private canCastle(king: King, kingSideCastle: boolean): boolean {
        if (king.hasMoved) return false;

        const kingPositionX: number = king.color === Color.White ? 0 : 7;
        const kingPositionY: number = 4;
        const rookPositionX: number = kingPositionX;
        const rookPositionY: number = kingSideCastle ? 7 : 0;
        const rook: Piece | null = this.chessBoard[rookPositionX][rookPositionY];

        if (!(rook instanceof Rook) || rook.hasMoved || this._checkState.isInCheck) return false;

        const firstNextKingPositionY: number = kingPositionY + (kingSideCastle ? 1 : -1);
        const secondNextKingPositionY: number = kingPositionY + (kingSideCastle ? 2 : -2);

        if (this.chessBoard[kingPositionX][firstNextKingPositionY] || this.chessBoard[kingPositionX][secondNextKingPositionY]) return false;

        if (!kingSideCastle && this.chessBoard[kingPositionX][1]) return false;

        return this.isPositionSafeAfterMove(kingPositionX, kingPositionY, kingPositionX, firstNextKingPositionY) &&
            this.isPositionSafeAfterMove(kingPositionX, kingPositionY, kingPositionX, secondNextKingPositionY);
    }


    public move(prevX: number, prevY: number, newX: number, newY: number, promotedPieceType: FENChar | null): void {
        if (!this.areCoordsValid(prevX, prevY) || !this.areCoordsValid(newX, newY)) return;
        const piece: Piece | null = this.chessBoard[prevX][prevY];
        if (!piece || piece.color !== this._playerColor) return;

        const pieceSafeSquares: Coords[] | undefined = this._safeSquares.get(prevX + "," + prevY);
        if (!pieceSafeSquares || !pieceSafeSquares.find(coords => coords.x === newX && coords.y === newY))
            throw new Error("This square is NOT safe"); // If these coordinates are NOT safe, we throw an error

        // If the piece is pawn, rook, or king
        if ((piece instanceof Pawn || piece instanceof King || piece instanceof Rook) && !piece.hasMoved)
            piece.hasMoved = true;

        const moveType = new Set<MoveType>();

        // We check if a piece was taken
        const isPieceTaken: boolean = this.chessBoard[newX][newY] !== null; // Empty square/null would denote that a piece was taken
        if (isPieceTaken) moveType.add(MoveType.Capture);

        // Subsequently, we impose our limitation beneath the 
        if (piece instanceof Pawn || isPieceTaken) this.fiftyMoveRuleCounter = 0; // If the piece is a Pawn or if the piece is taken (true case), the counter is reset
        else this.fiftyMoveRuleCounter += 0.5; // 0.5 is because each player's move is half of one whole turn.

        this.handlingSpecialMoves(piece, prevX, prevY, newX, newY, moveType);

        // After this, we must update the chessboard
        if (promotedPieceType) {
            this.chessBoard[newX][newY] = this.promotedPiece(promotedPieceType);
        }
        else { // If promotion does not happen, place piece at new x,y coordinates
            this.chessBoard[newX][newY] = piece;
        }
        this.chessBoard[prevX][prevY] = null;
        this.chessBoard[newX][newY] = piece;

        this._lastMove = { prevX, prevY, currX: newX, currY: newY, piece, moveType };
        this._playerColor = this._playerColor === Color.White ? Color.Pink : Color.White;
        this.isInCheck(this._playerColor, true);
        this._safeSquares = this.findSafeSquares();
        this._isGameOver = this.isGameFinished();
    }

    private handlingSpecialMoves(piece: Piece, prevX: number, prevY: number, newX: number, newY: number, moveType: Set<MoveType>): void {
        if (piece instanceof King && Math.abs(newY - prevY) === 2) {
            // newY > prevY  === king side castle

            const rookPositionX: number = prevX;
            const rookPositionY: number = newY > prevY ? 7 : 0;
            const rook = this.chessBoard[rookPositionX][rookPositionY] as Rook;
            const rookNewPositionY: number = newY > prevY ? 5 : 3;
            this.chessBoard[rookPositionX][rookPositionY] = null;
            this.chessBoard[rookPositionX][rookNewPositionY] = rook;
            rook.hasMoved = true;
            moveType.add(MoveType.Castling);
        }
        else if (
            piece instanceof Pawn &&
            this._lastMove && // When lastMove is not undefined
            this._lastMove.piece instanceof Pawn &&
            Math.abs(this._lastMove.currX - this._lastMove.prevX) === 2 &&
            prevX === this._lastMove.currX &&
            newY === this._lastMove.currY
        ) {
            this.chessBoard[this._lastMove.currX][this._lastMove.currY] = null;
            moveType.add(MoveType.Capture);
        }
    }

    // Implementing the promotedPiece method for Piece Promotion
    private promotedPiece(promotedPieceType: FENChar): Knight | Bishop | Rook | Queen {
        if (promotedPieceType === FENChar.WhiteKnight || promotedPieceType === FENChar.PinkKnight)
            return new Knight(this._playerColor);
        if (promotedPieceType === FENChar.WhiteBishop || promotedPieceType === FENChar.PinkBishop)
            return new Bishop(this._playerColor);
        if (promotedPieceType === FENChar.WhiteRook || promotedPieceType === FENChar.PinkRook)
            return new Rook(this._playerColor);

        return new Queen(this._playerColor);
    }

    private isGameFinished(): boolean {
        if (!this._safeSquares.size) {
            if (this._checkState.isInCheck) { // In the case of a checkmate
                const prevPlayer: string = this._playerColor === Color.White ? "Black" : "White";
                this._gameOverMessage = prevPlayer + " won by checkmate";
            }
            else this._gameOverMessage = "Stalemate"; // In the case of a stalemate

            return true;
        }

        // Before ringing to false case, we must check the counter to see if 50 moves limitation has been breached
        if (this.fiftyMoveRuleCounter === 50) {
            this._gameOverMessage = "Draw due to rule: 50 moves have been reached without resolution";
            return true;
        }
        return false; // This will ensure the game continues outside of these cases
    }
}
