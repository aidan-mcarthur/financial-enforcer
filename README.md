# Financial Enforcer
A companion tool to ensure that you save and submit your FinancialForce timecard.

# Local Development

## Requirements 

Node >= v18

## Extension Setup

```bash
$ git clone https://github.com/FinancialEnforcer/financial-enforcer.git
$ cd financial-enforcer/extension
$ npm install
$ npm run build
```

Then simply load the `dist` directory as an [unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked)

## Testing

The extension uses [Jest](https://jestjs.io/) for its test suite.

```bash
$ cd financial-enforcer/extension
$ npm run test
```
