import moment = require('moment')
import chalk = require('chalk')

interface AlertHitsData {
  hits: number
  date: Date
}

export class AlertHandler {
  private alertState = false

  private historicalHitsData: Array<AlertHitsData> = []

  constructor(
    private readonly statsIntervalSeconds: number,
    private readonly alertIntervalMinutes: number,
    private readonly alertRequestPerSThreshold: number
  ) {}

  feed(totalHits: number): void {
    this.historicalHitsData.push({
      hits: totalHits,
      date: new Date(),
    })
    this.checkAlert()
  }

  private checkAlert(): void {
    const hitsPerSecAvgForInterval = this.calculateAvgForInterval()

    console.log('hitsPerSecAvgForInterval: ' + hitsPerSecAvgForInterval)
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
      moment(alertHitsData.date).isAfter(alertTimeWindowStart)
    )
    const hitsSumForInterval = this.historicalHitsData.reduce(
      (previousValue, currentValue) => previousValue + currentValue.hits,
      0
    )

    console.log('hitsSumForInterval: ' + hitsSumForInterval)
    return hitsSumForInterval / (this.alertIntervalMinutes * 60)
  }

  private enableAlert(metricValue: number, thresholdValue: number) {
    if (this.alertState) {
      return
    }
    this.alertState = true
    console.log(
      chalk.red(
        '#########\n' +
          '[Alert] High traffic detected on server!\n' +
          `Metric value: ${metricValue}, \n` +
          `Threshold value: ${thresholdValue}` +
          '#########'
      )
    )
  }

  private disableAlert(metricValue: number, thresholdValue: number) {
    if (!this.alertState) {
      return
    }
    this.alertState = false
    console.log(
      chalk.green(
        '#########\n' +
          '[Recovered] High traffic detected on server!\n' +
          `Metric value: ${metricValue}, \n` +
          `Threshold value: ${thresholdValue}` +
          '#########'
      )
    )
  }
}
