pipeline {
    agent any
    environment {
        // 镜像仓库配置
        NEXUS_URL = "http://nexus:8081"
        NEXUS_EXTERNAL_URL = "http://52.237.89.89:8081"
        NEXUS_INTRANET_URL = "http://10.23.0.7:8081"
        DOCKER_HUB = "sitanduat.azurecr.io"
        SERVICE_WAIT_TIME = "30"
        NODE_MODULES_CACHE = "${WORKSPACE}/node_modules"

        // ✅ Remi SSR 官网项目参数
        PROJECT_NAME = "remi-ssr"
        DEPLOYMENT_NAME = "remi-frontend-ssr"
    }

    parameters {
        string(
            name: 'BRANCH_NAME',
            defaultValue: env.BRANCH_NAME ?: 'main',
            description: '构建分支'
        )
        choice(
            name: 'DEPLOY_TARGET',
            choices: ['sit'],
            description: '选择部署环境'
        )
        // 已移除 ENV_FILE_PATH 参数块
    }

    stages {
        stage('初始化配置（环境+版本）') {
            steps {
                script {
                    def branch = params.BRANCH_NAME.toLowerCase()
                    env.RAW_BRANCH_NAME = params.BRANCH_NAME
                    env.K8S_NAMESPACE = "sit-website-ssr"
                    env.KUBECONFIG_CREDS = "kubeconfig-sit"
                    echo "===== 初始化配置完成 ====="
                    echo "原始分支：${params.BRANCH_NAME} → 标准化分支：${branch}"
                    echo "部署环境：${params.DEPLOY_TARGET}"
                    // 已删除 .env 文件打印行 echo ".env 文件：${params.ENV_FILE_PATH}"
                }
            }
        }

        stage('拉取代码（Git）') {
            steps {
                echo "===== 拉取 ${params.BRANCH_NAME} 分支代码 ====="
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "*/${params.BRANCH_NAME}"]],
                    userRemoteConfigs: [[
                        url: 'git@github.com:remi-team/ssr.remitech.ai.git',
                        credentialsId: 'ssh-key-git'
                    ]]
                ])

                sh "ls -l package.json || { echo '❌ 未找到 package.json'; exit 1; }"
                sh "ls -l pnpm-lock.yaml || { echo '❌ 未找到 pnpm-lock.yaml'; exit 1; }"
                sh "ls -l Dockerfile || { echo '❌ 未找到 Dockerfile'; exit 1; }"
                sh "ls -l ecosystem.config.cjs || { echo '❌ 未找到 ecosystem.config.cjs'; exit 1; }"
            }
        }

        stage('镜像制作阶段') {
            steps {
                script {
                    echo "===== 开始构建 Docker 镜像 ====="
                    def timestamp = sh(script: 'date +%Y%m%d%H%M%S', returnStdout: true).trim()
                    env.DOCKER_IMAGE_TAG = "${env.RAW_BRANCH_NAME}-${timestamp}"
                    env.FULL_IMAGE_NAME = "${DOCKER_HUB}/${DEPLOYMENT_NAME}:${env.DOCKER_IMAGE_TAG}"

                    echo "镜像标签: ${env.DOCKER_IMAGE_TAG}"
                    echo "完整镜像名称: ${env.FULL_IMAGE_NAME}"

                    sh """
                        echo "📁 Docker 构建上下文检查："
                        ls -la Dockerfile || { echo '❌ Dockerfile 不存在'; exit 1; }
                    """

                    withCredentials([usernamePassword(
                        credentialsId: 'docker-hub-creds',
                        usernameVariable: 'DOCKER_REGISTRY_USER',
                        passwordVariable: 'DOCKER_REGISTRY_PASS'
                    )]) {
                        sh """
                            echo "🔐 登录 Docker 镜像仓库..."
                            docker login ${DOCKER_HUB} -u ${DOCKER_REGISTRY_USER} -p ${DOCKER_REGISTRY_PASS}
                        """
                    }

                    // ✅ 使用 pnpm + Next.js standalone
                    sh """
                        echo "🐳 开始构建 Docker 镜像..."
                        docker build \
                            -t ${FULL_IMAGE_NAME} \
                            .
                    """

                    sh """
                        echo "📤 推送镜像到仓库..."
                        docker push ${FULL_IMAGE_NAME}
                        docker rmi ${FULL_IMAGE_NAME} || true
                    """

                    echo "✅ Docker 镜像构建+推送完成"
                }
            }
        }

        stage('部署到 Kubernetes') {
            steps {
                script {
                    echo "===== 开始部署到 K8s 集群（环境：${params.DEPLOY_TARGET}） ====="
                    def yamlTemplatePath = "${WORKSPACE}/${DEPLOYMENT_NAME}.yaml"

                    sh """
                        if [ ! -f "${yamlTemplatePath}" ]; then
                            echo "❌ 未找到 K8s YAML 模板"
                            exit 1
                        fi
                    """

                    sh """
                        cp ${yamlTemplatePath} ${yamlTemplatePath}.bak
                        sed -i "s#{{FULL_IMAGE_NAME}}#${FULL_IMAGE_NAME}#g" ${yamlTemplatePath}
                        grep "image:" ${yamlTemplatePath}
                    """

                    withCredentials([file(
                        credentialsId: env.KUBECONFIG_CREDS,
                        variable: 'KUBECONFIG_FILE'
                    )]) {
                        sh """
                            export KUBECONFIG=\${KUBECONFIG_FILE}
                            kubectl apply -f ${yamlTemplatePath} -n ${K8S_NAMESPACE}
                            kubectl rollout restart deployment/${DEPLOYMENT_NAME} -n ${K8S_NAMESPACE}
                            kubectl rollout status deployment/${DEPLOYMENT_NAME} -n ${K8S_NAMESPACE} --timeout=300s
                            kubectl get pods -l app=${DEPLOYMENT_NAME} -n ${K8S_NAMESPACE}
                        """
                    }

                    echo "✅ Remi SSR 部署到 K8s 成功！"
                }
            }
        }
    }

    post {
        success {
            echo "=================================================="
            echo "🎉 Remi SSR 部署成功！"
            echo "📌 镜像：${FULL_IMAGE_NAME}"
            echo "=================================================="
        }
        failure {
            echo "=================================================="
            echo "❌ Remi SSR 部署失败！"
            echo "1. pnpm install 是否成功"
            echo "2. Next.js standalone 构建是否正常"
            echo "3. Docker / K8s 配置是否正确"
            echo "=================================================="
        }
        always {
            cleanWs(
                deleteDirs: true,
                notFailBuild: true,
                patterns: [
                    [pattern: 'node_modules', type: 'EXCLUDE']
                ]
            )
        }
    }
}