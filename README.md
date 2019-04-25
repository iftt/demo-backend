# demo-backend [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## About

This is an example implementation of services and devices on the IOTA network using a weather station, FPGA, and a garage door opener. The IOTA network is still a young protocol with a lot of room for interpretation on how to best utilize it. While there have been attempts to market data for financial gain, I believe the more practical application lies in the sale of IoT devices with an ASIC POW chip to talk on the IOTA network effortlessly.

This demo server is essentially a means of managing devices and how they interact with the IOTA tangle.

## Install
```sh
# yarn
yarn add @iftt/demo-backend
# npm
npm i --save @iftt/demo-backend
```

## How to use

### Create Environment file
create a file called `.env` with these keys and replacing the variables:
```
PORT=3001
JWT_SECRET=m7ugp0jKc4RoRJvXtnCJrETheIRZENay
JWT_EXPIRES=15d
WEATHER_API=00000000bec84a09aa12094c4b3eac071c733dbc80834fc5a8d02fe840000000
WEATHER_APP_API=000000005ac24e28a5d6f76bb4b710c4fa5c76f1129b4002905afe31c0000000
WEATHER_TANGLE_SEED=I9XZHZETFFDYRWISYGGONGSULUTERQXQYZRALTNXWXQMRIORUSTTCKJVYNHCBWKGSDVEKIBXMQMOJKPQBX
```

#### How to generate a unique JWT secret
```sh
# Linux
cat /dev/urandom |tr -dc a-zA-Z0-9|head -c${1:-32}
# OS X
cat /dev/urandom |LC_ALL=C tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1
```

#### How to generate a unique IOTA seed
```sh
# Linux
cat /dev/urandom |tr -dc A-Z9|head -c${1:-81}
# OS X
cat /dev/urandom |LC_ALL=C tr -dc 'A-Z9' | fold -w 81 | head -n 1
```

### Create the NodeJS server

#### Option 1: download this repository and run from the lib
```sh
# clone the repo
git clone https://github.com/iftt/demo-backend.git
# install dependences
yarn # or npm install
# run the server
yarn run runServer  # npm run runServer
```

#### Option 2: install the npm package and run
After installing the package, create a JS file and input the following
```js
// ES6
import '@iftt/demo-backend'
// ES5
require('@iftt/demo-backend')
```

## Modules

These are some of the main modules that make up the IFTT project:

| module | tests | version | description |
|---|---|---|---|
| **[demo-backend][demo-backend]** | [![][demo-backend-ti]][demo-backend-tu] | [![][demo-backend-ni]][demo-backend-nu] | **IFTT Server (this module)**
| [tryte-encode-decode][tryte-encode-decode] | [![][tryte-encode-decode-ti]][tryte-encode-decode-tu] | [![][tryte-encode-decode-ni]][tryte-encode-decode-nu] | data<-->trytes
| [tryte-buffer][tryte-buffer] | [![][tryte-buffer-ti]][tryte-buffer-tu] | [![][tryte-buffer-ni]][tryte-buffer-nu] | json<-->Trytes
| [program-generator][program-generator] | [![][program-generator-ti]][program-generator-tu] | [![][program-generator-ni]][program-generator-nu] | create programs from user defined json
| [icc-fpga-protocol][icc-fpga-protocol] | [![][icc-fpga-protocol-ti]][icc-fpga-protocol-tu] | [![][icc-fpga-protocol-ni]][icc-fpga-protocol-nu] | POW with an fpga device
| [garage-client][garage-client] | [![][garage-client-ti]][garage-client-tu] | [![][garage-client-ni]][garage-client-nu] | open/close garage with IOTA tangle

[demo-backend]: https://github.com/iftt/demo-backend
[demo-backend-ti]: https://travis-ci.org/iftt/demo-backend.svg?branch=master
[demo-backend-tu]: https://travis-ci.org/iftt/demo-backend
[demo-backend-ni]: https://img.shields.io/npm/v/@iftt/demo-backend.svg
[demo-backend-nu]: https://npmjs.org/package/@iftt/demo-backend

[tryte-encode-decode]: https://github.com/iftt/tryte-encode-decode
[tryte-encode-decode-ti]: https://travis-ci.org/iftt/tryte-encode-decode.svg?branch=master
[tryte-encode-decode-tu]: https://travis-ci.org/iftt/tryte-encode-decode
[tryte-encode-decode-ni]: https://img.shields.io/npm/v/@iftt/tryte-encode-decode.svg
[tryte-encode-decode-nu]: https://npmjs.org/package/@iftt/tryte-encode-decode

[tryte-buffer]: https://github.com/iftt/tryte-buffer
[tryte-buffer-ti]: https://travis-ci.org/iftt/tryte-buffer.svg?branch=master
[tryte-buffer-tu]: https://travis-ci.org/iftt/tryte-buffer
[tryte-buffer-ni]: https://img.shields.io/npm/v/@iftt/tryte-buffer.svg
[tryte-buffer-nu]: https://npmjs.org/package/@iftt/tryte-buffer

[program-generator]: https://github.com/iftt/program-generator
[program-generator-ti]: https://travis-ci.org/iftt/program-generator.svg?branch=master
[program-generator-tu]: https://travis-ci.org/iftt/program-generator
[program-generator-ni]: https://img.shields.io/npm/v/@iftt/program-generator.svg
[program-generator-nu]: https://npmjs.org/package/@iftt/program-generator

[icc-fpga-protocol]: https://github.com/iftt/icc-fpga-protocol
[icc-fpga-protocol-ti]: https://travis-ci.org/iftt/icc-fpga-protocol.svg?branch=master
[icc-fpga-protocol-tu]: https://travis-ci.org/iftt/icc-fpga-protocol
[icc-fpga-protocol-ni]: https://img.shields.io/npm/v/@iftt/icc-fpga-protocol.svg
[icc-fpga-protocol-nu]: https://npmjs.org/package/@iftt/icc-fpga-protocol

[garage-client]: https://github.com/iftt/garage-client
[garage-client-ti]: https://travis-ci.org/iftt/garage-client.svg?branch=master
[garage-client-tu]: https://travis-ci.org/iftt/garage-client
[garage-client-ni]: https://img.shields.io/npm/v/@iftt/garage-client.svg
[garage-client-nu]: https://npmjs.org/package/@iftt/garage-client


---

## ISC License (ISC)

Copyright 2019 <IFTT>
Copyright (c) 2004-2010 by Internet Systems Consortium, Inc. ("ISC")
Copyright (c) 1995-2003 by Internet Software Consortium


Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
