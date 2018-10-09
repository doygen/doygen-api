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
program.command('build [type...]').action(cmdBuild);
program.command('generate [type...]').action(cmdGenerate);
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

    commandNotFound(cmd);
}

function newProject(args) {
    new ProjectCmd().execute(args);
}

function installGenerator(args) {
    new InstallerCmd().execute(args);
}

function cmdBuild(args) {
    build(args[0]);
}

function build(type) {
    console.log('[build] ' + type);

    checkPotterProject();

    getGenerator(type).build({ type: type });
}

function cmdGenerate(args) {
    generate(args[0]);
}

function generate(type) {
    console.log('[generate] ' + type);

    checkPotterProject();

    getGenerator(type).run({ type: type });
}

function getGenerator(type) {
    return require(path.resolve(process.env.HOME, '.potter/potter-' + type + '/lib/generator'));
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