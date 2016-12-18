/// <reference path="../../../../typings/index.d.ts" />

import express = require("express");

export class RoutesComponent {
  
    home(req: express.Request, res: express.Response) {
        res.sendFile('index.html', {root: '../site/dist/'});
    };

}


