module.exports = {
  default: {
    paths: ['tests/feature/**/*.feature'],
    require: [
      'tests/step-definitions/*.js',
      'tests/hooks/*.js',
      'utils/world.js'
    ],
    format: [
      'progress',
      'json:reports/report.json'
    ]
  }
};