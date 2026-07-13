import express, {type Request, type Response, Router} from "express";
import { journalEntry } from "../model/journalEntry";
import { getRandom, getMultiple, getSpecific } from "../services/dataHandler";

class APODController {
    private app;
    private router;

    public readonly port: number = 8000;
    private readonly dateRegex: RegExp = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;

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

            let now = new Date();
            let data: journalEntry[] = await getSpecific(now.toISOString().slice(0, 10));
            res.send(data);

        });

        this.router.get('/apod/date/:date', async (req: Request<{ date: string }>, res: Response) => {

            if (!this.dateRegex.test(req.params.date)) {
                res.status(400).send("Invalid request!");
                return;
            }

            let data: journalEntry[] = await getSpecific(req.params.date);
            res.send(data);

        });

        this.router.get('/apod/random/:count', async (req: Request<{ count: number }>, res: Response) => {

            if (req.params.count < 1) {
                res.status(400).send("Invalid request!");
                return;
            }

            let data: journalEntry[] = await getRandom(req.params.count);
            res.send(data);

        });

        this.router.get('/apod/interval', async (req: Request, res: Response) => {

            const start = req.query.start;
            const end = req.query.end;
            const pagStart = req.query.pagStart;
            const pagEnd = req.query.pagEnd;

            if (typeof start !== "string" || typeof end !== "string") {
                res.status(400).send("Invalid request!");
                return;
            }

            if (!(this.dateRegex.test(start) && this.dateRegex.test(end))) {
                res.status(400).send("Invalid request!");
                return;
            }

            let data: journalEntry[] = await getMultiple(<string>start, <string>end);
            console.log(data);

            if (typeof pagStart === "string" && typeof pagEnd === "string") {
                let lhs = parseInt(pagStart) - 1;
                let rhs = parseInt(pagEnd) - 1;

                if (lhs >= 0 && lhs < data.length && rhs > lhs && rhs <= data.length)
                    data = data.slice(lhs, rhs + 1);
            }

            res.send(data);
        })
    }
}

const controller = new APODController();



