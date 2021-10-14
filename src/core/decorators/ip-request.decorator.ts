import {createParamDecorator} from '@nestjs/common';

const requestIp = require('request-ip');

export const IpAddress = createParamDecorator((data, req) => {
  return requestIp.getClientIp(req);
});
