export interface IValidationRequest {
  address: string;
  message: string;
  requestTimeStamp: number;
  validationWindow: number;
}

export interface IValidatedRequest {
  registerStar: boolean;
  status: {
    address: string;
    message: string;
    requestTimeStamp: number;
    validationWindow: number;
    messageSignature: boolean;
  };
}
