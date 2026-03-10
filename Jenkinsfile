pipeline {
    agent any

    environment {
        AWS_REGION   = 'us-east-1'
        ACCOUNT_ID   = '675550799998'
        CLUSTER_NAME = 'demoeks'
        NAMESPACE    = 'ecommerce'

        IMAGE_TAG    = "${BUILD_NUMBER}"

        ECR_BACKEND  = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/backend"
        ECR_FRONTEND = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/frontend"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                sh """
                docker build -t backend:${IMAGE_TAG} ./backend
                docker build -t frontend:${IMAGE_TAG} ./frontend
                """
            }
        }

        stage('Login to ECR') {
            steps {
                sh """
                aws ecr get-login-password --region ${AWS_REGION} | \
                docker login --username AWS --password-stdin \
                ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                """
            }
        }

        stage('Tag & Push Images') {
            steps {
                sh """
                docker tag backend:${IMAGE_TAG} ${ECR_BACKEND}:${IMAGE_TAG}
                docker tag frontend:${IMAGE_TAG} ${ECR_FRONTEND}:${IMAGE_TAG}

                docker push ${ECR_BACKEND}:${IMAGE_TAG}
                docker push ${ECR_FRONTEND}:${IMAGE_TAG}
                """
            }
        }

        stage('Deploy to EKS') {
    steps {
        sh """
        aws eks --region ${AWS_REGION} update-kubeconfig --name ${CLUSTER_NAME}

        # Ensure namespace exists
        kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -

        # Apply PVC first
        kubectl apply -f k8s/postgres-pvc.yaml -n ${NAMESPACE}

        # Apply Postgres deployment + service
        kubectl apply -f k8s/postgres-deployment.yaml -n ${NAMESPACE}
        kubectl apply -f k8s/postgres-service.yaml -n ${NAMESPACE}

        # Wait for Postgres to be ready
        kubectl rollout status deployment/postgres -n ${NAMESPACE} --timeout=180s

        # Recreate init-db job
        kubectl delete job init-db -n ${NAMESPACE} --ignore-not-found
        kubectl apply -f k8s/init-db-job.yaml -n ${NAMESPACE}

        # Apply backend + frontend
        kubectl apply -f k8s/backend-deployment.yaml -n ${NAMESPACE}
        kubectl apply -f k8s/backend-service.yaml -n ${NAMESPACE}
        kubectl apply -f k8s/frontend-deployment.yaml -n ${NAMESPACE}
        kubectl apply -f k8s/frontend-service.yaml -n ${NAMESPACE}

        # Update images
        kubectl set image deployment/backend backend=${ECR_BACKEND}:${IMAGE_TAG} -n ${NAMESPACE}
        kubectl set image deployment/frontend frontend=${ECR_FRONTEND}:${IMAGE_TAG} -n ${NAMESPACE}
        """
    }
}


        stage('Verify Deployment') {
            steps {
                sh """
                kubectl rollout status deployment/backend -n ${NAMESPACE}
                kubectl rollout status deployment/frontend -n ${NAMESPACE}
                """
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful - Build ${BUILD_NUMBER}"
        }
        failure {
            echo "❌ Deployment Failed - Check Logs"
        }
    }
}
