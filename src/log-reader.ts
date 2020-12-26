import * as Tail from "tail";
import { TrafficAnalyzer } from "./traffic-analyzer";
import { LogLineData, LogLineParser } from "./log-line-parser";

export class LogReader {
  private readonly logLineParser: LogLineParser;

  constructor(private readonly fileName: string) {
    this.logLineParser = new LogLineParser();
  }

  start(trafficAnalyzerInterval: number) {
    const tail = new Tail.Tail(this.fileName);
    const trafficAnalyzer = new TrafficAnalyzer(trafficAnalyzerInterval);

    tail.on("line", (line) => {
      const lineData: LogLineData = this.logLineParser.parse(line);
      trafficAnalyzer.feed(lineData);
    });
  }
}
