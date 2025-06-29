import { Request } from '@hapi/hapi';

interface HeaderBuilderOptions {
  withAuth?: boolean;
}

class HeaderBuilder {
  private request: Request;
  private headers: { [key: string]: string };
  private options: HeaderBuilderOptions;

  constructor(request: Request, options: HeaderBuilderOptions = {}) {
    this.request = request;
    this.headers = {};
    this.options = options;
  }

  async build(): Promise<{ [key: string]: string }> {
    // if (this.options.withAuth && this.request.token) {
    //   this.headers.Authorization = `Bearer ${this.request.token}`;
    // }
    return this.headers;
  }
}

export default HeaderBuilder;
