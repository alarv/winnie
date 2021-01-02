import { AlertHandler } from '../../src/alerts/alert-handler'
import * as moment from 'moment'
import { ConsoleLogger } from '../../src/util/console-logger'

function secondsAgo(seconds: number, date: Date): Date {
  return moment(date).subtract(seconds, 'seconds').toDate()
}

describe('Alert Handler', () => {
  const NOW = new Date()
  const consoleLoggerSpy = ({
    error: jest.fn(),
  } as unknown) as ConsoleLogger
  let alertHandler: AlertHandler
  beforeEach(() => {
    alertHandler = new AlertHandler(consoleLoggerSpy, 10, 1, 10)
  })

  describe('no alerts', () => {
    it('no logs if no traffic', () => {
      alertHandler.feed(0, secondsAgo(10, NOW))
      expect(consoleLoggerSpy.error).not.toHaveBeenCalled()
    })

    it('no logs if traffic is below threshold', () => {
      alertHandler.feed(10, secondsAgo(30, NOW))
      alertHandler.feed(10, secondsAgo(20, NOW))
      alertHandler.feed(10, secondsAgo(10, NOW))
      expect(consoleLoggerSpy.error).not.toHaveBeenCalled()
    })
  })

  describe('alerts', () => {
    it('if traffic exceeds threshold should trigger alert', () => {
      alertHandler.feed(250, secondsAgo(60, NOW))
      alertHandler.feed(250, secondsAgo(50, NOW))
      alertHandler.feed(250, secondsAgo(40, NOW))
      alertHandler.feed(250, secondsAgo(30, NOW))
      alertHandler.feed(250, secondsAgo(20, NOW))
      alertHandler.feed(250, secondsAgo(10, NOW))
      expect(consoleLoggerSpy.error).toHaveBeenCalled()
    })

    it('if alert recovers should trigger recovery message', () => {
      alertHandler.feed(250, secondsAgo(60, NOW))
      alertHandler.feed(250, secondsAgo(50, NOW))
      alertHandler.feed(250, secondsAgo(40, NOW))
      alertHandler.feed(250, secondsAgo(30, NOW))
      alertHandler.feed(250, secondsAgo(20, NOW))
      alertHandler.feed(250, secondsAgo(10, NOW))
      expect(consoleLoggerSpy.error).toHaveBeenCalled()
    })
  })
})
