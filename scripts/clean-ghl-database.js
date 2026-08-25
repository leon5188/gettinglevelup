const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');

const envPath = path.join(__dirname, '../ghl-mcp/.env');
const env = dotenv.parse(fs.readFileSync(envPath));
const apiKey = env.GHL_API_KEY;
const locationId = env.GHL_LOCATION_ID;

const client = axios.create({
  baseURL: 'https://services.leadconnectorhq.com',
  headers: {
    'Authorization': 'Bearer ' + apiKey,
    'Version': '2023-02-21',
    'Content-Type': 'application/json'
  }
});

const COMMON_US_NAMES = new Set([
  'aaron', 'adam', 'alan', 'albert', 'alex', 'alexander', 'allen', 'alvin', 'andrew', 'andy',
  'anthony', 'art', 'arthur', 'austin', 'barry', 'ben', 'benjamin', 'bill', 'billy', 'bob',
  'bobby', 'brad', 'bradley', 'brandon', 'brendan', 'brian', 'bryan', 'bruce', 'carl', 'carlos',
  'chad', 'charles', 'charlie', 'chase', 'chris', 'christian', 'christopher', 'cody', 'colin',
  'connor', 'corey', 'cory', 'craig', 'curtis', 'dale', 'dan', 'daniel', 'danny', 'darren',
  'dave', 'david', 'dean', 'dennis', 'derek', 'derrick', 'don', 'donald', 'doug', 'douglas',
  'drew', 'dustin', 'dwayne', 'earl', 'ed', 'eddie', 'edgar', 'edward', 'elvis', 'eric',
  'erik', 'ernest', 'evan', 'felix', 'frank', 'frankie', 'fred', 'freddie', 'frederick',
  'garrett', 'gary', 'geoff', 'geoffrey', 'george', 'gerald', 'glen', 'glenn', 'gordon',
  'grant', 'greg', 'gregory', 'guy', 'harold', 'harry', 'heath', 'henry', 'howard', 'hunter',
  'ian', 'isaac', 'isai', 'jack', 'jackson', 'jacob', 'jake', 'james', 'jamie', 'jared',
  'jason', 'jay', 'jeff', 'jeffery', 'jeffrey', 'jerry', 'jesse', 'jim', 'jimmy', 'joe',
  'joel', 'john', 'johnny', 'jon', 'jonathan', 'jordan', 'jose', 'joseph', 'josh', 'joshua',
  'juan', 'justin', 'karl', 'keith', 'kelly', 'ken', 'kenneth', 'kenny', 'kevin', 'kirk',
  'kris', 'kyle', 'lance', 'larry', 'lawrence', 'leo', 'leon', 'leonard', 'leroy', 'les',
  'leslie', 'logan', 'louis', 'luke', 'lucas', 'manuel', 'marcus', 'mark', 'mario', 'marshall',
  'martin', 'marty', 'mason', 'matt', 'matthew', 'maurice', 'max', 'melvin', 'michael', 'mike',
  'mikey', 'mitchell', 'morris', 'nathan', 'nate', 'neil', 'nicholas', 'nick', 'norman', 'norm',
  'oliver', 'oscar', 'pat', 'patrick', 'paul', 'perry', 'pete', 'peter', 'phil', 'philip',
  'phillip', 'ralph', 'randall', 'randy', 'ray', 'raymond', 'reed', 'reese', 'rex', 'rich',
  'richard', 'richie', 'rick', 'ricky', 'rob', 'robbie', 'robert', 'rod', 'roddy', 'rodney',
  'roger', 'ron', 'ronald', 'ronnie', 'ross', 'roy', 'rudy', 'russ', 'russell', 'ryan',
  'sam', 'sammy', 'samuel', 'scott', 'scotty', 'sean', 'seth', 'shane', 'shaun', 'shawn',
  'sid', 'sidney', 'spencer', 'stan', 'stanley', 'stephen', 'steve', 'steven', 'stewart',
  'stuart', 'ted', 'teddy', 'terrence', 'terry', 'thomas', 'tom', 'tommy', 'tim', 'timothy',
  'toby', 'todd', 'tony', 'tracey', 'travis', 'trent', 'trevor', 'troy', 'tyler', 'vern',
  'vernon', 'vic', 'victor', 'vince', 'vincent', 'wade', 'walter', 'walt', 'warren', 'wayne',
  'wes', 'wesley', 'will', 'william', 'willie', 'zack', 'zach', 'zachary', 'tiffany', 'christie',
  'tina', 'sarah', 'lisa', 'mary', 'karen', 'jennifer', 'amy', 'jessica', 'ashley', 'emily',
  'jance', 'ricky', 'todd', 'al', 'art', 'clyde', 'elmer', 'gene', 'harvey', 'herbert', 'lester'
]);

function extractNameFromEmail(email) {
  if (!email || !email.includes('@')) return '';
  const prefix = email.split('@')[0].toLowerCase();
  const tokens = prefix.split(/[._\-\d]+/);
  for (const token of tokens) {
    if (COMMON_US_NAMES.has(token)) {
      return token.charAt(0).toUpperCase() + token.slice(1);
    }
  }
  return '';
}

function cleanLeadRecord(c) {
  let rawFirst = (c.firstName || '').trim();
  let rawComp = (c.companyName || '').trim();
  let email = (c.email || '').trim().toLowerCase();

  let cleanComp = rawComp.replace(/\s*[\(\[\{]\s*owner\s*[\)\]\}]/gi, '').replace(/\s{2,}/g, ' ').trim();

  let cleanFirst = '';
  
  const nameFromEmail = extractNameFromEmail(email);
  if (nameFromEmail) {
    cleanFirst = nameFromEmail;
  }

  if (!cleanFirst && rawFirst) {
    let fnClean = rawFirst.replace(/\s*[\(\[\{].*?[\)\]\}]/g, '').replace(/[^a-zA-Z]/g, '').trim().toLowerCase();
    const compFirstWord = cleanComp.replace(/[^a-zA-Z\s]/g, '').trim().toLowerCase().split(/\s+/)[0];
    
    if (COMMON_US_NAMES.has(fnClean) && fnClean !== compFirstWord) {
      cleanFirst = fnClean.charAt(0).toUpperCase() + fnClean.slice(1);
    }
  }

  return { cleanFirst, cleanComp };
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function cleanAllContacts() {
  console.log('\n======================================================');
  console.log('🚀 开始执行 GHL 全局联系人智能姓名与公司名清洗任务');
  console.log('======================================================\n');

  let totalScanned = 0;
  let totalUpdated = 0;
  let totalHumanNamesRecovered = 0;
  let searchAfter = null;
  let page = 1;
  const PAGE_SIZE = 100;

  while (true) {
    console.log(`正在拉取第 ${page} 页数据 (Page Size: ${PAGE_SIZE})...`);

    const payload = {
      locationId,
      pageLimit: PAGE_SIZE
    };
    if (searchAfter) {
      payload.searchAfter = searchAfter;
    }

    let res;
    try {
      res = await client.post('/contacts/search', payload);
    } catch (fetchErr) {
      console.error('拉取联系人失败，重试中...', fetchErr.response?.data || fetchErr.message);
      await sleep(2000);
      continue;
    }

    const contacts = res.data?.contacts || [];
    if (contacts.length === 0) {
      console.log('所有联系人拉取完毕。');
      break;
    }

    totalScanned += contacts.length;

    for (const c of contacts) {
      const { cleanFirst, cleanComp } = cleanLeadRecord(c);
      const originalFirst = (c.firstName || '').trim();
      const originalComp = (c.companyName || '').trim();

      const firstChanged = cleanFirst !== originalFirst;
      const compChanged = cleanComp !== originalComp;

      if (firstChanged || compChanged) {
        try {
          const updatePayload = {};
          if (firstChanged) updatePayload.firstName = cleanFirst;
          if (compChanged) updatePayload.companyName = cleanComp;

          await client.put(`/contacts/${c.id}`, updatePayload);
          totalUpdated++;
          if (cleanFirst) totalHumanNamesRecovered++;

          console.log(`[已修复 #${totalUpdated}] ID: ${c.id} | Email: ${c.email || 'N/A'}`);
          console.log(`  原值: First="${originalFirst}", Comp="${originalComp}"`);
          console.log(`  新值: First="${cleanFirst}", Comp="${cleanComp}"`);
          console.log(`  称谓: "Hi ${cleanFirst || 'there'},"`);
          
          await sleep(50); // 防限流
        } catch (updateErr) {
          console.error(`  [更新失败] ID: ${c.id}:`, updateErr.response?.data?.message || updateErr.message);
        }
      }
    }

    const lastContact = contacts[contacts.length - 1];
    if (lastContact?.searchAfter) {
      searchAfter = lastContact.searchAfter;
    } else {
      break;
    }

    page++;
    await sleep(200);
  }

  console.log('\n======================================================');
  console.log('🎉 GHL 联系人数据库全局清洗与修复圆满完成！');
  console.log(`- 扫描总数: ${totalScanned}`);
  console.log(`- 修复联系人数: ${totalUpdated}`);
  console.log(`- 成功反推真实人名数: ${totalHumanNamesRecovered}`);
  console.log('======================================================\n');
}

cleanAllContacts().catch(console.error);
