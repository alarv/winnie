import moment = require('moment')
import { TrafficData } from '../types/traffic-data'

const STRFTIME_FORMAT = 'DD/MMMM/YYYY:HH:mm:ss Z'

export class LogLineParser {
  private readonly CLF_REGEX: RegExp = new RegExp(
    /^(?<client>\S+)\s\S+\s(?<userid>\S+)\s\[(?<datetime>[^\]]+)]\s"(?<method>[A-Z]+)\s(?<request>[^\s"]+)?\sHTTP\/[0-9.]+"\s(?<status>\d{3})\s(?<size>\d+|-)/
  )

  parse(line: string): TrafficData {
    const regex = line.match(this.CLF_REGEX)
    if (!regex) {
      throw new Error(`Current line with content ${line} could not be parsed.`)
    }
    return LogLineParser.parseGroups(regex.groups)
  }

  private static parseGroups(groups: any): TrafficData {
    return {
      client: LogLineParser.getEntryDataOrNull(groups.client),
      date: LogLineParser.parseDate(
        LogLineParser.getEntryDataOrNull(groups.datetime)
      ),
      method: groups.method,
      request: groups.request,
      size: parseInt(groups.size, 10),
      status: parseInt(groups.status, 10),
      userId: LogLineParser.getEntryDataOrNull(groups.userid),
    }
  }

  private static parseDate(date: string | null): Date | null {
    if (!date) {
      return null
    }

    return moment(date, STRFTIME_FORMAT).toDate() // %d/%b/%Y:%H:%M:%S %z;
  }

  private static getEntryDataOrNull(entryData: string): string | null {
    return entryData === '-' ? null : entryData
  }
}
