/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

// Requiring the lodash library  
const _ = require("lodash");            
    
var PROTO_PATH = __dirname + '/helloworld.proto';

var grpc = require('@grpc/grpc-js');

var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

function main() {  
  var client = new hello_proto.Greeter('greeter-server:50051', grpc.credentials.createInsecure());

  let hello = _.times(100, (i) => (
    client.sayHello({name: 'Anvil User!'}, function(err, response) {
      console.log(`#${i+1} - Greeting: ${response.message}`);
    })
  ) );
}

main();
