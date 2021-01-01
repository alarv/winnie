import { TrafficData } from '../types/traffic-data'
import * as chalk from 'chalk'
import * as moment from 'moment'
import { Util } from '../util/util'
import { AlertHandler } from '../alerts/alert-handler'

export class TrafficAnalyzer {
  private readonly alertHandler: AlertHandler

  private sectionHits: { [key: string]: number } = {}

  private totalHits = 0

  private hitsByMethod: { [key: string]: number } = {}

  constructor(
    private readonly statsIntervalSeconds: number,
    private readonly alertIntervalMinutes: number,
    private readonly requestsThreshold: number
  ) {
    console.log(`Logging will start in ${statsIntervalSeconds} seconds...`)
    setInterval(() => this.showStats(), statsIntervalSeconds * 1000)
    this.alertHandler = new AlertHandler(
      statsIntervalSeconds,
      alertIntervalMinutes,
      requestsThreshold
    )
  }

  feed(lineData: TrafficData) {
    const section = lineData.request.split('/')[1]
    const requestMethod = lineData.method

    if (!this.sectionHits[section]) {
      this.sectionHits[section] = 0
    }
    if (!this.hitsByMethod[requestMethod]) {
      this.hitsByMethod[requestMethod] = 0
    }

    this.sectionHits[section]++
    this.hitsByMethod[requestMethod]++
    this.totalHits++
  }

  private showStats() {
    console.log(
      chalk.blue('===================================================')
    )
    console.log(
      `[${moment(new Date())}] current stats report for the past ${
        this.statsIntervalSeconds
      }s:`
    )
    if (Object.values(this.sectionHits).length === 0) {
      console.log(
        chalk.yellow(
          `No traffic found for the past ${this.statsIntervalSeconds} seconds`
        )
      )
      return
    }

    console.log(
      chalk.green(`Total requests served: ${Util.formatNumber(this.totalHits)}`)
    )

    console.log(chalk.green('Hits by request: '))
    Object.entries(this.hitsByMethod).forEach(([method, hits]) => {
      console.log(`\t${method}: ${Util.formatNumber(hits)}`)
    })

    console.log(
      chalk.green('Top 20 sections of the web site with the most hits:')
    )

    Object.entries(this.sectionHits)
      .sort(
        ([_, section1Hits], [__, section2Hits]) => section2Hits - section1Hits
      )
      .slice(0, 20)
      .forEach(([section, sectionHits], index) => {
        console.log(
          `\t${index + 1}) section: ${section}, hits: ${sectionHits} `
        )
      })
    this.alertHandler.feed(this.totalHits)
    this.resetMetrics()
  }

  private resetMetrics() {
    this.sectionHits = {}
    this.hitsByMethod = {}
    this.totalHits = 0
  }
}
