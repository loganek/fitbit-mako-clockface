import * as cdk from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { DockerImageCode, DockerImageFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";

export class WhatsappLambdaApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dockerfileDir = path.join(__dirname, "docker");
    const fnc = new DockerImageFunction(this, "api-lambda-handler", {
      code: DockerImageCode.fromImageAsset(dockerfileDir),
      memorySize: 2048,
      timeout: cdk.Duration.minutes(1),
    });

    const api = new RestApi(this, "api");
    api.root.addResource("message").addMethod("POST", new LambdaIntegration(fnc));
  }
}
