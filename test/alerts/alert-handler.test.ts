import { AlertHandler } from '../../src/alerts/alert-handler'
import { ConsoleLogger } from '../../src/util/console-logger'
import * as moment from 'moment'

const FIXED_DATE = new Date('2021-05-13T12:33:37.000Z')

function secondsAgo(seconds: number, date: Date): Date {
  return moment(date).subtract(seconds, 'seconds').toDate()
}

describe('Alert Handler', () => {
  const consoleLoggerSpy = ({
    error: jest.fn(),
    success: jest.fn(),
  } as unknown) as ConsoleLogger
  let alertHandler: AlertHandler

  beforeEach(() => {
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => moment(FIXED_DATE).valueOf())
  })

  describe('should show no alerts', () => {
    beforeEach(() => {
      alertHandler = new AlertHandler(consoleLoggerSpy, 10, 1, 10)
    })

    it('no alerts if no traffic', () => {
      alertHandler.feed(0, secondsAgo(10, FIXED_DATE))
      expect(consoleLoggerSpy.error).not.toHaveBeenCalled()
    })

    it('no alerts if traffic is below threshold', () => {
      alertHandler.feed(10, secondsAgo(30, FIXED_DATE))
      alertHandler.feed(10, secondsAgo(20, FIXED_DATE))
      alertHandler.feed(10, secondsAgo(10, FIXED_DATE))
      expect(consoleLoggerSpy.error).not.toHaveBeenCalled()
    })
  })

  describe('should show alerts', () => {
    beforeEach(() => {
      alertHandler = new AlertHandler(consoleLoggerSpy, 10, 2, 10)
    })

    afterEach(jest.clearAllMocks)

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

  describe('should show alerts on marginal cases', () => {
    beforeEach(() => {
      alertHandler = new AlertHandler(consoleLoggerSpy, 10, 1, 5)
    })

    it('if traffic exceeds threshold should trigger alert', () => {
      // current date 2 minutes ago
      jest
        .spyOn(Date, 'now')
        .mockImplementation(() =>
          moment(FIXED_DATE).subtract(2, 'minute').valueOf()
        )

      alertHandler.feed(50, secondsAgo(180, FIXED_DATE))
      expect(consoleLoggerSpy.error).not.toHaveBeenCalled()
      alertHandler.feed(50, secondsAgo(170, FIXED_DATE))
      expect(consoleLoggerSpy.error).not.toHaveBeenCalled()
      alertHandler.feed(50, secondsAgo(160, FIXED_DATE))
      expect(consoleLoggerSpy.error).not.toHaveBeenCalled()
      alertHandler.feed(50, secondsAgo(150, FIXED_DATE))
      expect(consoleLoggerSpy.error).not.toHaveBeenCalled()
      alertHandler.feed(50, secondsAgo(140, FIXED_DATE))
      expect(consoleLoggerSpy.error).not.toHaveBeenCalled()
      alertHandler.feed(50, secondsAgo(130, FIXED_DATE))
      expect(consoleLoggerSpy.error).not.toHaveBeenCalled()

      jest.clearAllMocks()
      // current date 1 minute ago
      jest
        .spyOn(Date, 'now')
        .mockImplementation(() =>
          moment(FIXED_DATE).subtract(1, 'minute').valueOf()
        )

      alertHandler.feed(100, secondsAgo(120, FIXED_DATE))
      expect(consoleLoggerSpy.error).not.toHaveBeenCalled()
      alertHandler.feed(100, secondsAgo(110, FIXED_DATE))
      expect(consoleLoggerSpy.error).not.toHaveBeenCalled()
      alertHandler.feed(100, secondsAgo(100, FIXED_DATE))
      expect(consoleLoggerSpy.error).not.toHaveBeenCalled()
      alertHandler.feed(50, secondsAgo(90, FIXED_DATE))
      // below is the point where alert should be triggered, 350 requests in 1'
      // which means 5,8 requests/s while threshold is 5
      expect(consoleLoggerSpy.error).toHaveBeenCalled()
      alertHandler.feed(50, secondsAgo(80, FIXED_DATE))
      expect(consoleLoggerSpy.error).toHaveBeenCalled()
      alertHandler.feed(50, secondsAgo(70, FIXED_DATE))
      expect(consoleLoggerSpy.error).toHaveBeenCalled()
      alertHandler.feed(50, secondsAgo(60, FIXED_DATE))
      expect(consoleLoggerSpy.error).toHaveBeenCalled()

      jest.clearAllMocks()
      // current date now
      jest
        .spyOn(Date, 'now')
        .mockImplementation(() => moment(FIXED_DATE).valueOf())

      alertHandler.feed(50, secondsAgo(50, FIXED_DATE))
      expect(consoleLoggerSpy.success).toHaveBeenCalled() // point where alert should recover
      expect(consoleLoggerSpy.error).not.toHaveBeenCalled()
      alertHandler.feed(50, secondsAgo(40, FIXED_DATE))
      expect(consoleLoggerSpy.error).not.toHaveBeenCalled()
      alertHandler.feed(50, secondsAgo(30, FIXED_DATE))
      expect(consoleLoggerSpy.error).not.toHaveBeenCalled()
      alertHandler.feed(50, secondsAgo(20, FIXED_DATE))
      expect(consoleLoggerSpy.error).not.toHaveBeenCalled()
      alertHandler.feed(50, secondsAgo(10, FIXED_DATE))
      expect(consoleLoggerSpy.error).not.toHaveBeenCalled()
    })
  })
})
