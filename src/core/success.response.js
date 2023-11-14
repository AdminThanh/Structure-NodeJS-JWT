"use strict";

const StatusCode = {
  OK: 200,
  CREATED: 201,
};
const ReasontatusCode = {
  CREATED: "Created",
  OK: "Success",
};

class SuccessResponse extends Error {
  constructor({
    message,
    reasontatusCode = ReasontatusCode.OK,
    statusCode = StatusCode.OK,
    metadata = {},
  }) {
    super();
    this.message = !message ? reasontatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }
  send(res, headers = {}) {
    const response = {
      message: this.message,
      status: this.status,
      metadata: this.metadata,
    };
    return res.status(this.status).json(response);
    // return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor(message, metadata) {
    super({ message, metadata });
  }
}
class CREATED extends SuccessResponse {
  constructor(
    message,
    metadata,
    statusCode = StatusCode.CREATED,
    reasontatusCode = ReasontatusCode.CREATED,
    options = {}
  ) {
    super({ message, reasontatusCode, statusCode, metadata });
    this.options = options;
  }
}

module.exports = { OK, CREATED, SuccessResponse };
