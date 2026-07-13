import express, {type Request, type Response, Router} from "express";
import fs from "node:fs";
import { apodObj } from "../model/apodObj";
import { journalEntry } from "../model/journalEntry";
import { getRandom, getMultiple, getSpecific } from "../services/dataHandler";

class APODController {
    private app;
    private router;
    public readonly port: number = 8000;

    public constructor() {
        this.app = express();
        this.app.use(express.json());
        this.router = express.Router();

        this.initializeRouter();

        this.app.use('/', this.router);
        this.app.listen(this.port, () => {
            console.log(`Test backend is running on port ${this.port}`);
        });
    }


    private initializeRouter() {
        this.router.get('/apod/today', async (req, res) => {

            let data: journalEntry[] = await getSpecific();
            res.send(data);

        });

        this.router.get('/apod/date/:date', async (req: Request<{ date: string }>, res: Response) => {

            let data: journalEntry[] = await getSpecific(req.params.date);
            res.send(data);

        });

        this.router.get('/apod/random/:count', async (req: Request<{ count: number }>, res: Response) => {
            let data: journalEntry[] = await getRandom(req.params.count);
            res.send(data);
        });

        this.router.get('/apod/interval/', async (req: Request, res: Response) => {

            const start = req.query.start;
            const end = req.query.end;
            const pagStart = req.query.pagStart;
            const pagEnd = req.query.pagEnd;

            if (typeof start !== "string" || typeof end !== "string") {
                res.send("Invalid request!");
                return;
            }

            let data: journalEntry[] = await getMultiple(<string>start, <string>end);
            console.log(data);

            if (typeof pagStart === "string" || typeof pagEnd === "string")
                data = data.slice(parseInt(pagStart) - 1, parseInt(pagEnd));

            res.send(data);
        })
    }
}

const controller = new APODController();