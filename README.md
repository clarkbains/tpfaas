# TPFaaS (Truncated Printer Facts as a Service)

## Introduction
As a part of the Fall 2021 run of COMP 4000, Distributed Operating Systems, we optionally could design a deployment to consume @wpfindlay's printer fact API.

This is very much a joke service.
### Why?
Bandwidth is expensive. By using this TPFaaS deployment, you can get truncated printer facts, without wasting the bandwidth and truncating them in your application. This highly sought after service does come with a minimal monthly charge, (0 <= x <= 100) where x is both the monthly charge, and the maximum number of characters in each result.

NOTE: All printer facts are prefixed with "New printer fact: ", please ensure you remember this when calculating your monthly payment.

### How?
This deployment uses a simplistic Node Backend and Mongo Database for a persistent data store.

### Where?
This deployment is meant for internal cluster use, so it is only accessible from within the K8s cluster.

## Deploying
### Pre Deploying
Since the TPFaaS server is not on any container registry (Can't justify wasting anyone's storage for this Grade-A project), you will have to build it yourself. Assuming you have the same K8s cluster as me, run the following commands (After cloning and entering the cloned directory):
- `eval $(minikube docker-env)`
- `docker build -t tpfaas .`
### Actually Deploying
Run `kubectl apply -f deployment.yml`. This will create the Pods and deployments required for getting started, including the printer facts api.

## Usage
From within the K8s cluster. (A empty pod is conveniently provided so you can test this yourself, just run `kubectl exec -it printerfactsclient -- sh`), Issue the following commands. There are currently no Client Libs, so the recommended way of using this service is to set env variables, and spawn a child curl process. Here are the possible commands
### Do App Registration
Vars:
- `NAME` String: Application Name

SPAWN: `curl 'truncatedprinterfacts/api/app' -X POST -H 'Content-type: application/json' --data 
"{\"name\":\"$NAME\"}"`

RETURNS (example): `{"id":"6181defc6c9a656f9445a79c","token":"jdoayrx8jc9i60142eww8","valid":false}`
### Get App Information
Vars:
- `ID` String: Application ID

SPAWN: `curl "truncatedprinterfacts/api/app/$ID"`

RETURNS (example): `{"id":"6181defc6c9a656f9445a79c","token":"jdoayrx8jc9i60142eww8","valid":false}`

### Do App Renewal
Vars:
- `ID` String: Application ID
- `CARD` String: 16 digit card number. (16 0s will make it fail)
- `AMOUNT` Number: Monthly Cost, also maximum number of characters returned for each printer fact. 0 to 100 inclusive.

SPAWN: `curl "truncatedprinterfacts/api/app/$ID/renew" -H 'Content-Type: application/json' --data "{\"amount\":$AMOUNT, \"card\":\"$CARD\"}"`

RETURNS (example): `{"success":true,"total":10,"characters":10,"expires":"2021-12-02T01:06:53.407Z"}`

### Get Printer Fact
Vars:
- `TOKEN` String: Application Token

SPAWN: `curl "truncatedprinterfacts/api/fact?key=$TOKEN"`

RETURNS (example): `New printe`
