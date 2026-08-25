# StoreGuard AI — 独立自助仓储（Self-Storage）无人化运营系统方案

## 1. 赛道定位与核心价值主张 (Value Proposition)

### 目标客户群体
- **美国独立中小型 Self-Storage 运营商（Independent & Mom-and-Pop Operators）**
- 单体园区规模：50 - 300 间仓房（Units）
- 园区特征：无全职前台或只有兼职保洁，老板希望实现“100% 被动收入与无人值守”。

### 核心价值主张 (The Pitch)
> **"Turn Your Storage Facility into a 100% Unattended, 24/7 Cash Machine for $199/Month."**
> - 节省每月 $3,500 - $4,500 的全职前台雇佣成本；
> - 0 漏单：周六日与下班后 24/7 自动秒级接单与空仓报价；
> - 0 骚扰：租客查大门密码（Gate Code）、在线缴费 100% 全自动处理；
> - 0 法律风险：各州合规留置权清退（Lien Law）定时自动履约。

---

## 2. 商业定价模型 (Unit Economics)

| 套餐 | 适用规模 | 价格 (MRR) | 核心包含功能 |
| :--- | :--- | :--- | :--- |
| **Starter (无人值守版)** | 50 - 150 Units | **$199 / 月** | • 24/7 AI 电话/短信接待员<br/>• 大门密码秒查 (Gate Code Lookup)<br/>• 手机一键签约与支付链接<br/>• 每月自动 Text-to-Pay 房租账单 |
| **Growth (全自动清退版)** | 150 - 300 Units | **$349 / 月** | • 包含 Starter 全部功能<br/>• 各州法定 Lien 留置权催缴与拍卖流程<br/>• 自动挂锁提醒与逾期封条通知<br/>• Google 5星好评自动化收集系统 |
| **Enterprise (多园区版)** | 3+ Facilities | **$599+ / 月** | • 集中多园区看板 + 定制门禁系统集成 |

---

## 3. GHL 仓储专属快照规范 (Snapshot Architecture)

### 3.1 自定义字段 (Custom Fields)
- `unit_number` (仓房编号，如 `A-102`)
- `unit_size` (尺寸规格，如 `10x10`, `10x20`, `Climate Controlled`)
- `gate_code` (大门进出密码，如 `5938#`)
- `monthly_rent` (月租金，如 `$145.00`)
- `rent_due_day` (每月到期日，如 `1st`)
- `delinquency_status` (正常 / 逾期5天 / 逾期14天已挂锁 / 留置权拍卖)

### 3.2 4 大核心工作流逻辑 (Workflows)

#### 工作流 1：24/7 找房与空仓报价 (After-Hours Move-In)
- **触发**：未接来电或短信问价格/尺寸。
- **动作**：5 秒内回复空仓价格表 + 手机端即时签约/选仓链接。

#### 工作流 2：大门密码智能秒回 (Gate Code Rescue)
- **触发**：租客用注册手机号发送 *"Code"*, *"Gate"*, *"Forgot"* 等关键词。
- **动作**：系统自动核对来电手机号 ➔ 1 秒内秒回：
  `"Hi {{contact.first_name}}, your gate access code for Unit {{contact.unit_number}} is: {{contact.gate_code}}. Gate hours: 6:00 AM - 10:00 PM daily."`

#### 工作流 3：每月自动房租账单与 Text-to-Pay
- **触发**：每月到期日前 3 天。
- **动作**：自动发送带 Stripe/GHL 快捷支付链接的短信，支持 Apple Pay / Google Pay 一键付清。

#### 工作流 4：各州法定留置权 Lien 催缴流 (Lien Compliance)
- **Day 5**：自动追加滞纳金 + 友好短信提醒。
- **Day 14**：触发短信通知租客门禁权限暂停，并通知管理员去挂黄色封条锁（Overlock）。
- **Day 30**：自动生成所在州合规 *Notice of Lien & Intent to Sell* 挂号信凭证。

---

## 4. 获客冷触达话术 (Cold Outreach Hook)

### Email / SMS Step 1: 极简痛点软提问
> **Subject**: quick question for {{contact.company_name}}
> 
> *Hi {{contact.first_name}},*
> 
> *Quick question regarding {{contact.company_name}} — when someone drives by at 6:30 PM on a Saturday asking about a 10x10 unit or a tenant forgets their gate code, does it go to voicemail or get an instant 5-second text response?*
> 
> *We built a 24/7 unattended AI manager for independent self-storage operators that captures after-hours move-ins and handles gate code lookups automatically.*
> 
> *Open to a quick 20-second video demo showing how it works?*
> 
> *Best,*  
> *Alex | StoreGuard AI*
