# Self-service App for KeyCloak Realm Provisioning

## Background:
Keycloak Single-Sign On service is provided to BC Gov projects. When project teams integrate Keycloak SSO with the application, they request for their own `realm` in our Keycloak instances. As a standard, three realms will be created for the three project environments `dev`, `test` and `prod`. The realms are created with the requested Identity Provider (IDP), GitHub, IDIR and BCeID. Among the IDPs, BCeID requires an approval process, which involves form filling and communication between teams. There comes the idea of automating the realm creation and IDP approval process.

## Application Overview:
![Alt Text](overview.png)

This repo covers Realm-O-Matic, frontend and backend.
You could find the other components:
- Realm Creator (Realm-o-Matic-Ansible) [here](https://github.com/BCDevOps/keycloak-admin/tree/master/keycloak_realm_builder)
- BCGov SSO KeyCloak [here](https://github.com/bcgov/ocp-sso)

## Project Details
This application contains:
- web frontend in React
- api backend in Nodejs Express
- record management with a private GitHub repository
- authenticated via BCGov SSO Keycloak

## Preparation Setup:

### A GitHub Repository for Database:
- brand new GitHub repo in an organization that you have access to, ideally private and limited access
- personal access token with `repo` and `user` access
- a GitHub repo webhook:
  - payload sending to `<app_url>/api/v1/ghwh/pr`
  - triggers via `Pull Request` events
- GitHub labels for different request status:
  - request-ready
  - request-failed
  - realm-created
  - bceid-requested
  - bceid-approved
  - bceid-rejected
  - bceid-enabled

### Frontend:
- KeyCloak client for authentication

### Backend:
- KeyCloak client for authentication
- config to use the GitHub repo
- email server for notifications

### Realm Creator (Realm-o-Matic-Ansible):
There is an Ansible Playbook that provisions the KeyCloak resources. Realm-o-matic does not work directly with the Ansible Playbook, the automation provisioning is only triggered via GitHub repo events. See here for details https://github.com/BCDevOps/keycloak-admin/tree/master/keycloak_realm_builder


## Application Local Development
1. Prerequisites: npm, docker and docker-compose, ngrok

2. Install project dependencies:
```shell
# npm install for both /api and /web directories
cd api/
npm i

cd web/
npm i

cd ..
```

3. Setup environment variables from sample env file, and copy to both /api and /web directories
```shell
cp .env.sample .env
# fill in env var and secrets
cp .env api/.env
cp .env web/.env
```

4. Docker deploy using the `docker-compose.yaml`
run `docker-compose up --build` at the root level of the repo 

5. Expose frontend localhost with ngrok `npx ngrok http 3000`

6. Add the ngrok url to Keycloak client's valid redirect uris to enable authentication
