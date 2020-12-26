import { TrafficData } from "../types/traffic-data";
import * as chalk from "chalk";
import * as moment from "moment";

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
    console.log(`\n[${moment(new Date())}] current stats report:`);
    if (Object.values(this.sectionHits).length === 0) {
      console.log(
        chalk.yellow(
          `No traffic found for the past ${this.statsInterval} seconds`
        )
      );
      return;
    }

    console.log(
      chalk.green("Top 20 sections of the web site with the most hits:")
    );

    Object.entries(this.sectionHits)
      .sort(
        ([section1, section1Hits], [section2, section2Hits]) =>
          section2Hits - section1Hits
      )
      .slice(0, 20)
      .forEach(([section, sectionHits], index) => {
        console.log(`${index + 1}) section: ${section}, hits: ${sectionHits} `);
      });

    this.sectionHits = {};
  }
}
