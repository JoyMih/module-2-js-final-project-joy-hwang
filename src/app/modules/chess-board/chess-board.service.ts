import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FENConverter } from '../../chess-logic/FENConverter';

@Injectable({
  providedIn: 'root'
})
export class ChessBoardService {
  // BehaviorSubject is a type of Observable in RXJS library that unsubscribes automatically after emitting first value
  public chessBoardState$ = new BehaviorSubject<string>(FENConverter.initialPosition);
}