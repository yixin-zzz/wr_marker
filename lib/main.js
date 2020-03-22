#!/usr/bin/env node

const program = require('commander');

const { start } = require('./inquiry');

async function run() {
  await start();
}

async function main() {
  program
    .version('0.0.1')
    .command('start')
    .action(run);

  await program.parse(process.argv);
}

main();
