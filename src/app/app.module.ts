import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './routes/app-routing.module';
import { AppComponent } from './app.component';
import { ChessBoardComponent } from './modules/chess-board/chess-board.component';
import { ComputerModeComponent } from './modules/computer-mode/computer-mode.component';
// import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpClientModule } from "@angular/common/http";
import { NavMenuComponent } from './modules/nav-menu/nav-menu.component';
import { PlayAgainstComputerDialogComponent } from './modules/play-against-computer-dialog/play-against-computer-dialog.component';
import { MoveListComponent } from './modules/move-list/move-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ChessBoardComponent,
    ComputerModeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NavMenuComponent, // We transferred this line from declarations to imports array because we set the standalone property to true under nav-menu.component.ts
    PlayAgainstComputerDialogComponent, // We transferred this line from declarations to imports array because we set the standalone property to true under play-against-computer-dialog.component.ts
    MoveListComponent // We transferred this line from declarations to imports array because we set the standalone property to true under move-list.component.ts
  ],
  providers: [], // provideHttpClient(withInterceptorsFromDi())
  bootstrap: [AppComponent]
})
export class AppModule { }
