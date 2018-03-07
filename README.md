# OVH Manager Dedicated

![ovh-manager-web-dedicated](https://user-images.githubusercontent.com/428384/36022099-219b3188-0d88-11e8-9bae-31d593e67e76.png)

> OVH Control Panel Dedicated UI

## Install

### Requirements

* You must have `nodejs` with `npm` installed.
* You must have `yarn` >= 1.0 [https://yarnpkg.com/en/docs/install](https://yarnpkg.com/en/docs/install)
* You must have `grunt` installed (`npm install -g grunt-cli`)

### Install dependencies

```bash
make install
```

## Run in development mode

First you have to activate the developer mode in the [Manager V6](https://www.ovh.com/manager/dedicated/#/useraccount/advanced).

### Generate your certificates

To be able to run manager in dev mode using http2.

```bash
make gen-certificate
```

If you want, you can also generate a certificate by hand:

```bash
mkdir -p server/certificate
openssl genrsa -des3 -out server/certificate/server.key 1024
openssl req -new -key server/certificate/server.key -out server/certificate/server.csr
cp server/certificate/server.key server/certificate/server.key.tmp
openssl rsa -in server/certificate/server.key.tmp -out server/certificate/server.key
openssl x509 -req -days 365 -in server/certificate/server.csr -signkey server/certificate/server.key -out server/certificate/server.crt
rm server/certificate/server.key.tmp
```

A full guide can be found for example [here](https://www.akadia.com/services/ssh_test_certificate.html).

### Launch the manager

```bash
make dev
```

The manager is running on [https://localhost:9000](https://localhost:9000)

And start developing.

## Related links

 * Contribute: https://github.com/ovh-ux/ovh-ux-guidelines/blob/master/.github/CONTRIBUTING.md
 * Report bugs: https://github.com/ovh-ux/ovh-manager-dedicated/issues

## License

See https://github.com/ovh-ux/ovh-manager-dedicated/blob/master/LICENSE
