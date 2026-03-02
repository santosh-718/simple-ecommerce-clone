pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        ACCOUNT_ID = '675550799998'
        ECR_BACKEND = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/backend"
        ECR_FRONTEND = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/frontend"
        CLUSTER_NAME = 'demoeks'
    }

    stages {

        stage('Clone') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/santosh-718/simple-ecommerce.git'
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION \
                | docker login --username AWS \
                --password-stdin $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                '''
            }
        }

        stage('Build Images') {
            steps {
                sh '''
                docker build -t backend ./backend
                docker build -t frontend ./frontend
                '''
            }
        }

        stage('Tag Images') {
            steps {
                sh '''
                docker tag backend:latest $ECR_BACKEND:latest
                docker tag frontend:latest $ECR_FRONTEND:latest
                '''
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                docker push $ECR_BACKEND:latest
                docker push $ECR_FRONTEND:latest
                '''
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh '''
                aws eks --region $AWS_REGION update-kubeconfig --name $CLUSTER_NAME

                kubectl apply -f k8s/namespace.yaml
                kubectl apply -f k8s/
                '''
            }
        }
    }
}
