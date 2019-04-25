# demo-backend [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## About

This is an example backend server to promote the IOTA network. Although

## Modules

These are some of the main modules that make up the IFTT project:

| module | tests | version | description |
|---|---|---|---|
| **[demo-server][demo-server]** | [![][demo-server-ti]][demo-server-tu] | [![][demo-server-ni]][demo-server-nu] | **IFTT Server (this module)**
| **[tryte-encode-decode][tryte-encode-decode]** | [![][tryte-encode-decode-ti]][tryte-encode-decode-tu] | [![][tryte-encode-decode-ni]][tryte-encode-decode-nu] | data<-->trytes
| [tryte-buffer][tryte-buffer] | [![][tryte-buffer-ti]][tryte-buffer-tu] | [![][tryte-buffer-ni]][tryte-buffer-nu] | json<-->Trytes
| [program-generator][program-generator] | [![][program-generator-ti]][program-generator-tu] | [![][program-generator-ni]][program-generator-nu] | create programs from user defined json
| [icc-fpga-protocol][icc-fpga-protocol] | [![][icc-fpga-protocol-ti]][icc-fpga-protocol-tu] | [![][icc-fpga-protocol-ni]][icc-fpga-protocol-nu] | POW with an fpga device
| [garage-client][garage-client] | [![][garage-client-ti]][garage-client-tu] | [![][garage-client-ni]][garage-client-nu] | open/close garage with IOTA tangle

[demo-server]: https://github.com/iftt/demo-server
[demo-server-ti]: https://travis-ci.org/iftt/demo-server.svg?branch=master
[demo-server-tu]: https://travis-ci.org/iftt/demo-server
[demo-server-ni]: https://img.shields.io/npm/v/@iftt/demo-server.svg
[demo-server-nu]: https://npmjs.org/package/@iftt/demo-server

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
