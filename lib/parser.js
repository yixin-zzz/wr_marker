const {
    get_bookmarklist,
    get_bestbookmarks,
    get_bookshelf,
    get_notebooklist,
    get_bookinfo
} = require('./request');
const _ = require('lodash');
const colors = require('colors');
const pad = require('pad');
const fs = require('fs');
let config = require('../config.json');

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function parseChapters(chapters) {
    let resMap = {};
    chapters.forEach(chap => {
        const { chapterUid, title } = chap;
        if (!resMap[chapterUid]) {
            resMap[chapterUid] = `${title}`;
        }
    })
    return resMap;
}

function parseBookmarks(bookmarks, chapters) {
    let chapterMap = parseChapters(chapters);
    let bookMarkMap = _.groupBy(bookmarks, item => item['chapterUid']);
    let bookmarksArr = [];
    Object.keys(bookMarkMap).sort((a, b) => Number(a) - Number(b)).forEach(uid => {
        let item = {
            chapter: chapterMap[uid],
            markList: bookMarkMap[uid]
        }
        bookmarksArr.push(item)
    });
    return bookmarksArr;
}

function parseCreateTime(timestamp) {
    let date = new Date(timestamp * 1000);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return `${year}.${month}.${day} ${hours}:${minutes}`;
}

function writeToString(info) {
    const { title, author, bookmarks } = info;
    const { chapterPrefix, markPrefix, showMarkCreatedTime } = config;
    let text = `${title} - ${author}\n\n`;
    bookmarks.forEach(item => {
        const { chapter, markList } = item;
        text += `${chapterPrefix}${chapter}`;
        if (markList[markList.length - 1].createTime && showMarkCreatedTime) {
            text += `  --${markList[markList.length - 1].createTime}\n\n`;
        } else {
            text += `\n\n`;
        }
        markList.forEach(mark => {
            text += `${markPrefix}${mark.markText}\n\n`;
        })
    })
    return text;
}

function writeToFile(res, folder) {
    const { data, title } = res;
    // let folder = operation === "1" ? bookMarkFolder : bestBookMarkFolder;
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
    fs.writeFileSync(`${folder}/${title}.txt`, data, (err) => {
        if (err) throw err;
    });
    console.log('读书笔记已存入: ' + `${folder}/${title}.txt`);
}

async function getBestBookmarklist(id) {
    let res = await get_bestbookmarks(id);
    let bookInfo = await get_bookinfo(id);
    if (!res || !bookInfo) return;
    const { bestBookMarkFolder } = config;
    let bookMarkInfo = {};
    const { items, chapters } = res;
    if (!items || !items.length) {
        console.log('热门划线: no data available');
        return;
    }
    bookMarkInfo.title = bookInfo.title;
    bookMarkInfo.author = bookInfo.author;

    let bookmarks = [];
    items.forEach(item => {
        const { chapterUid, markText } = item;
        let config = {
            chapterUid,
            markText,
        }
        bookmarks.push(config)
    })
    bookMarkInfo.bookmarks = parseBookmarks(bookmarks, chapters);
    writeToFile({
        data: writeToString(bookMarkInfo),
        title: bookMarkInfo.title
    }, bestBookMarkFolder)
    return;
}

async function getBookmarklist(id) {
    let res = await get_bookmarklist(id);
    if (!res) return;
    let bookMarkInfo = {};
    const { bookMarkFolder } = config;
    const { updated, chapters, book } = res;
    if (!updated || !updated.length) {
        console.log('个人划线: no data available');
        return;
    }

    bookMarkInfo.title = book.title;
    bookMarkInfo.author = book.author;

    let bookmarks = [];
    res.updated.forEach(item => {
        const { chapterUid, markText, createTime } = item;
        let config = {
            chapterUid,
            markText,
            createTime: createTime ? parseCreateTime(createTime) : '',
        }
        bookmarks.push(config)
    })
    bookMarkInfo.bookmarks = parseBookmarks(bookmarks, chapters);
    writeToFile({
        data: writeToString(bookMarkInfo),
        title: bookMarkInfo.title
    }, bookMarkFolder)
    return;
}

async function getBookList() {
    let res = await get_bookshelf();
    if (!res) return;
    let bookList = [];
    const { recentBooks } = res;
    if (!recentBooks || !recentBooks.length) {
        console.log('书架列表: no data available');
        return;
    }

    recentBooks.forEach(item => {
        const { title, author, bookId } = item;
        let config = {
            title,
            author: author.split(' ').length > 1 ? `${author.split(' ')[0]}等` : author,
            bookId
        }
        bookList.push(config)
    })
    bookList.forEach(item => {
        const { title, bookId, author } = item;
        console.log(pad(colors.green(bookId), 18), "|  ", colors.grey(`${title} --${author}`));
    })
    return;
}

async function handleOperation(operation, params) {
    const { bookId } = params;
    switch (operation) {
        case "0":
            await getBookList();
            break;
        case "1":
            await getBookmarklist(bookId);
            break;
        case "2":
            await getBestBookmarklist(bookId);
            break;
    }
    await sleep(1000);
    return;
}

module.exports = {
    handleOperation
}
