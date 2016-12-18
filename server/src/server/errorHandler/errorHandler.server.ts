/// <reference path="../../../typings/index.d.ts" />

import express = require("express");
import path = require("path");


export class ErrorHandlerComponent {

    gotError(req: express.Request, res: express.Response) {
        console.log('------------------------');
        console.log('\n\n\n');
        console.log('got error: ');
        console.log(req.body);
        console.log('\n\n\n');
        console.log('------------------------');
        res.send(200);
    }
}

