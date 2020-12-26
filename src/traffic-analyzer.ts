import { LogLineData } from "./log-line-parser";

export class TrafficAnalyzer {
  constructor(private readonly statsInterval: number) {
    setInterval(this.showStats, statsInterval * 1000);
  }

  feed(lineData: LogLineData) {}

  private showStats() {
    console.log("EPIC STATS!!!");
  }
}
