#!/usr/bin/env node

'use strict';

const program = require('commander');
const fs = require('fs');
const path = require('path');

const ProjectCmd = require('./project/generator').Command;

/* CLI Configuration */
program.version('0.1.0');
program.command('new [project...]').action(newProject);
program.arguments('<cmd> [options...]').action(doCommand);

program.parse(process.argv);

/* No Command Specified */
if (program.args.length === 0) { program.help(); }

/* Configuration */
function init() {

}

/* Commands */
function doCommand(cmd, options) {
    if (typeof cmd === 'undefined') {
        noCommandGiven();
    }

    if (cmd.endsWith(':generate')) {
        generate(cmd.split(':')[0]);
        return;
    }

    commandNotFound(cmd);
}

function newProject(args) {
    new ProjectCmd().execute(args);
}

function generate(type) {
    console.log('[generate] ' + type);

    checkDoygenProject();

    require('potter-' + type).run({ type: type });
}

function checkDoygenProject() {
    if(!fs.existsSync(path.join(process.cwd(), '.potter'))) {
        notDoygenProject();
    }
}

/* Errors */
function noCommandGiven() {
    console.error('No command given. For more information, use --help.');
    process.exit(1);
}

function commandNotFound(cmd) {
    console.error('Command not found: %s. For more information, use --help.', cmd);
    process.exit(1);
}

function notDoygenProject() {
    console.error('Not a Potter project.');
    process.exit(1);
}