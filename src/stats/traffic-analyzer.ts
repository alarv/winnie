import { TrafficData } from "../types/traffic-data";
import * as chalk from "chalk";

export class TrafficAnalyzer {
  private sectionHits: { [key: string]: number } = {};

  constructor(private readonly statsInterval: number) {
    setInterval(() => this.showStats(), statsInterval * 1000);
  }

  feed(lineData: TrafficData) {
    const section = lineData.request.split("/")[1];

    if (!this.sectionHits[section]) {
      this.sectionHits[section] = 0;
    }

    this.sectionHits[section]++;
  }

  private showStats() {
    console.log(chalk.green("Sections of the web site with the most hits"));

    const topSectionHits = Object.entries(this.sectionHits).sort(
      ([section1, section1Hits], [section2, section2Hits]) =>
        section2Hits - section1Hits
    );

    console.log(topSectionHits);

    this.sectionHits = {};
  }
}
