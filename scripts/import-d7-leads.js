const fs = require('fs');
const path = require('path');

// 只跑扫描不写入：node scripts/import-d7-leads.js leads.csv --dry-run
const DRY_RUN = process.argv.includes('--dry-run');

// 1. 加载 GHL 环境配置。
// 不依赖 dotenv —— 这是个 CLI 脚本，不值得给 Next 应用加运行时依赖。
function parseEnvFile(file) {
  const out = {};
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const i = t.indexOf('=');
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

const ENV_CANDIDATES = [
  path.join(__dirname, '../.env.local'),
  path.join(__dirname, '../.env'),
  path.join(__dirname, '../ghl-mcp/.env')
];
const envPath = ENV_CANDIDATES.find((p) => fs.existsSync(p));
if (!envPath) {
  console.error('错误: 没找到 .env 文件，找过这些位置:\n  ' + ENV_CANDIDATES.join('\n  '));
  process.exit(1);
}

const env = parseEnvFile(envPath);
const apiKey = env.GHL_API_KEY;
const locationId = env.GHL_LOCATION_ID;

if (!apiKey || !locationId) {
  console.error('错误: .env 文件中缺少 GHL_API_KEY 或 GHL_LOCATION_ID');
  process.exit(1);
}

// 用内置 fetch 模拟 axios 的 { data } 形状，并在非 2xx 时抛出带 response 的错误，
// 这样下面 err.response?.data?.message 的处理逻辑不用改。
const ghlClient = {
  async post(url, body) {
    const res = await fetch('https://services.leadconnectorhq.com' + url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        Version: '2021-07-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    let data = null;
    try { data = await res.json(); } catch (_) { /* 空响应体 */ }
    if (!res.ok) {
      const err = new Error(`HTTP ${res.status}`);
      err.response = { status: res.status, data };
      throw err;
    }
    return { data };
  }
};

// 2. 简易通用 CSV 解析器 (支持处理带双引号的字段)
function parseCSV(content) {
  const lines = [];
  let currentLine = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // 跳过转义引号
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentLine.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentLine.push(currentField.trim());
      if (currentLine.some(f => f !== '')) {
        lines.push(currentLine);
      }
      currentLine = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField !== '' || currentLine.length > 0) {
    currentLine.push(currentField.trim());
    if (currentLine.some(f => f !== '')) {
      lines.push(currentLine);
    }
  }

  if (lines.length === 0) return [];

  const headers = lines[0].map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const row = {};
    headers.forEach((h, index) => {
      row[h] = lines[i][index] || '';
    });
    data.push(row);
  }

  return data;
}

// 3. 数据清洗助手函数
function sanitizeEmail(email) {
  if (!email) return null;
  const cleaned = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleaned) ? cleaned : null;
}

function sanitizePhone(phone) {
  if (!phone) return null;
  // 提取纯数字
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return '+1' + digits; // 补充美国/加拿大区号
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return '+' + digits;
  }
  return digits.length >= 7 ? '+' + digits : null;
}

function sanitizeDomain(url) {
  if (!url) return '';
  try {
    let formatted = url.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = 'https://' + formatted;
    }
    const parsed = new URL(formatted);
    return parsed.hostname.replace(/^www\./, '');
  } catch (e) {
    return url.trim();
  }
}

// 查找 CSV 对应字段
function getFieldValue(row, possibleKeys) {
  for (const k of possibleKeys) {
    const keyMatch = Object.keys(row).find(headerKey => headerKey.includes(k));
    if (keyMatch && row[keyMatch]) {
      return row[keyMatch];
    }
  }
  return '';
}

// 4. 核心清洗与导入主逻辑
async function processD7LeadCSV(filePath) {
  console.log(`\n========================================`);
  console.log(`开始读取 D7 Lead 文件: ${filePath}`);
  console.log(`========================================\n`);

  if (!fs.existsSync(filePath)) {
    console.error(`错误: 找不到文件 ${filePath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const rows = parseCSV(fileContent);

  console.log(`共解析出 ${rows.length} 条原始记录，开始清洗并同步到 GHL CRM...\n`);

  const stats = {
    total: rows.length,
    success: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    details: []
  };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // 尝试匹配不同 D7 表头命名格式
    const companyName = getFieldValue(row, ['company', 'businessname', 'name', 'title']) || 'Plumbing Contractor';
    const rawEmail = getFieldValue(row, ['email', 'mail', 'emailaddress']);
    const rawPhone = getFieldValue(row, ['phone', 'telephone', 'mobile', 'cell']);
    const rawWebsite = getFieldValue(row, ['website', 'site', 'url', 'domain']);
    const city = getFieldValue(row, ['city', 'town', 'location']);
    const state = getFieldValue(row, ['state', 'province']);
    const facebook = getFieldValue(row, ['facebook', 'fb']);
    const linkedin = getFieldValue(row, ['linkedin']);

    const email = sanitizeEmail(rawEmail);
    const phone = sanitizePhone(rawPhone);
    const domain = sanitizeDomain(rawWebsite);

    // 去重/质量保障逻辑：如果没有有效的邮箱也没有有效电话，标记为不符合标准跳过
    if (!email && !phone) {
      console.log(`[跳过 ${i + 1}/${rows.length}] 公司: ${companyName} - 缺少合规的邮箱与电话`);
      stats.skipped++;
      stats.details.push({ company: companyName, status: 'SKIPPED', reason: 'Missing email and phone' });
      continue;
    }

    // 姓名：只有拿到真实店主姓名才填 firstName/lastName。
    //
    // 这里以前是 firstName = companyName; lastName = '(Owner)'，于是外发邮件
    // 的 {{contact.first_name}} 渲染成 "Hi All Purpose Plumbing," —— 更常见的是
    // 只取到首词，变成 "Hi All," / "Hi 509," / "Hi H2o,"。名单里 2,175 条是这么坏掉的。
    // 没有姓名时留空：显示名走 name 字段承载公司名，文案改用 {{contact.company_name}}。
    const ownerName = getFieldValue(row, [
      'owner', 'ownername', 'contactname', 'contact', 'contactperson',
      'firstname', 'fullname', 'manager', 'principal'
    ]);

    const nameParts = (ownerName || '')
      .trim()
      .replace(/\s*\((owner|manager|ceo|president)\)\s*$/i, '')
      .split(/\s+/)
      .filter(Boolean);

    // 单个词又和公司名重合的，是公司名不是人名
    const looksLikeCompany =
      nameParts.length > 0 &&
      companyName.toLowerCase().includes(nameParts.join(' ').toLowerCase());

    const firstName = looksLikeCompany ? '' : (nameParts[0] || '');
    const lastName = looksLikeCompany ? '' : nameParts.slice(1).join(' ');

    // 组合联系人数据 Payload
    const contactPayload = {
      locationId: locationId,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      name: firstName ? `${firstName} ${lastName}`.trim() : companyName,
      companyName: companyName,
      email: email || undefined,
      phone: phone || undefined,
      city: city || undefined,
      state: state || undefined,
      website: domain ? `https://${domain}` : undefined,
      tags: ['cold-email-pending', 'cold-sms-pending']
    };

    if (DRY_RUN) {
      console.log(`[试运行 ${i + 1}/${rows.length}] 公司: ${companyName} | 姓名: ${firstName ? firstName + ' ' + lastName : '(留空)'} | 邮箱: ${email || '无'} | 电话: ${phone || '无'}`);
      stats.success++;
      stats.details.push({ company: companyName, firstName, lastName, email, phone, status: 'DRY_RUN' });
      continue;
    }

    try {
      // 优先使用 GHL Upsert 接口（如果已存在 Email/Phone 则自动更新）
      const response = await ghlClient.post('/contacts/upsert', contactPayload);
      const contact = response.data?.contact || response.data;

      if (response.data?.new) {
        console.log(`[新增成功 ${i + 1}/${rows.length}] CRM ID: ${contact.id} | 公司: ${companyName} | 邮箱: ${email || '无'} | 电话: ${phone || '无'}`);
        stats.success++;
      } else {
        console.log(`[更新成功 ${i + 1}/${rows.length}] CRM ID: ${contact.id} | 公司: ${companyName} | 记录已存在，完成数据更新`);
        stats.updated++;
      }

      stats.details.push({
        company: companyName,
        contactId: contact.id,
        email: email,
        phone: phone,
        status: 'SUCCESS'
      });

    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      console.error(`[导入失败 ${i + 1}/${rows.length}] 公司: ${companyName} | 原因: ${errorMsg}`);
      stats.failed++;
      stats.details.push({ company: companyName, status: 'FAILED', reason: errorMsg });
    }
  }

  // 写入处理报告日志到本地
  const reportPath = path.join(__dirname, `../d7_import_report_${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(stats, null, 2));

  console.log(`\n========================================`);
  console.log(`导入任务完成！处理报告已生成: ${reportPath}`);
  console.log(`----------------------------------------`);
  console.log(`• 原始记录总数: ${stats.total}`);
  console.log(`• 成功新增到 CRM: ${stats.success}`);
  console.log(`• 成功更新 CRM 记录: ${stats.updated}`);
  console.log(`• 跳过无效记录: ${stats.skipped}`);
  console.log(`• 失败数量: ${stats.failed}`);
  console.log(`========================================\n`);
}

// 5. 命令行入口
let inputFilePath = process.argv[2];
if (!inputFilePath) {
  console.log(`
使用方法:
  node scripts/import-d7-leads.js <D7导出文件路径.csv>

示例:
  node scripts/import-d7-leads.js "~/Downloads/Plumber Company Plumbing in Long Beach, CA (Report by leon).csv"
`);
  process.exit(0);
}

// 自动处理波浪号 ~ 路径展开与多余前缀清洗
if (inputFilePath.startsWith('~/')) {
  inputFilePath = path.join(process.env.HOME || '/Users/peifengni', inputFilePath.slice(2));
}
if (inputFilePath.includes('/Users/peifengni/Users/peifengni/')) {
  inputFilePath = inputFilePath.replace('/Users/peifengni/Users/peifengni/', '/Users/peifengni/');
}

processD7LeadCSV(path.resolve(inputFilePath));
