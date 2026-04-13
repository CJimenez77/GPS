pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                dir('microservices/ms-requirements') {
                    bat 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                dir('microservices/ms-requirements') {
                    bat 'npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                dir('microservices/ms-requirements') {
                    bat 'docker build -t gps-ms-requirements:build .'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}