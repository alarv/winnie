Winnie
======
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![License](https://img.shields.io/npm/l/winnie.svg)](https://github.com/alarv/winnie/blob/master/package.json)

![Winnie](assets/winnie.png)

Winnie is the result of a CLI assignment for consuming an actively written-to CLF HTTP access log, implemented by Alex Arvanitidis. Its name was inspired by Winnie the pooh looking into the honey pot, as this program is looking into the access logs of a webserver.  

<!-- toc -->
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Usage](#usage)
<!-- tocstop -->

# Prerequisites
```node >= 10```

```npm```

# Installation
```sh-session
$ npm install
installs all dependencies
$ npm install -g
to create the command `winnielog` in your local bin
```
# Usage
Run the --help command to see all the available arguments

<!-- usage -->
```sh-session
$ winnielog --help
USAGE
$ winnielog --version
winnielog/1.0.0 darwin-x64 node-v10.15.0
...
```
<!-- usagestop -->



# Sample output of command
```sh-session
$ winnielog
===================================================
[Sat Jan 02 2021 18:50:33 GMT+0200] current stats report for the past 10s:
Hits by request method: 
┌────────┬──────┐
│ Method │ Hits │
├────────┼──────┤
│ PUT    │ 152  │
├────────┼──────┤
│ POST   │ 141  │
├────────┼──────┤
│ HEAD   │ 149  │
├────────┼──────┤
│ DELETE │ 149  │
├────────┼──────┤
│ PATCH  │ 134  │
├────────┼──────┤
│ GET    │ 129  │
└────────┴──────┘
Top 10 sections of the web site with the most hits:
┌────┬──────────────┬──────┐
│ #  │ Section      │ Hits │
├────┼──────────────┼──────┤
│ 1  │ e-business   │ 14   │
├────┼──────────────┼──────┤
│ 2  │ applications │ 12   │
├────┼──────────────┼──────┤
│ 3  │ experiences  │ 11   │
├────┼──────────────┼──────┤
│ 4  │ one-to-one   │ 11   │
├────┼──────────────┼──────┤
│ 5  │ harness      │ 9    │
├────┼──────────────┼──────┤
│ 6  │ paradigms    │ 9    │
├────┼──────────────┼──────┤
│ 7  │ vertical     │ 9    │
├────┼──────────────┼──────┤
│ 8  │ partnerships │ 9    │
├────┼──────────────┼──────┤
│ 9  │ benchmark    │ 9    │
├────┼──────────────┼──────┤
│ 10 │ platforms    │ 9    │
└────┴──────────────┴──────┘
Total requests served: 854
Average requests/s for the past 10s: 85.4
```

