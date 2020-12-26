import { Command, flags } from "@oclif/command";
import { LogReader } from "./log-reader";

class Winnie extends Command {
  static description = "describe the command here";

  static flags = {
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    file: flags.string({
      char: "f",
      description: "the log file to monitor",
      default: "/tmp/access.log",
    }),
    statsInterval: flags.integer({
      char: "i",
      description:
        "the interval during which to show traffic stats (in seconds)",
      default: 10,
    }),
  };

  static args = [];

  async run() {
    const { flags } = this.parse(Winnie);

    const logReader = new LogReader(flags.file);
    logReader.start(flags.statsInterval);
  }
}

export = Winnie;
