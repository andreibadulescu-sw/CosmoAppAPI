export class journalEntry {
    date: string;
    explanation: string;
    title: string;
    url: string;

    public constructor(date: string, explanation: string, title: string, url: string) {
        this.date = date;
        this.explanation = explanation;
        this.title = title;
        this.url = url;
    }
}

