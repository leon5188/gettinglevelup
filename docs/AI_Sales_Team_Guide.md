# Plumbify AI 销售智能体团队 - 完整使用指南
本指南将详细介绍如何使用这套由 `Agent 1 (线索抓取)`、`Agent 2 (话术生成)` 和 `Agent 3 (绩效分析)` 组成的 AI 自动销售流水线。

---

## 目录
1. [前期准备：环境校验](#1-前期准备环境校验)
2. [第一阶段：本地手动测试（开发验证）](#2-第一阶段本地手动测试开发验证)
3. [第二阶段：本地网页触发（集成验证）](#3-第二阶段本地网页触发集成验证)
4. [第三阶段：部署至云端（Vercel 全自动运行）](#4-第三阶段部署至云端vercel-全自动运行)
5. [第四阶段：GoHighLevel (GHL) 后台工作流配置](#5-第四阶段gohighlevel-ghl-后台工作流配置)

---

## 1. 前期准备：环境校验

请确保您的项目根目录下的 `.env.local` 文件已正确配置以下三个核心密钥（脚本会自动读取它们）：

```bash
# 您的 Gemini 大模型 API Key（用于提炼数据和写开发信）
GEMINI_API_KEY="your_gemini_api_key_here"

# 您的 GoHighLevel 私有 API 令牌
GHL_PRIVATE_TOKEN="your_ghl_private_token_here"

# 您的 GoHighLevel 商业位置 ID
GHL_LOCATION_ID="your_ghl_location_id_here"

# （新增）用于保护定时任务路由的安全密码
CRON_SECRET="your_custom_cron_secret"
```

---

## 2. 第一阶段：本地手动测试（开发验证）

您可以在本地终端中，通过执行命令行脚本来直接操作您的 AI 团队：

### 步骤 1：启动 Agent 1 抓取线索并同步至 GHL
运行以下命令，AI 会在 DuckDuckGo 中检索指定的关键词，抓取官网并使用 Gemini 智能提取联系人资料，最后自动写入 GHL Contacts 列表中，并打上 `cold-email-pending` 标签：
```bash
python3 scripts/harvest_leads.py --query "plumbers in Houston, TX" --limit 2
```
* **参数说明**：
  * `--query`：搜索词，支持任何本地生活服务搜索（例如 `"HVAC in Austin"`）。
  * `--limit`：本次抓取并同步的最大商户数（默认 5）。

### 步骤 2：启动 Agent 2 针对线索生成个性化开发信
运行以下命令，AI 会自动从 GHL 中拉取标记为 `cold-email-pending`（或 `cold-sms-pending`）的客户，读取其官网痛点，自动撰写极具说服力的冷开发信，并以 **Note 备注** 的形式写到该客户的 GHL 主页上，同时将标签更新为 `outreach-drafted`：
```bash
python3 scripts/outreach_agent.py --limit 2
```

### 步骤 3：启动 Agent 3 生成周销售分析报告
运行以下命令，AI 会从 GHL 中统计本周新增的线索数、话术生成数、转化数等，由 Gemini 生成商业绩效剖析，并利用 ReportLab 生成精美的 PDF 报告：
```bash
python3 scripts/analyst_agent.py
```
* **查看报告**：生成的 PDF 存放在 [public/reports/weekly_sales_report.pdf](weekly_sales_report.pdf) 中。您双击即可打开查看。

---

## 3. 第二阶段：本地网页触发（集成验证）

除了命令行，我们还开发了 Next.js 路由接口，您可以通过在浏览器中输入网址来手动触发这三个 Agent 的工作：

1. **首先启动本地 Next 开发服务器**：
   ```bash
   npm run dev
   ```
2. **在浏览器中直接触发测试**（注意：必须携带您的 `secret` 参数）：
   * **触发 Agent 1 抓取**：
     访问：`http://localhost:3000/api/cron/harvest?secret=plumbify_cron_default_secret_2026&query=plumbers+in+Houston&limit=2`
   * **触发 Agent 2 写信**：
     访问：`http://localhost:3000/api/cron/outreach?secret=plumbify_cron_default_secret_2026&limit=2`
   * **触发 Agent 3 生成 PDF 报告**：
     访问：`http://localhost:3000/api/cron/analyst?secret=plumbify_cron_default_secret_2026`
   * **在浏览器中直接查看生成的 PDF 报告**：
     访问：`http://localhost:3000/reports/weekly_sales_report.pdf`

---

## 4. 第三阶段：部署至云端（Vercel 全自动运行）

一旦在本地验证没有问题，您可以将代码推送至您的线上 GitHub 并部署到 Vercel：

1. **在 Vercel 控制台配置环境变量**：
   * 登录 Vercel，进入 Plumbify 项目设置（Settings -> Environment Variables）。
   * 将 `.env.local` 中的 4 个变量（`GEMINI_API_KEY`、`GHL_PRIVATE_TOKEN`、`GHL_LOCATION_ID`、`CRON_SECRET`）全部添加进去。
2. **推送代码部署**：
   * 推送代码后，Vercel 会自动读取 `vercel.json` 配置文件。
3. **云端自动运行时间表**：
   Vercel 的 Cron 机制会在每天在云端自动触发您的接口：
   * **周一至周五 09:00 (CST)**：自动收割新线索 (`/api/cron/harvest`)。
   * **周一至周五 10:00 (CST)**：自动为线索生成定制开发信备注 (`/api/cron/outreach`)。
   * **每周五傍晚 18:00 (CST)**：自动复盘本周转化并更新周 PDF 报表 (`/api/cron/analyst`)。

---

## 5. 第四阶段：GoHighLevel (GHL) 后台工作流配置

AI Agent 2 把开发信写到客户的 **Notes 备注** 里了，您可以通过以下两种方式在 GHL 后台进行发送：

### 方式 A：人机协同模式（最推荐、安全）
1. 每日登录您的 GHL 后台，查看被打上 `outreach-drafted` 标签的新联系人。
2. 打开联系人详情页，右侧的 **Notes (备注)** 中已经有 AI 写好的完美冷邮件（Subject 和 Body）。
3. 快速扫一眼，无误后点击复制，粘贴进邮件框中发送给客户。
4. 这种方式既节省了 90% 的构思话术时间，又保证了 100% 的人工把关安全度。

### 方式 B：全自动发送模式
如果您希望 GHL 能够自动读取 AI 写好的内容并自动发送：
1. **在 GHL 创建自定义字段**：
   * 进入 GHL 设置 (Settings -> Custom Fields)，添加一个“多行文本 (Text Multiline)”类型的自定义字段，命名为 `Personalized Email Body`。
2. **修改代码同步接口**：
   * 将 [harvest_leads.py](file:///Users/peifengni/plumbify-site/scripts/harvest_leads.py) 和 [outreach_agent.py](file:///Users/peifengni/plumbify-site/scripts/outreach_agent.py) 中写入 Notes 的部分，改为直接给此自定义属性赋值（填入对应的 customField ID）。
3. **配置 GHL 自动化流 (Workflow)**：
   * 在 GHL Automation 中创建一个工作流：
     * **触发器**：标签被添加为 `outreach-drafted`。
     * **动作**：发送邮件 (Send Email)。
     * **邮件内容**：在邮件正文里，直接点击插入 Custom Value，选择刚才创建的自定义属性字段 `{{ contact.personalized_email_body }}`。
   * 只要标签一变，GHL 系统就会自动把 AI 刚刚写好的个性化邮件发送给这名客户！
