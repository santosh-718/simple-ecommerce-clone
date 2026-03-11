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
                    aws ecr get-login-password --region \${AWS_REGION} | \
                    docker login --username AWS --password-stdin \
                    \${ACCOUNT_ID}.dkr.ecr.\${AWS_REGION}.amazonaws.com
                """
            }
        }

        stage('Tag & Push Images') {
            steps {
                sh """
                    docker tag backend:${IMAGE_TAG} \${ECR_BACKEND}:${IMAGE_TAG}
                    docker tag frontend:${IMAGE_TAG} \${ECR_FRONTEND}:${IMAGE_TAG}
                    docker push \${ECR_BACKEND}:${IMAGE_TAG}
                    docker push \${ECR_FRONTEND}:${IMAGE_TAG}
                """
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh '''
                    aws eks --region ${AWS_REGION} update-kubeconfig --name ${CLUSTER_NAME}

                    # Ensure namespace exists
                    kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
                    
                    # Apply new StorageClass with Immediate binding
                    kubectl apply -f k8s/gp3-immediate-storageclass.yaml

                    # Delete old PVC if exists
                    kubectl delete pvc postgres-pvc -n ${NAMESPACE} --ignore-not-found --grace-period=0 --force
                    kubectl patch pvc postgres-pvc -n ${NAMESPACE} -p '{"metadata":{"finalizers":null}}' --type=merge || true
                    kubectl delete pv -l claimName=postgres-pvc --ignore-not-found --grace-period=0 --force

                    # Apply PVC with gp3-immediate
                    kubectl apply -f k8s/postgres-pvc.yaml -n ${NAMESPACE}

                    # Deploy Postgres
                    kubectl apply -f k8s/postgres-deployment.yaml -n ${NAMESPACE}
                    kubectl apply -f k8s/postgres-service.yaml -n ${NAMESPACE}

                    # Wait for PVC to bind
                    kubectl wait --for=condition=Bound pvc/postgres-pvc -n ${NAMESPACE} --timeout=300s

                    # Wait for Postgres rollout
                    kubectl rollout status deployment/postgres -n ${NAMESPACE} --timeout=300s
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh """
                    kubectl rollout status deployment/backend -n \${NAMESPACE}
                    kubectl rollout status deployment/frontend -n \${NAMESPACE}
                """
            }
        }

        stage('Check Init Job Logs') {
            steps {
                sh "kubectl logs job/init-db -n \${NAMESPACE} || true"
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
