import { AlertHandler } from '../../src/alerts/alert-handler'
import { ConsoleLogger } from '../../src/util/console-logger'
import * as moment from 'moment'

const FIXED_DATE = new Date('2021-05-13T12:33:37.000Z')

function secondsAgo(seconds: number, date: Date): Date {
  return new Date(date.getTime() - seconds * 1000)
}

describe('Alert Handler', () => {
  const consoleLoggerSpy = ({
    error: jest.fn(),
    success: jest.fn(),
  } as unknown) as ConsoleLogger
  let alertHandler: AlertHandler
  beforeEach(() => {
    alertHandler = new AlertHandler(consoleLoggerSpy, 10, 1, 10)
  })

  describe('no alerts', () => {
    it('no logs if no traffic', () => {
      alertHandler.feed(0, secondsAgo(10, FIXED_DATE))
      expect(consoleLoggerSpy.error).not.toHaveBeenCalled()
    })

    it('no logs if traffic is below threshold', () => {
      alertHandler.feed(10, secondsAgo(30, FIXED_DATE))
      alertHandler.feed(10, secondsAgo(20, FIXED_DATE))
      alertHandler.feed(10, secondsAgo(10, FIXED_DATE))
      expect(consoleLoggerSpy.error).not.toHaveBeenCalled()
    })
  })

  describe('alerts', () => {
    it('if traffic exceeds threshold should trigger alert', () => {
      alertHandler.feed(250, secondsAgo(60, FIXED_DATE))
      alertHandler.feed(250, secondsAgo(50, FIXED_DATE))
      alertHandler.feed(250, secondsAgo(40, FIXED_DATE))
      alertHandler.feed(250, secondsAgo(30, FIXED_DATE))
      alertHandler.feed(250, secondsAgo(20, FIXED_DATE))
      alertHandler.feed(250, secondsAgo(10, FIXED_DATE))
      expect(consoleLoggerSpy.error).toHaveBeenCalled()
    })

    it('if alert recovers should trigger recovery message', () => {
      // 1500 requests for the past 2', should trigger alarm
      alertHandler.feed(1500, secondsAgo(60, FIXED_DATE))
      expect(consoleLoggerSpy.error).toHaveBeenCalled()
      expect(consoleLoggerSpy.success).not.toHaveBeenCalled()

      // Moving the time forward to have 0 requests for the past 2'
      jest
        .spyOn(Date, 'now')
        .mockImplementation(() => moment(FIXED_DATE).add(1, 'month').valueOf())

      alertHandler.feed(15, secondsAgo(50, FIXED_DATE))

      // alert should have recovered
      expect(consoleLoggerSpy.success).toHaveBeenCalled()
    })
  })
})
