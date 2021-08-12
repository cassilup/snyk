export = showDeps;

import * as Debug from 'debug';
const cloneDeep = require('lodash.clonedeep');
const assign = require('lodash.assign');
import chalk from 'chalk';
const detect = require('../../../lib/detect');

import * as snyk from '../../../lib';
import { Options, TestOptions } from '../../../lib/types';
import { MethodArgs } from '../../args';
import { TestCommandResult } from '../../commands/types';
import { LegacyVulnApiResult, TestResult } from '../../../lib/snyk-test/legacy';

import * as utils from '../test/utils';
import {
  createErrorMappedResultsForJsonOutput,
  extractDataToSendFromResults,
} from '../../../lib/formatters/test/format-test-results';

import { setDefaultTestOptions } from '../test/set-default-test-options';
import { processCommandArgs } from '../process-command-args';
import { formatTestError } from '../test/format-test-error';
import { displayResult } from '../../../lib/formatters/test/display-result';
import { getDepsFromPlugin } from '../../../lib/plugins/get-deps-from-plugin';

const debug = Debug('snyk-test');
const SEPARATOR = '\n-------------------------------------------------------\n';

// TODO: avoid using `as any` whenever it's possible

async function showDeps(...args: MethodArgs): Promise<TestCommandResult> {

  const { options: originalOptions, paths } = processCommandArgs(...args);
  const options = setDefaultTestOptions(originalOptions);

  const resultOptions: Array<Options & TestOptions> = [];
  const results = [] as any[];

  // Create a copy of the options so a specific test can
  // modify them i.e. add `options.file` etc. We'll need
  // these options later.
  const testOpts = cloneDeep(options);
  const path = paths[0];
  testOpts.path = path;
  testOpts.projectName = testOpts['project-name'];
  testOpts.packageManager = detect.detectPackageManager(path, options);

  let deps;

  try {
    // res = await snyk.test(path, testOpts);
    deps = await getDepsFromPlugin(path, testOpts);
    console.log('deps!!', deps.scannedProjects.map((e) => e.depTree));
  } catch (error) {
    deps = formatTestError(error);
  }

  return TestCommandResult.createHumanReadableTestCommandResult(
    deps, "", ""
  );
}
