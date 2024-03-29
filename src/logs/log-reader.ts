import { Tail } from 'tail'
import { TrafficAnalyzer } from '../stats/traffic-analyzer'
import { LogLineParser } from './log-line-parser'
import { TrafficData } from '../types/traffic-data'
import { ConsoleLogger } from '../util/console-logger'

export interface LogReaderArgs {
  trafficAnalyzerIntervalSeconds: number
  alertIntervalMinutes: number
  requestsThreshold: number
  verbose: boolean
}

export class LogReader {
  private readonly logLineParser: LogLineParser

  constructor(
    private readonly consoleLogger: ConsoleLogger,
    private readonly fileName: string
  ) {
    this.logLineParser = new LogLineParser()
  }

  start(args: LogReaderArgs) {
    const tail = new Tail(this.fileName)
    const trafficAnalyzer = new TrafficAnalyzer(
      this.consoleLogger,
      args.trafficAnalyzerIntervalSeconds,
      args.alertIntervalMinutes,
      args.requestsThreshold
    )

    tail.on('line', (line) => {
      try {
        const lineData: TrafficData = this.logLineParser.parse(line)
        trafficAnalyzer.feed(lineData)
      } catch (error) {
        if (args.verbose) {
          this.consoleLogger.error(
            `Line with content "${line}" could not be parsed`
          )
        }
      }
    })
  }
}
