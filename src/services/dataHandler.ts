import axios from "axios";
import { journalEntry } from "../model/journalEntry";
import { apodObj } from "../model/apodObj";

export async function getRandom(count: number = 10) {
    let data: apodObj[];
    await axios.get('https://api.nasa.gov/planetary/apod?count=' + count + '&api_key=OLk6ZuBriusz0z3IX1O4nfLkMG7L5Hfh5hqyQAvO').then(res => { data = res.data; console.log(data); }).catch(err => console.log(err));
    return data.map(entry => { return new journalEntry(entry.date, entry.explanation, entry.title, entry.url); });
}

export async function getSpecific(date: string) {
    let data: apodObj;
    await axios.get('https://api.nasa.gov/planetary/apod?date=' + date + '&api_key=OLk6ZuBriusz0z3IX1O4nfLkMG7L5Hfh5hqyQAvO').then(res => { data = res.data; console.log(data); }).catch(err => console.log(err));
    return new journalEntry(data.date, data.explanation, data.title, data.url);
}

export async function getMultiple(startDate: string, endDate: string) {
    let data: apodObj[];
    await axios.get('https://api.nasa.gov/planetary/apod?start_date=' + startDate + '&end_date=' + endDate + '&api_key=OLk6ZuBriusz0z3IX1O4nfLkMG7L5Hfh5hqyQAvO').then(res => { data = res.data; console.log(data); }).catch(err => console.log(err));
    return data.map(entry => { return new journalEntry(entry.date, entry.explanation, entry.title, entry.url); });
}