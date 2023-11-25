import { useState, useEffect } from 'react';
import axios from 'axios';


/**
 * Custom hook for getting resources using axios
 * @param {*} url 
 * @returns 
 */

const useAxios = ( url, method ) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const abortCont = new AbortController();

    axios({
      method: method,
      signal: abortCont.signal,
      // baseURL: 'http://192.168.0.2:8081/api',
      headers: {
                'Content-Type': 'application/json',
            },
      url: 'http://192.168.0.2:8081/api/' + url
    })
      .then(res => {
        if (!res.status == 200) { // error coming back from server
          throw Error('could not fetch the data for that resource');
        }
        return res.data;
      })
      .then(data => {
        setIsPending(false);
        if (data.currentPage == 1 &&
          data.totalRecords == 0) {
          const error = new Error('No records found');
          error.name = 'EmptyDataError';
          throw error;
        }
        setData(data);
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          console.log('fetch aborted')
        }
        // catches network / connection error
        setIsPending(false);
        if (err.response) {
          console.error(err.response.data.message);
        } else {
          console.error("Server cannot be reached!");
        }
      })
    // abort the fetch
    return () => abortCont.abort();
  }, [url])

  return { data, isPending };
}

export default useAxios;