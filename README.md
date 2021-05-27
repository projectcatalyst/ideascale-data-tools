## Overview

A simple wrapper of the Ideascale API to provide a set of endpoints that the community can use.

## Objectives

- Remove sensitive data - The main reason this wrapper has been created is to remove any sensitive data that would be a privacy or regulatory concern
- Minimal data changes - The wrapper API should only expose sensible data to the community and also only remove personal or other sensitive information. Data is not sanitised or standardised in anyway. Wherever possible all data is an exact copy of the Ideascale API responses.
- Simple implementation - Implementation should be kept simple to allow for the community to easily contribute and maintain the wrapper API.
- Easy deployment and maintenance - The wrapper API should be easy to deploy and maintain. Serverless is currently being used for its simple deployment CLI commands along with next to zero maintenance and availability concerns due to it being dealt with by the cloud provider.

## Limitations 

- Speed - Implementation has been made to run on Serverless functions meaning they require a cold start when they haven't been recently used. Due to the speed it is not as well suited for a live data source used in a dynamic website. Instead the API is meant for giving access to the data to the community that they can then copy to their own database or statically host
- Security assumptions - It is assumed that Ideascale will version their API and not add in extra attributes to the v1 endpoints that would reveal sensitive information

## Deployment

- Run - yarn install
- Get a API token from IdeaScale and place that into a config.dev.json or config.prod.json file in the root of the project
- Setup [AWS config profile](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/configure/index.html) and set the profile name in the package.json command or apply the profile in a CLI command yourself
- Run - yarn deploy-dev OR yarn deploy-prod