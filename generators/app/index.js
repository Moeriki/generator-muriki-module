'use strict';

const path = require('path');

const chalk = require('chalk');
const promptName = require('inquirer-npm-name');
const yeoman = require('yeoman-generator');
const yosay = require('yosay');

module.exports = yeoman.Base.extend({

  _copyFile(filename) {
    this.fs.copyTpl(
      this.templatePath(filename),
      this.destinationPath(filename),
      this.answers
    );
  },

  templates: [
    '__test__/.eslintrc.js',
    'lib/index.js',
    '.editorconfig',
    '.eslintrc.js',
    '.gitignore',
    '.npmignore',
    '.npmrc',
    '.travis.yml',
    'index.js',
    'LICENSE',
    'README.md',
  ],

  // initializing - Your initialization methods (checking current project state, getting configs, etc)
  initializing() {
    this.log(yosay(
      `Welcome to the luminous ${chalk.red('muriki-module')} generator!`
    ));
  },

  // prompting - Where you prompt users for options (where you'd call this.prompt())
  prompting() {
    this.answers = {};

    return promptName({
      name: 'name',
      message: 'Module name',
    }, this).then((answers) => {
      Object.assign(this.answers, answers);
      this.destinationRoot(path.join(this.env.cwd, `node-${answers.name}`));

      return this.prompt([
        {
          name: 'description',
          message: 'Description',
        },
        {
          name: 'keywords',
          message: 'Keywords',
          filter(keywords) {
            return keywords.split(',')
              .map((keyword) => keyword.trim())
              .filter((keyword) => keyword !== '');
          },
        },
        {
          name: 'repository',
          message: 'Repository',
        },
      ]).then((moreAnswers) => {
        Object.assign(this.answers, moreAnswers);
      });
    });
  },

  // configuring - Saving configurations and configure the project (creating .editorconfig files and other metadata files)

  // default - If the method name doesn't match a priority, it will be pushed to this group.

  // writing - Where you write the generator specific files (routes, controllers, etc)
  writing() {
    this.templates.forEach((filename) => {
      this._copyFile(filename);
    });

    this.fs.writeJSON(
      this.destinationPath('package.json'),
      Object.assign(
        this.fs.readJSON(this.templatePath('package.json')),
        {
          name: this.answers.name,
          description: this.answers.description,
          keywords: this.answers.keywords,
          repository: this.answers.repository,
        }
      )
    );
  },

  // conflicts - Where conflicts are handled (used internally)

  // install - Where installation are run (npm, bower)
  install() {
    this.npmInstall();
  },

  // end - Called last, cleanup, say good bye, etc

});
