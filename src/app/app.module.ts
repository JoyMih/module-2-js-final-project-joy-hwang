import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './routes/app-routing.module';
import { AppComponent } from './app.component';
import { ChessBoardComponent } from './modules/chess-board/chess-board.component';
import { ComputerModeComponent } from './modules/computer-mode/computer-mode.component';
import { provideHttpClient } from '@angular/common/http';
import { NavMenuComponent } from './modules/nav-menu/nav-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    ChessBoardComponent,
    ComputerModeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NavMenuComponent // We transferred this line from declarations to imports array because we set the standalone property to true under nav-menu.components.ts
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
