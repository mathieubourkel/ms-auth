import { RpcException } from "@nestjs/microservices";

export abstract class BaseUtils {
    
   _Ex = (
    message: string | string[],
    statusCode: number,
    code: string,
    method: string,
  ): never => {
    throw new RpcException({
      message,
      statusCode,
      context: {
        ms: "auth",
        error: {
          exceptionPosition: method,
          errorCode: code,
        },
      },
    });
  };

  _catchEx = (error: any) => {
    throw new RpcException(error.error || error.message);
  };
}

