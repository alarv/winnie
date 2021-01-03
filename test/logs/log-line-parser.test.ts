import { LogLineParser } from '../../src/logs/log-line-parser'
import { TrafficData } from '../../src/types/traffic-data'

interface LogLineParserCase {
  line: string
  expectedTrafficData: TrafficData
}

const cases: Array<LogLineParserCase> = [
  {
    line:
      '127.0.0.1 user-identifier frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326',
    expectedTrafficData: {
      client: '127.0.0.1',
      date: new Date('2000-10-10T20:55:36.000Z'),
      method: 'GET',
      request: '/apache_pb.gif',
      size: 2326,
      status: 200,
      userId: 'frank',
    },
  },
  {
    line:
      '125.125.125.125 - dsmith [10/Oct/1999:21:15:05 +0500] "GET /index.html HTTP/1.0" 200 1043',
    expectedTrafficData: {
      client: '125.125.125.125',
      date: new Date('1999-10-10T16:15:05.000Z'),
      method: 'GET',
      request: '/index.html',
      size: 1043,
      status: 200,
      userId: 'dsmith',
    },
  },
  {
    line:
      '127.0.0.1 - james [09/May/2018:16:00:39 +0000] "GET /report HTTP/1.0" 200 123',
    expectedTrafficData: {
      client: '127.0.0.1',
      date: new Date('2018-05-09T16:00:39.000Z'),
      method: 'GET',
      request: '/report',
      size: 123,
      status: 200,
      userId: 'james',
    },
  },
  {
    line:
      '127.0.0.1 - jill [09/May/2018:16:00:41 +0000] "GET /api/user HTTP/1.0" 200 234',
    expectedTrafficData: {
      client: '127.0.0.1',
      date: new Date('2018-05-09T16:00:41.000Z'),
      method: 'GET',
      request: '/api/user',
      size: 234,
      status: 200,
      userId: 'jill',
    },
  },
  {
    line:
      '127.0.0.1 - frank [09/May/2018:16:00:42 +0000] "POST /api/user HTTP/1.0" 200 34',
    expectedTrafficData: {
      client: '127.0.0.1',
      date: new Date('2018-05-09T16:00:42.000Z'),
      method: 'POST',
      request: '/api/user',
      size: 34,
      status: 200,
      userId: 'frank',
    },
  },
  {
    line:
      '127.0.0.1 - mary [09/May/2018:16:00:42 +0000] "POST /api/user HTTP/1.0" 503 12',
    expectedTrafficData: {
      client: '127.0.0.1',
      date: new Date('2018-05-09T16:00:42.000Z'),
      method: 'POST',
      request: '/api/user',
      size: 12,
      status: 503,
      userId: 'mary',
    },
  },
]

describe('Log line parser', () => {
  let logLineParser: LogLineParser
  beforeEach(() => {
    logLineParser = new LogLineParser()
  })

  test.each(
    cases.map((testCase) => [testCase.line, testCase.expectedTrafficData])
  )(
    'Given line %s should return expected data',
    (line, expectedTrafficData) => {
      const trafficData: TrafficData = logLineParser.parse(line as string)
      expect(trafficData).toEqual(expectedTrafficData)
    }
  )
})
