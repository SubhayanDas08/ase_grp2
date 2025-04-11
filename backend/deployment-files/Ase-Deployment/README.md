# Multi-App Helm Chart

This Helm chart deploys a multi-service application consisting of a Node.js backend and a Python backend.

## Prerequisites

* Kubernetes cluster
* Helm installed

## Chart Structure

The chart has the following structure:

* `Chart.yaml`: Contains metadata about the chart.
* `values.yaml`: Contains default values for the chart.
* `charts/`: Contains the subcharts for the Node.js backend and Python backend.
    * `charts/node-backend/`: Contains the Helm chart for the Node.js backend.
    * `charts/python-backend/`: Contains the Helm chart for the Python backend.

## Subcharts

The chart includes the following subcharts:

* **Node.js Backend:**
    * Image: `siwalt1/node-backend-app:3.0`
    * Service Type: NodePort
    * Port: 3000
    * Environment Variables:
        * `NODE_ENV`: development
        * `REDIS_HOST`: 10.154.0.5
        * `REDIS_PORT`: "6379"
        * `REDIS_PASSWORD`: 6DrFXs4rCCr27GdtKh
        * `PG_HOST`: 10.154.0.5
        * `PG_PORT`: "5432"
        * `PG_DATABASE`: postgres
        * `PG_USER`: postgres
        * `PG_PASSWORD`: sample_key
* **Python Backend:**
    * Image: `sbnm007/ase:py5.0`
    * Service Type: NodePort
    * Port: 8000
    * Environment Variables:
        * `OPENAI_API_KEY`: sample_key

## Installation

1. Clone the repository:

    ```bash
    git clone <repository_url>
    cd multiapp
    ```

2. Install the chart:

    ```bash
    helm install my-multiapp .
    ```

    Replace `my-multiapp` with the desired release name.

## Configuration

You can configure the chart by modifying the `values.yaml` file or by using the `--set` flag during installation.

### Example: Setting the Node.js backend replica count

```bash
helm install my-multiapp . --set node-backend.replicaCount=5

