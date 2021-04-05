import express, {Router} from "express";
import {OAuth2Client} from "google-auth-library";

import Risposte from "../lib/Risposte";

import Stats from "../lib/Stats";

import {join} from "path";

import config from "../config.json";

const router = Router();

const client = new OAuth2Client(config.GOOGLE.CLIENTID);

let answers: Risposte[];

setInterval(async () => {
    console.log("Updating answers from database");
    answers = await Risposte.findAll();
}, config.STATS_UPDATE_INTERVAL * 60 * 1000);

router.use(express.static(config.DEPLOY_PATH));

router.get("/", (req, res) => {
    res.render(join(config.DEPLOY_PATH, "index.ejs"))
});

router.get("/login", async (req, res) => {
    if (!req.query.idToken) {
        res.sendStatus(400);
        return;
    }

    const ticket = await client.verifyIdToken({
        idToken: req.query.idToken as string,
        audience: `${config.GOOGLE.CLIENTID}.apps.googleusercontent.com`
    }).catch(() => {
        console.log(`Attempted login with ${req.query.idToken}`);
        res.sendStatus(400);

        return null;
    });

    const payload = ticket?.getPayload();

    req.session["loginAttempt"] = true;

    if (payload && payload.hd === config.GOOGLE.GSUITE_DOMAIN) {
        req.session["isStudent"] = true;

        res.redirect("/sondaggio");

        console.log(`user has successfully logged in`);
        console.log(payload);
    } else {
        req.session["isStudent"] = false;

        res.render("E401.ejs");

        console.log(`user tried to log in, but failed`);
    }
});

router.get("/sondaggio", async (req, res) => {
    console.log(JSON.stringify(req.session, null, 3));

    if (!req.session["loginAttempt"]) {
        res.redirect("/");
        return;
    } else if (req.session["isStudent"]) {
        if (req.session["hasAlreadySubmitted"])
            res.redirect("/risultati");
        else
            res.render(join(config.DEPLOY_PATH, "sondaggio.ejs"), {
                domande: config.QUESTIONS
            });
    }
});

router.post("/submit", async (req, res) => {
    const obj: { [k: string]: string } = req.body;

    if (Object.keys(obj).length !== config.QUESTIONS.length) {
        res.sendStatus(400);
        return;
    }

    let answerArr: string[] = [];

    const values = Object.values(obj);

    for(let i = 0; i < values.length; ++i) {
        if (!config.QUESTIONS[i].options.includes(values[i])) {
            res.sendStatus(400);
            return;
        }

        answerArr.push(values[i]);
    }

    await Risposte.create({
        ID: 0,
        risposte: JSON.stringify(answerArr)
    });

    req.session["hasAlreadySubmitted"] = true;

    res.redirect("/risultati");
});

router.get("/risultati", async (req, res) => {
    if (!req.session["loginAttempt"]) {
        res.redirect("/");
        return;
    }

    if (!answers)
        answers = await Risposte.findAll();

    let answerStats: Stats[] = [];

    for (let ans of answers) {
        const risps = JSON.parse(ans.risposte) as string[];

        risps.forEach((r, i) => {
            if (i < answerStats.length)
                answerStats[i].addAnswer(r);
            else
                answerStats.push(new Stats(config.QUESTIONS[i]))
        });
    }

    for(let stat of answerStats)
        stat.getResults(answers.length);

    res.render(join(config.DEPLOY_PATH, "risultati"), { domande: answerStats });
});

export default router;