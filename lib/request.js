
const axios = require('axios');
let config = require("../config.json");
axios.defaults.baseURL = 'https://i.weread.qq.com';

function getUid() {
    let cookie = config.cookie;
    let uid;
    cookie.split(';').forEach(ele => {
        let [key, value] = ele.trim().split('=');
        if (key === 'wr_vid') {
            uid = Number(value);
        }
    });
    return uid;
}

const headers = {
    Host: 'i.weread.qq.com',
    Connection: 'keep-alive',
    'Upgrade-Insecure-Requests': 1,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    Cookie: config.cookie
}

axios.interceptors.request.use(function (config) {
    return {
        ...config,
        headers: headers
    };
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // if no data
    if ('synckey' in response.data && !response.data.synckey) {
        return Promise.reject('no data available');
    }
    return response.data;
}, function (error) {
    console.error(error.response.statusText);
    return Promise.reject(error.response);
});

function get_bookmarklist(bookId) {
    return axios({
        method: 'get',
        url: '/book/bookmarklist',
        params: {
            bookId
        }
    });
}

const get_bestbookmarks = bookId => {
    return axios({
        method: 'get',
        url: '/book/bestbookmarks',
        params: {
            bookId
        }
    });
}

const get_bookshelf = () => {
    return axios({
        method: 'get',
        url: '/shelf/friendCommon',
        params: {
            userVid: getUid()
        }
    });
}

const get_notebooklist = () => {
    return axios({
        method: 'get',
        url: '/user/notebooks'
    });
}

const get_bookinfo = bookId => {
    return axios({
        method: 'get',
        url: '/book/info',
        params: {
            bookId
        }
    });
}

module.exports = {
    get_bookmarklist,
    get_bestbookmarks,
    get_bookshelf,
    get_notebooklist,
    get_bookinfo
}