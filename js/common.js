// Icon
feather.replace()

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
async function getCityList() {
    await axios.get('https://gist.motc.gov.tw/gist_api/V3/Map/Basic/City?$format=JSON')
        .then((response) => {
            localStorage.setItem('cityList', JSON.stringify(response.data))
            return true
        })
        .catch((error) => {
            console.error(error)
        })
}

// 站牌狀態
function showStopStatus(stopStatus) {
    switch (stopStatus) {
        case 0 :
            return '正常'
        case 1 :
            return '尚未發車'
        case 2 :
            return '交管不停靠'
        case 3 :
            return '末班車已過'
        case 4 :
            return '今日未營業'
    }
}

// 秒換算成分
function showTime(sec) {
    let min = 0
    min = Math.round(sec / 60)
    return min > 0 ? min + '分' : '進站中'
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