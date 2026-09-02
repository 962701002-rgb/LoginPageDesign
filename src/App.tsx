import { useState, useEffect, useRef } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Typography,
  Alert,
  Modal,
  Space,
  Divider,
  Segmented,
} from "antd";

const { Title, Text, Link, Paragraph } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────
type FormState =
  | "default" | "input-focus" | "password-focus"
  | "validation-error" | "loading" | "login-error" | "success";
type ModalType = "terms" | "privacy" | null;

// ─── Brand colors (left panel only — not Ant Design tokens) ──────────────────
const BRAND = {
  bg:   "#101912",
  mid:  "#2E4230",
  line: "#4A6A50",
  lite: "#7EAD8A",
  dim:  "#253828",
  text: "#C4D9C8",
};

// ─── Logo Mark ────────────────────────────────────────────────────────────────
function LogoMark({ inverted = false }: { inverted?: boolean }) {
  const primary = inverted ? BRAND.lite : "#1A6B44";
  const textColor = inverted ? BRAND.text : "#1A1A1A";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <polygon points="16,3 30,27 2,27"
          stroke={primary} strokeWidth="2" strokeLinejoin="round" fill="none" />
        <polyline points="16,3 10.5,18.5 21.5,18.5"
          stroke={primary} strokeWidth="1.1" opacity="0.4"
          strokeLinejoin="round" fill="none" />
        <polyline points="13.5,11.5 16,6 18.5,11.5"
          stroke={primary} strokeWidth="1.4"
          strokeLinejoin="round" fill="none" />
      </svg>
      <span style={{
        fontWeight: 600, fontSize: 18,
        color: textColor,
        letterSpacing: "-0.2px",
        fontFamily: "inherit",
      }}>
        TrailOps
      </span>
    </div>
  );
}

// ─── Mountain Illustration ────────────────────────────────────────────────────
function MountainIllustration() {
  return (
    <svg viewBox="0 0 580 400" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 580 }} aria-hidden="true">
      <defs>
        <linearGradient id="g-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BRAND.mid} stopOpacity="0.55" />
          <stop offset="100%" stopColor={BRAND.mid} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="g-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BRAND.line} stopOpacity="0.18" />
          <stop offset="100%" stopColor={BRAND.line} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <polyline
        points="0,310 60,250 110,275 170,210 230,235 290,170 360,200 420,148 490,170 540,155 580,162 580,400 0,400"
        fill="url(#g-far)" />
      <polyline
        points="0,310 60,250 110,275 170,210 230,235 290,170 360,200 420,148 490,170 540,155 580,162"
        stroke={BRAND.mid} strokeWidth="1" fill="none" opacity="0.6" />
      <polyline
        points="0,355 70,300 120,318 190,258 245,282 305,220 365,250 425,210 480,235 540,215 580,225 580,400 0,400"
        fill="url(#g-near)" />
      <polyline
        points="0,355 70,300 120,318 190,258 245,282 305,220 365,250 425,210 480,235 540,215 580,225"
        stroke={BRAND.line} strokeWidth="1.2" fill="none" opacity="0.45" />
      <polyline
        points="0,400 90,370 155,385 245,308 285,330 340,278 385,305 440,272 495,295 548,275 580,283 580,400"
        fill="url(#g-near)" />
      <polyline
        points="90,370 155,385 245,308 285,330 340,278 385,305 440,272 495,295 548,275"
        stroke={BRAND.lite} strokeWidth="1.5" fill="none" opacity="0.6" />
      <polyline
        points="220,400 265,318 285,330 340,278"
        stroke={BRAND.lite} strokeWidth="2" fill="none" opacity="0.55" />
      <circle cx="340" cy="277" r="3.5" fill={BRAND.lite} opacity="0.8" />
      <line x1="340" y1="264" x2="340" y2="277" stroke={BRAND.lite} strokeWidth="1.4" opacity="0.8" />
      <line x1="332" y1="270" x2="348" y2="270" stroke={BRAND.lite} strokeWidth="1.4" opacity="0.8" />
      <path d="M 285 330 Q 315 300 340 277"
        stroke={BRAND.lite} strokeWidth="1.2" strokeDasharray="5 4" fill="none" opacity="0.65" />
      {([[292,323],[303,314],[315,306],[327,296]] as [number,number][]).map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="2" fill={BRAND.lite} opacity="0.5" />
      ))}
      <path d="M 30,335 Q 120,315 210,325 Q 290,334 360,315 Q 430,298 510,308 Q 550,314 580,305"
        stroke={BRAND.mid} strokeWidth="0.8" fill="none" strokeDasharray="7 6" opacity="0.4" />
      <g transform="translate(532, 350)" opacity="0.5">
        <circle cx="0" cy="0" r="18" stroke={BRAND.line} strokeWidth="1" fill="none" />
        <circle cx="0" cy="0" r="2.5" fill={BRAND.line} />
        <polygon points="0,-12 2.5,-4 -2.5,-4" fill={BRAND.lite} />
        <polygon points="0,12 2.5,4 -2.5,4" fill={BRAND.line} opacity="0.4" />
        <text x="0" y="-15" textAnchor="middle" fontSize="7"
          fill={BRAND.lite} fontFamily="inherit" fontWeight="600">N</text>
      </g>
    </svg>
  );
}

// ─── Terms / Privacy content ──────────────────────────────────────────────────
const TERMS_CONTENT = {
  terms: {
    title: "用户协议",
    sections: [
      { heading: "第一条　适用范围", body: `本《用户协议》由您与 TrailOps 平台运营主体共同缔结，适用于您通过 TrailOps 平台（包括但不限于网页端、移动端及相关 API 接口）注册、登录及使用各项服务的全部行为。请在使用本平台前仔细阅读并充分理解本协议的各项条款。若您点击"登录"或以其他方式使用本平台，即表示您已阅读、理解并同意接受本协议的全部内容。` },
      { heading: "第二条　账号注册与管理", body: `2.1 注册资格。您须年满 18 周岁，具备完全民事行为能力，方可注册使用本平台。\n\n2.2 账号信息。您在注册时须提供真实、准确、完整的个人或组织信息，并在信息发生变化时及时更新。\n\n2.3 账号安全。您应妥善保管账号及密码，不得将账号以任何形式转让、出租或授权他人使用。如发现账号被盗用或存在异常，请立即联系我们。\n\n2.4 账号注销。您可通过平台提供的注销功能申请注销账号。账号注销后，相关数据将依法保留一定期限，期满后予以删除。` },
      { heading: "第三条　平台服务内容", body: `TrailOps 平台为户外活动组织者提供以下管理服务：活动创建与发布、报名管理、参与者信息管理、路线规划工具、紧急联络管理、财务结算报表、团队协作与权限管理，以及数据统计与分析功能。我们有权根据业务发展需要，在合理范围内调整、新增或终止部分服务，并提前通过平台公告或站内消息告知用户。` },
      { heading: "第四条　用户行为规范", body: `4.1 您在使用本平台过程中，不得从事以下行为：\n（一）发布虚假活动信息，欺骗参与者报名；\n（二）收取费用后无故取消活动且拒绝退款；\n（三）发布违反法律法规或公序良俗的活动内容；\n（四）侵犯他人知识产权、隐私权或其他合法权益；\n（五）利用平台从事非法集资、诈骗等违法活动；\n（六）未经许可抓取平台数据。\n\n4.2 对于违反上述规定的用户，我们有权视情节轻重采取警告、功能限制、账号封禁乃至依法追究法律责任等措施。` },
      { heading: "第五条　活动组织者的特别义务", body: `5.1 安全保障义务。活动组织者须在组织活动前充分评估活动风险，制定完善的应急预案，为参与者提供必要的安全保障措施。\n\n5.2 信息披露义务。活动发布前，组织者须如实披露活动难度等级、所需体能要求、装备要求、气象风险及已知危险路段等信息。\n\n5.3 合规义务。组织者须确保活动合法合规，取得必要的政府许可或场地使用授权，并遵守相关自然保护区、国家公园的管理规定。\n\n5.4 保险义务。建议组织者为参与活动的人员购买适当的意外伤害险及第三方责任险，并在活动详情页中明示保险信息。` },
      { heading: "第六条　知识产权", body: `平台内的所有内容，包括但不限于文字、图片、图标、音视频、软件代码及数据库，除用户上传内容外，均为 TrailOps 或相关权利人所有，受著作权法及其他知识产权法律保护。未经授权，您不得以任何形式复制、传播、修改或商业利用上述内容。` },
      { heading: "第七条　免责声明", body: `7.1 本平台作为信息服务提供者，不对因活动组织者行为导致的人身伤害或财产损失承担责任。\n\n7.2 因不可抗力（包括自然灾害、政府行为、网络故障等）导致服务中断或数据丢失的，我们在法律允许范围内免于承担责任，但将尽合理努力恢复服务。` },
      { heading: "第八条　协议修改", body: `我们有权在必要时修改本协议。协议修改后，将在平台显著位置公告，并以站内消息或电子邮件方式通知注册用户。若您在修改生效后继续使用本平台，视为您接受修改后的协议。` },
      { heading: "第九条　争议解决", body: `本协议受中华人民共和国法律管辖。因本协议引起或与本协议相关的任何争议，双方应首先通过友好协商解决；协商不成的，任一方可将争议提交至 TrailOps 运营主体所在地有管辖权的人民法院诉讼解决。` },
      { heading: "第十条　联系我们", body: `电子邮件：legal@trailops.cn\n工作时间：周一至周五 09:00–18:00（法定节假日除外）` },
    ],
  },
  privacy: {
    title: "隐私政策",
    sections: [
      { heading: "引言", body: `TrailOps 平台高度重视用户隐私保护。本《隐私政策》旨在向您说明我们收集哪些信息、如何使用这些信息、如何保护您的信息，以及您对自身信息所享有的权利。` },
      { heading: "一、我们收集的信息", body: `1.1 您主动提供的信息：\n· 注册信息：手机号码、电子邮箱、姓名、所属组织名称；\n· 实名认证信息：身份证号码、证件照片（仅用于认证，加密存储）；\n· 活动信息：您创建的活动详情、路线数据、参与者名单；\n· 支付信息：由第三方支付机构处理，我们不存储完整卡号。\n\n1.2 我们自动收集的信息：\n· 设备信息：设备型号、操作系统版本、唯一设备标识符；\n· 日志信息：IP 地址、访问时间、浏览页面；\n· Cookie 及类似技术：用于维持登录状态、统计访问数据。` },
      { heading: "二、信息的使用目的", body: `我们将收集到的信息用于以下目的：\n· 提供、维护和改善平台服务；\n· 验证您的身份，防止欺诈行为；\n· 处理活动报名、支付及退款；\n· 向您发送服务通知、活动提醒及重要公告；\n· 分析用户行为，优化产品体验（使用脱敏或汇总数据）；\n· 遵守法律法规的要求。\n\n我们不会将您的个人信息出售给任何第三方。` },
      { heading: "三、信息共享", body: `3.1 仅在以下情形下，我们会与第三方共享您的信息：\n· 征得您的明确同意；\n· 与合作的支付机构、云服务商共享，范围仅限于提供服务所必需；\n· 遵守法律要求或响应司法、行政机关的合法请求。\n\n3.2 我们要求所有合作方签署保密协议，并遵守不低于本政策标准的数据保护措施。` },
      { heading: "四、信息存储与安全", body: `4.1 存储地点：您的数据存储在中国境内的服务器。\n4.2 存储期限：账号注销后，我们将在法律规定的最短保留期届满后删除或匿名化处理您的个人信息。交易记录依据财务法规保留 5 年。\n4.3 安全措施：我们采用 TLS 加密传输、数据库字段级加密、访问控制与审计日志等技术手段保护您的信息。` },
      { heading: "五、您的权利", body: `依据《个人信息保护法》等相关法律，您享有查阅权、更正权、删除权、撤回同意权、可携带权及投诉权。\n\n行使上述权利，请联系：privacy@trailops.cn` },
      { heading: "六、Cookie 的使用", body: `我们使用 Cookie 及类似技术维持您的登录状态、记住您的偏好设置，并统计平台访问数据。您可通过浏览器设置拒绝 Cookie，但这可能导致部分功能无法正常使用。` },
      { heading: "七、未成年人保护", body: `本平台不向 18 周岁以下未成年人提供服务。若我们发现在未获得可证实的父母同意的情况下收集了未成年人的个人信息，将尽快予以删除。` },
      { heading: "八、政策更新", body: `本隐私政策可能随业务变化或法规要求而更新。更新后，我们将在平台显著位置公告，并在变更生效前 7 日以站内消息通知您。` },
      { heading: "九、联系我们", body: `电子邮件：privacy@trailops.cn\n工作时间：周一至周五 09:00–18:00` },
    ],
  },
};

// ─── Terms Modal (antd Modal) ─────────────────────────────────────────────────
function TermsModal({ type, onClose }: { type: ModalType; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (type && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [type]);

  if (!type) return null;
  const content = TERMS_CONTENT[type];

  return (
    <Modal
      open={!!type}
      onCancel={onClose}
      title={
        <Space size={12}>
          <div style={{
            width: 32, height: 32,
            borderRadius: "50%",
            background: "#E8F5EF",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* Ant Design–style document icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="1" width="10" height="14" rx="1.5" stroke="#1A6B44" strokeWidth="1.2" />
              <line x1="5" y1="5.5" x2="9" y2="5.5" stroke="#1A6B44" strokeWidth="1" strokeLinecap="round" />
              <line x1="5" y1="8" x2="11" y2="8" stroke="#1A6B44" strokeWidth="1" strokeLinecap="round" />
              <line x1="5" y1="10.5" x2="10" y2="10.5" stroke="#1A6B44" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 600 }}>{content.title}</span>
        </Space>
      }
      footer={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>最后更新：2026-08-01</Text>
          <Button type="primary" onClick={onClose}>关闭</Button>
        </div>
      }
      width={720}
      styles={{
        body: { padding: 0 },
        content: { borderRadius: 12, overflow: "hidden" },
        header: { padding: "20px 24px 16px", borderBottom: "1px solid #F0F0F0" },
        footer: { padding: "14px 24px", borderTop: "1px solid #F0F0F0", margin: 0 },
      }}
      centered
      destroyOnHidden
    >
      <div ref={scrollRef} style={{ height: 500, overflowY: "auto", padding: "24px 24px 8px" }}>
        <Space direction="vertical" size={24} style={{ width: "100%" }}>
          {content.sections.map((s, i) => (
            <div key={i}>
              <Text strong style={{ fontSize: 14, display: "block", marginBottom: 8 }}>
                {s.heading}
              </Text>
              <Paragraph
                style={{
                  fontSize: 14, color: "#595959",
                  lineHeight: 1.75, whiteSpace: "pre-line",
                  margin: 0,
                }}
              >
                {s.body}
              </Paragraph>
            </div>
          ))}
        </Space>
        <div style={{ height: 8 }} />
      </div>
    </Modal>
  );
}

// ─── State Switcher ───────────────────────────────────────────────────────────
const STATE_OPTIONS = [
  { value: "default",          label: "Default"     },
  { value: "input-focus",      label: "Input Focus"  },
  { value: "password-focus",   label: "Pwd Focus"    },
  { value: "validation-error", label: "Validation"   },
  { value: "loading",          label: "Loading"      },
  { value: "login-error",      label: "Login Error"  },
  { value: "success",          label: "Success"      },
];

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage({ state, onOpenModal }: {
  state: FormState; onOpenModal: (t: ModalType) => void;
}) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [form]                  = Form.useForm();

  const emailHasErr    = state === "validation-error";
  const passwordHasErr = state === "validation-error";
  const isLoading      = state === "loading";
  const isSuccess      = state === "success";
  const isDisabled     = isLoading || isSuccess;

  // Sync simulated focus states via Form
  useEffect(() => {
    if (state === "input-focus") {
      document.getElementById("field-email")?.focus();
    } else if (state === "password-focus") {
      document.getElementById("field-password_input")?.focus();
    }
  }, [state]);

  return (
    <div style={{ display: "flex", height: "100%", width: "100%" }}>

      {/* ── Left: Brand Panel ──────────────────────────────────────────── */}
      <div style={{
        width: "42%", flexShrink: 0,
        background: BRAND.bg,
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        padding: "52px 60px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Top fade */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 100,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.2), transparent)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative" }}>
          <LogoMark inverted />
        </div>

        <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", paddingBlock: 24 }}>
          <MountainIllustration />
        </div>

        <div style={{ position: "relative" }}>
          <Divider style={{ borderColor: BRAND.dim, margin: "0 0 24px" }} />
          <p style={{
            fontSize: 22, fontWeight: 300,
            color: BRAND.text,
            lineHeight: 1.5, letterSpacing: "0.2px",
            marginBottom: 20,
          }}>
            让每一次户外活动，<br />都更简单
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["活动管理", "参与者跟踪", "路线规划", "数据报告"].map(f => (
              <span key={f} style={{
                fontSize: 11, fontWeight: 500,
                padding: "4px 12px",
                borderRadius: 20,
                border: `1px solid ${BRAND.mid}`,
                color: BRAND.line,
                letterSpacing: "0.6px",
              }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Login Form ───────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        background: "#FFFFFF",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "52px 80px",
        overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: 440 }}>

          {/* Logo */}
          <div style={{ marginBottom: 36 }}>
            <LogoMark />
          </div>

          {/* Headline */}
          <div style={{ marginBottom: 32 }}>
            <Title level={2} style={{ marginBottom: 6, fontSize: 28, fontWeight: 600, color: "#1A1A1A" }}>
              欢迎回来
            </Title>
            <Text style={{ fontSize: 15, color: "#595959" }}>
              登录组织者管理平台
            </Text>
          </div>

          {/* Error banner — antd Alert component */}
          {state === "login-error" && (
            <div style={{ marginBottom: 24 }}>
              <Alert
                type="error"
                message="手机号/邮箱或密码错误，请重新输入"
                showIcon
                style={{ borderRadius: 6 }}
              />
            </div>
          )}

          {/* Success banner */}
          {isSuccess && (
            <div style={{ marginBottom: 24 }}>
              <Alert
                type="success"
                message="登录成功 — 正在跳转至工作台…"
                showIcon
                style={{ borderRadius: 6 }}
              />
            </div>
          )}

          {/* Form — antd Form with vertical layout */}
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            style={{ display: "flex", flexDirection: "column", gap: 0 }}
          >
            <Space direction="vertical" size={20} style={{ width: "100%" }}>

              {/* antd Input — Phone / Email */}
              <Form.Item
                name="email"
                label={<Text strong style={{ fontSize: 14 }}>手机号 / 邮箱</Text>}
                validateStatus={emailHasErr ? "error" : undefined}
                help={emailHasErr ? "请输入正确的手机号或邮箱" : undefined}
                style={{ marginBottom: 0 }}
              >
                <Input
                  id="field-email"
                  placeholder="请输入手机号或邮箱"
                  size="large"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isDisabled}
                  style={{ height: 44 }}
                  allowClear
                />
              </Form.Item>

              {/* antd Input.Password — Password with eye toggle */}
              <Form.Item
                name="password"
                label={<Text strong style={{ fontSize: 14 }}>密码</Text>}
                validateStatus={passwordHasErr ? "error" : undefined}
                help={passwordHasErr ? "请输入密码" : undefined}
                style={{ marginBottom: 0 }}
              >
                <Input.Password
                  id="field-password"
                  placeholder="请输入密码"
                  size="large"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isDisabled}
                  style={{ height: 44 }}
                />
              </Form.Item>

              {/* Remember + Forgot */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {/* antd Checkbox */}
                <Checkbox
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  disabled={isDisabled}
                >
                  <Text style={{ fontSize: 14, color: "#595959" }}>记住我</Text>
                </Checkbox>
                {/* antd Link */}
                <Link
                  href="#"
                  style={{ fontSize: 14 }}
                  disabled={isDisabled}
                  onClick={e => e.preventDefault()}
                >
                  忘记密码？
                </Link>
              </div>

              {/* antd Button — Primary, loading state */}
              <Button
                type="primary"
                size="large"
                block
                loading={isLoading}
                disabled={isSuccess}
                style={{ height: 48, fontSize: 15, fontWeight: 500, borderRadius: 6 }}
              >
                {isSuccess ? "登录成功" : "登录"}
              </Button>

              {/* Register entry */}
              <div style={{ textAlign: "center" }}>
                <Text style={{ fontSize: 14, color: "#595959" }}>还没有组织者账号？</Text>
                <Link
                  href="#"
                  style={{ fontSize: 14, marginLeft: 4 }}
                  disabled={isDisabled}
                  onClick={e => e.preventDefault()}
                >
                  申请成为组织者
                </Link>
              </div>

            </Space>
          </Form>

          {/* Footer */}
          <Divider style={{ margin: "28px 0 20px", borderColor: "#F0F0F0" }} />
          <div style={{ textAlign: "center" }}>
            <Text style={{ fontSize: 12, color: "#8C8C8C" }}>
              登录即表示你同意{" "}
              <Link
                href="#"
                style={{ fontSize: 12 }}
                onClick={e => { e.preventDefault(); onOpenModal("terms"); }}
              >
                《用户协议》
              </Link>
              {" "}和{" "}
              <Link
                href="#"
                style={{ fontSize: 12 }}
                onClick={e => { e.preventDefault(); onOpenModal("privacy"); }}
              >
                《隐私政策》
              </Link>
            </Text>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeState, setActiveState] = useState<FormState>("default");
  const [modalType,   setModalType]   = useState<ModalType>(null);

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100vh", width: "100vw", overflow: "hidden",
    }}>
      {/* Demo state switcher — antd Segmented */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "8px 16px", flexShrink: 0,
        background: "#FAFAFA",
        borderBottom: "1px solid #F0F0F0",
      }}>
        <Text type="secondary" style={{ fontSize: 12, fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>
          State ·
        </Text>
        <Segmented
          size="small"
          options={STATE_OPTIONS}
          value={activeState}
          onChange={v => setActiveState(v as FormState)}
          style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
        />
      </div>

      {/* Page */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <LoginPage state={activeState} key={activeState} onOpenModal={setModalType} />
      </div>

      {/* antd Modal — Terms / Privacy */}
      <TermsModal type={modalType} onClose={() => setModalType(null)} />
    </div>
  );
}
