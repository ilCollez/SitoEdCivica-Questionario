export interface QuestionStats {
    [k: string]: number;
}

export interface Question {
    title: string;
    options: string[];
}

export default class Stats {
    private ansDict: QuestionStats = {};
    private readonly question: string;

    public results: QuestionStats = {};

    constructor(dom: Question) {
        this.question = dom.title;

        for (let ans of dom.options)
            this.ansDict[ans] = 0;
    }

    public addAnswer(ans: string) {
        if (ans in this.ansDict)
            this.ansDict[ans]++;
        else
            throw `La risposta "${ans}" non fa parte delle opzioni previste della domanda ${this.question}!`;
    }

    public getResults(totalAns: number) {
        for(let key in this.ansDict)
            if (this.ansDict.hasOwnProperty(key))
                this.results[key] = this.ansDict[key] * 100 / totalAns;
    }
}