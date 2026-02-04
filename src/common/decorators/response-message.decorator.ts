import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSGE_KEY = 'response_message';

export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSGE_KEY, message);
