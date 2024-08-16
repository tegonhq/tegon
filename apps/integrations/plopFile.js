'use strict';

const path = require('path');

const getSuccessMessage = function (
  integrationName,
  outputPath,
  additionalMessage,
) {
  return `
🚀 🚀 🚀 🚀 🚀 🚀

Success! 

Your ${integrationName} integration has been created at .${path.resolve(
    outputPath,
  )}.

Follow the TODOs in the generated module to implement your integration. 

Questions, comments, or concerns? Let us know in our github:
https://github.com/tegonhq/tegon/issues

We're always happy to provide any support!

${additionalMessage || ''}
`;
};

module.exports = function (plop) {
  const basePath = './base';

  const integrationOutput = `./{{snakeCase name}}`;

  plop.setActionType('emitSuccess', function (answers, config, plopApi) {
    console.log(
      getSuccessMessage(
        answers.name,
        plopApi.renderString(config.outputPath, answers),
        config.message,
      ),
    );
  });

  plop.setGenerator('Integration', {
    description:
      'Generate a Integration that has authentication specification.',
    prompts: [
      { type: 'input', name: 'name', message: 'Integration name e.g: "jira"' },
    ],
    actions: [
      {
        abortOnFail: true,
        type: 'addMany',
        destination: integrationOutput,
        base: basePath,
        templateFiles: `./base/**/**`,
      },

      { type: 'emitSuccess', outputPath: integrationOutput },
    ],
  });
};
