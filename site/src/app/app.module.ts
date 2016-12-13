import { NgModule }                 from '@angular/core';
import { BrowserModule }            from '@angular/platform-browser';
import { RouterModule, Routes }     from '@angular/router';

import { AppComponent }             from './app.component';

import { HomeComponent }            from './home/home.component';
import { PlayerSelectComponent }    from './playerSelect/playerSelect.component';

import { PageNotFoundComponent }    from './error/page-not-found.component';

import { GameComponent }            from './game/game.component';
import { UpdateService }            from './services/update.service';
import { LightService }             from './services/light.service';
import { SkyBoxService }            from "./services/skybox.service";
import { KeyService }               from "./services/key.service";
import { LoaderService }            from "./services/loader.service";
import { MultiplayerService }       from "./services/multiplayer.service";
import { PhysicsService }           from "./services/physics.service";
import { WebSocketService }         from "./services/webSocket.service";
import { AnimationService }         from "./services/animation.service";
import { PlayerService }            from "./services/player.service";


const appRoutes: Routes = [

    { path: '',         component: HomeComponent },
    { path: 'game',     component: GameComponent },

    { path: 'player',   component: PlayerSelectComponent },

    { path: '**',       component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes)
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        PageNotFoundComponent,
        GameComponent,
        PlayerSelectComponent
    ],
    providers: [
        LightService,
        SkyBoxService,
        UpdateService,
        KeyService,
        LoaderService,
        MultiplayerService,
        PhysicsService,
        AnimationService,
        PlayerService,
        WebSocketService
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }