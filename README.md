# Example Node Web App Deployments

This repository demonstrates four different deployment versions of our Node web application. Each folder represents a distinct approach and image source.

## Folder Overview

1. **dockerhub-express-app**  
   Runs the Node web app using Docker Compose with images pulled from Docker Hub.

2. **cg-express-app**  
   Runs the Node web app using Docker Compose with images pulled from Chainguard.

3. **container-scan-app**  
   Deploys the Node web app (with Postgres and Nginx) to a Kubernetes cluster via a Helm chart using images from Docker Hub.

4. **cg-container-scan-app**  
   Deploys the Node web app (with Postgres and Nginx) to a Kubernetes cluster via a Helm chart using images from Chainguard.

---

## 1. dockerhub-express-app

**Description:**  
This version uses Docker Compose to run our Node web application. It pulls the Node base image from Docker Hub (`docker.io/node:23.10.0`).

**Usage:**

```bash
cd dockerhub-express-app
docker-compose up --build
```
---

## 2. cg-express-app

**Description:**  
This version uses Docker Compose to run our Node web application. It pulls the Node base image from Chainguard (`cgr.dev/chainguard-private node:23.10.0`).

**Usage:**

```bash
cd cg-express-app
docker-compose up --build
```
---

##3 container-scan-app

**Description:**  
This version uses Docker Compose to run our Node web application. This deploys the set of postgres, nginx, and node from Docker Hub - you can see this in the values.yaml file.

**Pre-requisites:**
You need to have Helm installed and a Kuberenets cluster ready to install the Helm chart in this directory. You can run this using Kind and follow these instructions to get a Kind Kuberentes cluster up and running

```bash
brew install kind
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.17.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
kind create cluster --config kind-cluster.yaml
```
**Usage:**

```bash
cd node-web-app
helm install my-app ./container-scan-app
kubectl get pods # wait for the pods to all come up to a 'running' state
kubectl port-forward svc/my-app-container-scan-app-nginx 30080:80
hit http://localhost:30080
```
---

##4 cg-container-scan-app

**Description:**  
This version uses Docker Compose to run our Node web application. This deploys the set of postgres, nginx, and node from Chainguards image registry - you can see this in the values.yaml file.

**Pre-requisites:**
You need to have Helm installed and a Kuberenets cluster ready to install the Helm chart in this directory.

**Usage:**

```bash
cd node-web-app
helm install my-app-cg ./cg-container-scan-app
kubectl get pods # wait for the pods to all come up to a 'running' state
kubectl port-forward svc/my-app-cg-container-scan-app-nginx 30080:80
hit http://localhost:30080
```
