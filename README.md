# microservices-benchmark

Benchmark of microservices frameworks for NodeJS.

## Frameworks in benchmark

| Package                                                   | Version |
| --------------------------------------------------------- | ------- |
| [MicroWizard](https://github.com/WizardTales/MicroWizard) | 1.1.1   |
| [Seneca](https://github.com/senecajs/seneca)              | 3.37.0  |
| [Hemera](https://github.com/hemerajs/hemera)              | 5.8.6   |
| [Nanoservices](https://github.com/SuperID/nanoservices)   | 0.0.11  |
| [Moleculer](https://github.com/ice-services/moleculer)    | 0.13.0  |

### Result

See https://github.com/WizardTales/MicroWizard?tab=readme-ov-file#benchmarks

## Run benchmark

Install dependencies

```
$ npm install
```

or

```
$ yarn
```

> For remote test need to install a [NATS](http://nats.io/) server too.
> You may also use Docker container version of this benchmark.

Start nats server (`gnatsd`) and

```
$ npm run bench local
$ npm run bench remote
```

### Docker container version

If you don't want to have unneeded dependencies and software on your local computer,
you may use Docker to set-up "virtual containers" with this benchmark.

#### Prerequisities

You need to have [Docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/install/) installed.

#### Starting benchmark

Simply run `docker-compose up` command, so:

- NATS server will be set-up
- All dependencies will be installed
- Benchmark results will be visible in your terminal
