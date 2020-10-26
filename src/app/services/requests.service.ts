import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RequestService {
  requests: string[] = [];

  private defaultReq = [
    "https://www.cbr-xml-daily.ru/daily_utf8.xml",
    "https://www.cbr-xml-daily.ru/daily_json.js",
  ];

  getAllReqs() {
    for (let i = 0; i < this.defaultReq.length; i++) {
      this.addReq(this.defaultReq[i]);
    }
  }

  addReq(req: string) {
    const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);
    if (!req.match(regex) || this.requests.includes(req)) { return; }
    this.requests.push(req);
  }

  clear() {
    this.requests = [];
  }
}
