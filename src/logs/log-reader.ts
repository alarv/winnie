import { Tail } from "tail";
import { TrafficAnalyzer } from "../stats/traffic-analyzer";
import { LogLineParser } from "./log-line-parser";
import { TrafficData } from "../types/traffic-data";
import * as chalk from "chalk";

export interface LogReaderArgs {
  trafficAnalyzerInterval: number;
}

export class LogReader {
  private readonly logLineParser: LogLineParser;

  constructor(private readonly fileName: string) {
    this.logLineParser = new LogLineParser();
  }

  start(args: LogReaderArgs) {
    const tail = new Tail(this.fileName);
    const trafficAnalyzer = new TrafficAnalyzer(args.trafficAnalyzerInterval);

    tail.on("line", (line) => {
      try {
        const lineData: TrafficData = this.logLineParser.parse(line);
        trafficAnalyzer.feed(lineData);
      } catch (err) {
        console.error(chalk.red("Line could not be parsed"), err);
      }
    });
  }
}
