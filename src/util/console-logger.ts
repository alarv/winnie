import * as chalk from 'chalk'

export class ConsoleLogger {
  info(msg: string) {
    // eslint-disable-next-line no-console
    console.log(msg)
  }

  success(msg: string) {
    // eslint-disable-next-line no-console
    console.log(chalk.green(msg))
  }

  warn(msg: string) {
    // eslint-disable-next-line no-console
    console.log(chalk.yellow(msg))
  }

  error(msg: string) {
    // eslint-disable-next-line no-console
    console.log(chalk.red(msg))
  }
}
