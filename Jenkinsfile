pipeline {
    agent any

    environment {
        AWS_REGION   = 'ap-south-1'                 // change to your AWS region
        ECR_REPO     = '075483721080.dkr.ecr.ap-south-1.amazonaws.com/myapp'
        IMAGE_TAG    = "${env.BUILD_NUMBER}"
        PROD_SERVER  = 'ec2-user@3.106.192.79'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Sumitbabhulkar/myapp.git/myapp.git'
            }
        }

        stage('Install & Test') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${ECR_REPO}:${IMAGE_TAG} ."
            }
        }

        stage('Push to ECR') {
            steps {
                sh """
                  aws ecr get-login-password --region ${AWS_REGION} | \
                  docker login --username AWS --password-stdin ${ECR_REPO}
                  docker push ${ECR_REPO}:${IMAGE_TAG}
                """
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['prod-server-ssh']) {
                    sh """
                      ssh -o StrictHostKeyChecking=no ${PROD_SERVER} '
                        aws ecr get-login-password --region ${AWS_REGION} | \
                        docker login --username AWS --password-stdin ${ECR_REPO} &&
                        docker pull ${ECR_REPO}:${IMAGE_TAG} &&
                        docker stop myapp || true &&
                        docker rm myapp || true &&
                        docker run -d --name myapp -p 3000:3000 ${ECR_REPO}:${IMAGE_TAG}
                      '
                    """
                }
            }
        }
    }

    post {
        success { echo "✅ Deployed build ${IMAGE_TAG}" }
        failure { echo "❌ Pipeline failed" }
    }
}
