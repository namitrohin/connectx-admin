
@Library("Share") _

pipeline{
    agent any
    
        environment{
        SONAR_HOME = tool "Sonar"
    }
    stages{
       
        // stage("code"){
        //     steps{
        //       echo "clone the code"  
        //       git url:"https://github.com/namitrohin/connectx_api.git" , branch:"main"
        //       echo "code cloning"
        //     }
        // }
        stage("Trivy: Filesystem scan"){
            steps{
                script{
                    trivy_scan()
                }
            }
        }
        

        stage("OWASP: Dependency check"){
            steps{
                script{
                    owasp_dependency()
                }
            }
        }
        
        stage("SonarQube: Code Analysis"){
            steps{
                script{
                    sonarQube_analysis("Sonar","connectx_admin","connectx_admin")
                }
            }
        }
        
        // stage("SonarQube: Code Quality Gates"){
        //     steps{
        //         script{
        //             sonarQube_code_quality()
        //         }
        //     }
        // }

        stage(" Docker build"){
           steps{
               echo "build code"
            //   sh "whoami"
              sh "docker build -t connectx_admin_react:latest ."
              echo "docker build successfully"
           } 
        }
        stage(" Docker Push to dockerHub"){
            steps{
                withCredentials([usernamePassword(credentialsId:"dockerHubCred",passwordVariable:"dockerHubPass",usernameVariable:"dockerHubUser")]){
                sh "docker login -u ${env.dockerHubUser} -p ${env.dockerHubPass}"
                sh "docker tag connectx_admin_react:latest ${env.dockerHubUser}/connectx_admin_react:latest"
                sh "docker push ${env.dockerHubUser}/connectx_admin_react:latest"
                echo 'image push ho gaya'
                }
            }
            
        }
        stage("deploy"){
          steps{
               sh "docker-compose up -d"
               echo "code Deploy"
            }  
        }
    }
}
