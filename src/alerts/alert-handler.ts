import { ConsoleLogger } from '../util/console-logger'
import * as moment from 'moment'

interface AlertHitsData {
  hits: number
  date: Date
}

export class AlertHandler {
  private alertState = false

  private historicalHitsData: Array<AlertHitsData> = []

  constructor(
    private readonly consoleLogger: ConsoleLogger,
    private readonly statsIntervalSeconds: number,
    private readonly alertIntervalMinutes: number,
    private readonly alertRequestPerSThreshold: number
  ) {}

  feed(totalHits: number, currentDate: Date): void {
    this.historicalHitsData.push({
      hits: totalHits,
      date: currentDate,
    })
    this.checkAlert()
  }

  private checkAlert(): void {
    const hitsPerSecAvgForInterval = this.calculateAvgForInterval()

    if (hitsPerSecAvgForInterval > this.alertRequestPerSThreshold) {
      this.enableAlert(hitsPerSecAvgForInterval, this.alertRequestPerSThreshold)
    } else {
      this.disableAlert(
        hitsPerSecAvgForInterval,
        this.alertRequestPerSThreshold
      )
    }
  }

  private calculateAvgForInterval() {
    const alertTimeWindowStart = moment().subtract(
      this.alertIntervalMinutes,
      'minutes'
    )
    this.historicalHitsData = this.historicalHitsData.filter((alertHitsData) =>
      moment(alertHitsData.date).isSameOrAfter(alertTimeWindowStart)
    )
    const hitsSumForInterval = this.historicalHitsData.reduce(
      (previousValue, currentValue) => previousValue + currentValue.hits,
      0
    )

    return hitsSumForInterval / (this.alertIntervalMinutes * 60)
  }

  private enableAlert(metricValue: number, thresholdValue: number) {
    if (this.alertState) {
      this.consoleLogger.error(
        '#########\n' +
          "[Alert still hasn't recovered] High traffic detected on server!\n" +
          `Metric value: ${metricValue}, \n` +
          `Threshold value: ${thresholdValue}\n` +
          '#########'
      )
      return
    }
    this.alertState = true
    this.consoleLogger.error(
      '#########\n' +
        '[Alert Triggered] High traffic detected on server!\n' +
        `Metric value: ${metricValue}, \n` +
        `Threshold value: ${thresholdValue}\n` +
        '#########'
    )
  }

  private disableAlert(metricValue: number, thresholdValue: number) {
    if (!this.alertState) {
      return
    }
    this.alertState = false
    this.consoleLogger.success(
      '#########\n' +
        '[Recovered] High traffic detected on server!\n' +
        `Metric value: ${metricValue}, \n` +
        `Threshold value: ${thresholdValue}\n` +
        '#########'
    )
  }
}
