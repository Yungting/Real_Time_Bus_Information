// 抓取縣市資料
if (!localStorage.getItem('cityList')) {
    getCityList()
}

// 呼叫公車 API
function getBusResult(url, query, data) {
    let queryA = '';
    let arr = [];
    if (query && query.length) queryA = query.join('/')
    if (data) {
        for (item in data) {
            arr.push(`$${item}=${data[item]}`);
        }
    }
    arr.push(`$format=JSON`);
    // 組合網址
    const urlA = `https://ptx.transportdata.tw/MOTC/v2/Bus/${url}${queryA}?${arr.join('&')}`;
    const promise = axios.get(urlA, { headers: getAuthorizationHeader() })
    const dataPromise = promise.then((response) => response.data)
    return dataPromise
}

// 抓取縣市資料
function getCityList() {
    axios.get('https://gist.motc.gov.tw/gist_api/V3/Map/Basic/City?$format=JSON')
        .then((response) => {
            localStorage.setItem('cityList', JSON.stringify(response.data))
        })
        .catch((error) => {
            console.error(error)
        })
}

// API Header 
function getAuthorizationHeader() {
    let AppID = 'e5c0077bdc284fca9d2e375fc415fec3';
    let AppKey = 'NvmhuHvJKhyW0NzvBISz8v9nTlA';
    let GMTString = new Date().toGMTString();
    let ShaObj = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(AppKey, 'TEXT');
    ShaObj.update('x-date: ' + GMTString);
    let HMAC = ShaObj.getHMAC('B64');
    let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
    return { 'Authorization': Authorization, 'X-Date': GMTString };
}