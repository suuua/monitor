/**
 * 这个是用node.js编写的用于导出cos上文件并导出感兴趣的数据
 * 使用前需要确保bucket可读
 * @author zc
 */
const https  = require('https')
const fs = require('fs')
const path = require('path')

const BUCKET = ''
const DIR = ''
const IS_FILTER_ALL_FILE = false
const OUTPUT_DIR = path.join(__dirname, 'logFilter')
const LAST_FILTER = path.join(OUTPUT_DIR, 'lastFilter.json')
const OUTPUT_FILES = [{
  name: 'error.txt',
  logFilters: ['ERROR']
}, {
  name: 'performance.txt',
  logFilters: ['performance', 'PERFORMANCE']
}]

function httpGet(url) {
  return new Promise((resolve, rej) => {
    https.get(url, (res) => {
      const { statusCode } = res;
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        if (statusCode !== 200) {
          return rej(new Error(`getFileList fail statusCode=${ statusCode }, response=${rawData}`))
        }
        resolve(rawData)
      })
    }).on('error', (err) => {
      rej(err)
    })
  })
}

async function getFileList() {
  const regFileContents = /<contents>[\s\S]*?<\/contents>/gi
  const regFileKey = /<key>(.*?)<\/key>/i
  const regFileTime = /<lastModified>(.*?)<\/<lastModified>>/i
  let rawData = await httpGet(BUCKET)
  // parse xml
  let res = []
  let match
  while(match = regFileContents.exec(rawData)) {
    let file = {};
    let matchkey = match[0].match(regFileKey)
    if (matchkey) { file.key = matchkey[1] } else { break; }
    let matchTime = match[0].match(regFileTime)
    if (matchTime) file.lastModified = +new Date(matchTime[1]);
    res.push(file)
  }
  return res;
}

async function getFile(key) {
  let text = await httpGet(key)
  return text;
}

function filterText(text) {
  return OUTPUT_FILES.map(opt => {
    let reg = new RegExp(`(?:${ opt.logFilters.map(str => `\\[${str}\\]`).join('|') })[\\s\\S]*?\\}\\n`, 'g')
    let match = text.match(reg)
    if (match) {
      return match.reduce((acc, cur) => acc + cur, '')
    } else {
      return ''
    }
  })
}

async function filterFile() {
  const MAX_CONCURRENCY = 30;
  let filterFiles = []
  let filterTask = []
  let files = await getFileList()
 

  if (DIR) files = files.filter(file => !!file.key.match(new RegExp(`${DIR}\\/.+`)));
  // 按时间过滤
  if (!IS_FILTER_ALL_FILE) {
    try {
      let lastFilter = fs.readFileSync(LAST_FILTER)
      if (lastFilter) lastFilter = JSON.parse(lastFilter);

      if (lastFilter && lastFilter.time) {
        files = files.filter(file => file.lastModified && file.lastModified > lastFilter.time)
      }
    } catch (_) {
      console.warn('not last read time')
    }
  }
  

  function interator(start, size) {
    let pm = [];
    let max = start + size > files.length ? files.length : start + size
    for (let i = start; i < max; i++) {
      pm.push(
        getFile(BUCKET + files[i].key).then(filterText).then(texts => {
          texts.forEach((text, index) => {
            let cache = filterFiles[index]
            if (cache) {
              filterFiles[index] += text
            } else {
              filterFiles[index] = text;
            }
          })
        })
      )
    }
    return Promise.all(pm).then(() => {
      if (max < files.length) {
        return interator(max, size)
      }
    });
  }

  return await interator(0, MAX_CONCURRENCY).then(async () => {
    try { await fs.promises.rmdir(OUTPUT_DIR) } catch(_) { console.warn(_) }
    await fs.promises.mkdir(OUTPUT_DIR)
    return await Promise.all(
      OUTPUT_FILES.map((opt, index) => {
        return fs.promises.writeFile(path.join(OUTPUT_DIR, opt.name), filterFiles[index], 'utf8')
      }).push(
        // 保存最后一次处理时间，
        fs.promises.writeFile(LAST_FILTER, JSON.stringify({time: +new Date()}), 'utf8')
      )
    )
  })
}
console.log(`filterFile start...`)
filterFile().then(() => console.log(`filterFile complete`)).catch(_ => console.error(_));
