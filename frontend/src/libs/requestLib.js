import axios from "axios";

export default async function sendRequestWithAuth (method, url, data, token, setIsLoading, setData) {
  var options = {
    method: method,
    url: url,
    data: data,
    headers: {authorization: `Bearer ${token}`}
  };

  await axios.request(options)
      .then(response => {
        setIsLoading && setIsLoading(false);
        setData && setData(response.data);
      })
      .catch(err => {
        setIsLoading && setIsLoading(false);
        console.log("request failed:" + err)
      });
}