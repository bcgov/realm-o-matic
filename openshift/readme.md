## Scripted OCP Installation

You can use the oc templates to create all realm-o-matic components, including backend API and frontend WEB.

### Build

```shell
# switch to tools namespace:
oc project <namespace>-tools

# edit properties file:
# - realm-o-matic-tools.properties

# build s2i image:
curl https://raw.githubusercontent.com/bcgov/s2i-caddy-nodejs/master/openshift/templates/build.yaml |
oc process -f - -p NAME=caddy-s2i-v2 |
oc apply -f -

# api build:
oc -n <namespace>-tools process -f openshift/templates/api-bc.yaml \
--param-file=openshift/realm-o-matic-tools.properties | oc -n <namespace>-tools apply -f -

# web build:
oc -n <namespace>-tools process -f openshift/templates/web-bc.yaml \
--param-file=openshift/realm-o-matic-tools.properties | oc -n <namespace>-tools apply -f -

# verify image stream created
oc get is | grep -i realm-o-matic
```

### Deploy

An example in dev namespace.

```shell
# switch to deployment namespace:
oc project <namespace>-dev

# edit properties file:
# - realm-o-matic-dev.properties

# Create a copy of the SSL Certificate if needed:
# - ./openshift/certificate.pem
# - ./openshift/ca.pem
# - ./openshift/key.pem

# create local images, secrets and confimaps:
# - please note that secret values should be obtained from existing secrets
oc process --ignore-unknown-parameters=true \
-f openshift/templates/prep.yaml \
--param-file=openshift/realm-o-matic-dev.properties | oc apply -f -

# copy built image from tools namespace:
# - please note that our dc is using local image atm, that's why we need to have a copy
oc tag <namespace>-tools/realm-o-matic-api:<version> realm-o-matic-api:<version>
oc tag <namespace>-tools/realm-o-matic-web-static:<version> realm-o-matic-web-static:<version>

# deploy api:
oc process --ignore-unknown-parameters=true \
-f openshift/templates/api-dc.yaml \
-p TLS_CERT_PEM="$(cat ./openshift/certificate.pem)" -p TLS_KEY_PEM="$(cat ./openshift/key.pem)" -p TLS_CACERT_PEM="$(cat ./openshift/ca.pem)" \
--param-file=openshift/realm-o-matic-dev.properties | oc apply -f -

# deploy web:
oc process --ignore-unknown-parameters=true \
-f openshift/templates/web-dc.yaml \
-p TLS_CERT_PEM="$(cat ./openshift/certificate.pem)" -p TLS_KEY_PEM="$(cat ./openshift/key.pem)" -p TLS_CACERT_PEM="$(cat ./openshift/ca.pem)" \
--param-file=openshift/realm-o-matic-dev.properties | oc apply -f -

# wait for dc to spin up
```
