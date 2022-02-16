import Axios, {AxiosError, AxiosResponse} from 'axios'

export class JwksClient {
  jwksUrl = `https://${process.env.AUTH0_TENANT}.auth0.com/.well-known/jwks.json`

  getJwks(): Promise<Array<any>> {
    return Axios.get(this.jwksUrl)
      .then((response: AxiosResponse) => {
        return response.data.keys
      })
      .catch((response: AxiosError) => {
        if (response.response) {
          return response.response?.data && (response.response?.data?.message ||
              response.response?.data) ||
            response.response?.data?.statusMessage ||
            `Http Error ${response.response?.data?.statusCode}`
        }

        return response.response?.status;
      })
  }
}
