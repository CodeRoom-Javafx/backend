class SuccessResponse {
  constructor(data) {
    this.success = true;
    this.data = data;
    this.error = {};
  }
}

class FailedResponse {
  constructor(error) {
    this.success = false;
    this.data = {};
    this.error = error;
  }
}

module.exports = {
  SuccessResponse,
  FailedResponse,
};
