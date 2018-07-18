#!/usr/bin/env node

'use strict';

const program = require('commander');
const fs = require('fs');
const path = require('path');

const ProjectCmd = require('./project/generator').Command;
const InstallerCmd = require('./installer/generator').Command;

/* CLI Configuration */
program.version('0.1.5');
program.command('new [project...]').action(newProject);
program.command('install [generator...]').action(installGenerator);
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

function installGenerator(args) {
    new InstallerCmd().execute(args);
}

function generate(type) {
    console.log('[generate] ' + type);

    checkPotterProject();

    require(path.resolve(process.env.HOME, '.potter/potter-' + type + '/lib/generator')).run({ type: type });
}

function checkPotterProject() {
    if(!fs.existsSync(path.join(process.cwd(), '.potter'))) {
        notPotterProject();
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

function notPotterProject() {
    console.error('Not a Potter project.');
    process.exit(1);
}