const { ProjectType } = require('projen');
const { awscdk } = require('projen');
const { JobPermission } = require('projen/lib/github/workflows-model');

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Sebastian Hesse',
  authorAddress: 'info@sebastianhesse.de',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  jsiiFqn: 'projen.AwsCdkConstructLibrary',
  name: 'ses-verify-identities',
  repositoryUrl: 'git@github.com:seeebiii/ses-verify-identities.git',

  /* AwsCdkConstructLibraryOptions */
  cdkVersionPinning: false,

  /* ConstructLibraryOptions */
  catalog: {
    twitter: '@seeebiii',
    announce: true,
  },

  /* JsiiProjectOptions */
  publishToMaven: {
    javaPackage: 'de.sebastianhesse.cdk.ses.verify.constructs',
    mavenGroupId: 'de.sebastianhesse.cdk-constructs',
    mavenArtifactId: 'ses-verify-identities',
  },
  publishToNuget: {
    dotNetNamespace: 'SebastianHesse.CdkConstructs',
    packageId: 'Ses.Verify.Identities',
  },
  publishToPypi: {
    distName: 'ses-verify-identities',
    module: 'ses_verify_identities',
  },

  /* NodePackageOptions */
  entrypoint: 'lib/index.js',
  homepage: 'https://github.com/seeebiii/ses-verify-identities',
  keywords: ['aws',
    'aws-cdk',
    'aws-ses',
    'cdk-construct',
    'cdk',
    'email',
    'domain',
    'SES identities',
    'SES verification'],
  license: 'MIT',
  licensed: true,
  packageName: '@seeebiii/ses-verify-identities',
  repository: 'https://github.com/seeebiii/ses-verify-identities',

  /* NodeProjectOptions */
  antitamper: false,
  copyrightOwner: 'Sebastian Hesse',
  gitignore: ['.idea'],
  jestOptions: {
    jestConfig: {
      rootDir: '.',
      roots: ['<rootDir>/test'],
    },
  },
  npmignore: ['.github'],
  releaseEveryCommit: true,
  releaseToNpm: true,
  releaseWorkflow: true,

  projectType: ProjectType.LIB,
  dependabotOptions: {
    autoMerge: true,
  },

  githubOptions: {
    mergify: false,
  },
});

const autoMerge = project.github.addWorkflow('AutoMerge');
autoMerge.on({
  pullRequest: {
    types: ['labeled', 'opened', 'reopened'],
  },
  checkSuite: {
    types: ['completed'],
  },
});
autoMerge.addJobs({
  automerge: {
    runsOn: 'ubuntu-latest',
    permissions: {
      pullRequests: JobPermission.WRITE,
      checks: JobPermission.WRITE,
      contents: JobPermission.WRITE,
    },
    steps:
        [
          {
            uses: 'actions/checkout@v2',
          },
          {
            name: 'automerge',
            uses: 'pascalgn/automerge-action@v0.13.1',
            env: {
              GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
              MERGE_LABELS: 'dependencies,!wip,!work in progress',
              MERGE_FILTER_AUTHOR: 'dependabot[bot]',
              MERGE_DELETE_BRANCH: 'true',
              MERGE_RETRY_SLEEP: '60000',
            },
          },
        ],
  },
});

project.synth();
