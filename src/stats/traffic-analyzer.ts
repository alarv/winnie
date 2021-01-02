import { TrafficData } from '../types/traffic-data'
import * as chalk from 'chalk'
import * as moment from 'moment'
import { Util } from '../util/util'
import { AlertHandler } from '../alerts/alert-handler'
import * as Table from 'cli-table3'

export class TrafficAnalyzer {
  private readonly TOP_SECTIONS_TO_SHOW: number = 10

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

    console.log(chalk.green('Hits by request method: '))
    const hitsByRequestTable = new Table({
      head: ['Method', 'Hits'],
    })
    Object.entries(this.hitsByMethod).forEach(([method, hits]) => {
      hitsByRequestTable.push([method, Util.formatNumber(hits)])
    })
    console.log(hitsByRequestTable.toString())

    console.log(
      chalk.green(
        `Top ${this.TOP_SECTIONS_TO_SHOW} sections of the web site with the most hits:`
      )
    )

    const topSectionsTable = new Table({
      head: ['#', 'Section', 'Hits'],
    })

    Object.entries(this.sectionHits)
      .sort(
        ([_, section1Hits], [__, section2Hits]) => section2Hits - section1Hits
      )
      .slice(0, this.TOP_SECTIONS_TO_SHOW)
      .forEach(([section, sectionHits], index) => {
        topSectionsTable.push([
          index + 1,
          section,
          Util.formatNumber(sectionHits),
        ])
      })
    console.log(topSectionsTable.toString())

    console.log(
      chalk.green(`Total requests served: ${Util.formatNumber(this.totalHits)}`)
    )
    console.log(
      chalk.green(
        `Average requests/s for the past ${this.statsIntervalSeconds}s: ${
          this.totalHits / this.statsIntervalSeconds
        }`
      )
    )

    this.alertHandler.feed(this.totalHits)
    this.resetMetrics()
  }

  private resetMetrics() {
    this.sectionHits = {}
    this.hitsByMethod = {}
    this.totalHits = 0
  }
}
