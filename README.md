# Load Balancing gRPC in Kubernetes
This repoisoiry contains a configured gRPC sample application that can be run in Kubernetes to test proper load balancing. 
It will deploy client and server pods only accessible internally to a cluster. The client pod can run a script that will print the server host name. 

This applicaiton is in support of our article on [Load Balancing gRPC in Kubernetes with Istio](https://useanvil.com/blog/engineering/load-balancing-grpc-in-kubernetes-with-istio). Refer to the article for a more detailed process on leveraging this application to improve load balancing in your kubernetes cluster. 

## Build
The image is prebuilt and availble. Just run `docker pull ghcr.io/anvilco/load-balance-grpc-k8s:latest` to pull locally. The Kubernetes manifest is already prepopulated with the public image. 
If you would like to modify the image or build yourself, you can edit the `Dockerfile`.

## Deployment
All Kubernetes resources are stored in the `k8s.yaml` file. To deploy these resources into you cluster, you can follow a process like the following:

```sh
# Logging in to GKE (or your Kubernetes provider)
gcloud container clusters get-credentials cluster-1 --zone us-central1-c --project project-name

kubectl create namespace grpcdemo
kubectl config set-context --current --namespace=grpcdemo

kubectl apply -f ./k8s.yaml # Create the resources
```

## Running Test Script
To execute the test script you need to ssh into the client pod. 
```sh
kubectl get pods | grep greeter-client # The proxy pod
kubectl exec -it <pod name from above> -- bin/sh # Create a shell sessions to this pod
```
Once in the proxy pod, we can run our node script which will hit the gRPC servers and return a message along with the hostname of the server.

```sh
node greeter_client
# response…
##2 - Greeting: Hello from greeter-server-b8fb8c4b4-qjpjx, Anvil User!
#6 - Greeting: Hello from greeter-server-b8fb8c4b4-qjpjx, Anvil User!
#10 - Greeting: Hello from greeter-server-b8fb8c4b4-qjpjx, Anvil User!
#14 - Greeting: Hello from greeter-server-b8fb8c4b4-qjpjx, Anvil User!
#18 - Greeting: Hello from greeter-server-b8fb8c4b4-qjpjx, Anvil User!
#22 - Greeting: Hello from greeter-server-b8fb8c4b4-qjpjx, Anvil User!
#…
```

## Purpose
This test application provides insight into which pods are handling traffic. Looks through the responses and validate that there is an even split between servers handling requests. 

Source
-------
The basis for this example is pulled from the [gRPC Node Example](https://github.com/grpc/grpc-node).
More details and examples can be found in this repository. 
