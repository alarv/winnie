import { Command, flags } from '@oclif/command'
import { LogReader } from './logs/log-reader'
import * as figlet from 'figlet'
import * as chalk from 'chalk'

class Winnie extends Command {
  static description =
    'A CLI (command-line interface) to track traffic based on a Common Log Format file.'

  static flags = {
    version: flags.version(),
    help: flags.help({ char: 'h' }),
    file: flags.string({
      char: 'f',
      description: 'the path to the log file to monitor e.g. /tmp/access.log',
      default: '/tmp/access.log',
    }),
    verbose: flags.boolean({
      char: 'v',
      description:
        'if should contain the verbose output of info/warning/errors that may have occurred',
    }),
    statsIntervalSeconds: flags.integer({
      char: 'i',
      description:
        'the interval during which to show traffic stats (in seconds)',
      default: 10,
    }),
    alertIntervalMinutes: flags.integer({
      char: 'a',
      description:
        'the alert interval window during which to check if traffic is as expected (in minutes)',
      default: 2,
    }),
    requestsThreshold: flags.integer({
      char: 'r',
      description:
        'the requests per second threshold to consider for the high traffic alert',
      default: 10,
    }),
  }

  static args = []

  async run() {
    const { flags } = this.parse(Winnie)

    console.log(chalk.yellow(figlet.textSync('Winnie')))
    console.log('\n' + chalk.blue(Winnie.description))

    const logReader = new LogReader(flags.file)
    logReader.start({
      trafficAnalyzerIntervalSeconds: flags.statsIntervalSeconds,
      requestsThreshold: flags.requestsThreshold,
      alertIntervalMinutes: flags.alertIntervalMinutes,
      verbose: flags.verbose,
    })
  }
}

export = Winnie
