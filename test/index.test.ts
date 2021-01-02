import { expect, test } from '@oclif/test'

import cmd = require('../src')

describe('winnie', () => {
  test
    .stdout()
    .do(() => cmd.run(['--help']))
    .it('runs help menu', (ctx) => {
      expect(ctx.stdout).to.contain('USAGE')
      expect(ctx.stdout).to.contain('OPTIONS')
    })
})
