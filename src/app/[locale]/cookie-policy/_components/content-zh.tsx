import * as React from "react";

import type { PolicySection } from "../../_components/policy-page-layout";

/** Chinese Cookie Policy content — translated from the English production copy. */

const ext = "text-[#C87533] hover:underline";

export const cookieIntroZh: React.ReactNode[] = [
  <>
    本 Cookie 政策（以下简称&ldquo;本政策&rdquo;）说明了运营{" "}
    <a href="https://www.remitech.ai" className={ext}>
      www.remitech.ai
    </a>
    （以下简称&ldquo;本网站&rdquo;）的 Remi Technology Pte. Ltd. 及其关联实体（统称
    &ldquo;Remi&rdquo;、&ldquo;我们&rdquo;）在本网站上如何使用 Cookie 及类似技术。
  </>,
  <>本政策应与 Remi 隐私声明一并阅读，该声明更概括地说明了我们如何收集、使用、披露和保护个人数据。</>,
  <>
    如对本政策有任何疑问，请通过{" "}
    <a href="mailto:compliance@remitech.ai" className={ext}>
      compliance@remitech.ai
    </a>{" "}
    与我们联系。
  </>,
];

export const cookieSectionsZh: PolicySection[] = [
  {
    heading: "1. 什么是 Cookie 与类似技术",
    blocks: [
      {
        type: "p",
        node: (
          <>
            Cookie 是您访问网站时放置在浏览器或设备上的小型文本文件。它们有时被视为您对网站及相关服务使用&ldquo;记忆&rdquo;的一部分，因为它们使服务提供者能够记住您并作出适当响应。类似技术包括本地存储、会话存储、像素、标签、Service
            Worker 存储及其他基于浏览器的工具。
          </>
        ),
      },
      {
        type: "p",
        node: (
          <>
            这些技术可帮助网站安全运行、记住用户选择、支持登录会话、衡量网站使用情况并改善用户整体体验。本网站可能使用这些技术收集有关您的设备、浏览行为和使用模式的信息。我们通过
            Cookie 收集的信息帮助我们：(1) 记住您的信息，避免您重复输入相同信息；(2)
            了解您如何使用本网站并与之互动；(3) 衡量网站的可用性及我们沟通的有效性；(4)
            以其他方式管理和改进本网站，并确保其正常运行。
          </>
        ),
      },
    ],
  },
  {
    heading: "2. 我们使用的 Cookie 类别",
    blocks: [
      {
        type: "p",
        node: <>如果您在我们展示弹出式 Cookie 通知横幅后继续使用本网站，即视为您同意我们使用 Cookie。</>,
      },
      {
        type: "p",
        node: (
          <>
            本网站使用不同类型的 Cookie 用于不同目的，包括严格必要 Cookie、功能性 Cookie 和分析类
            Cookie。如下文所述，部分 Cookie 可能由外部第三方提供，以向本网站提供附加功能。
          </>
        ),
      },
      { type: "h3", text: "严格必要 Cookie" },
      {
        type: "ul",
        items: [
          <>网站正常运行、防范滥用、记住您的 Cookie 偏好、支持账户登录及维护安全会话所必需。</>,
          <>始终处于启用状态，无需您的额外同意。</>,
          <>示例可能包括同意偏好记录、已登录用户的身份验证令牌、安全相关的会话数据及 Service Worker 功能。</>,
        ],
      },
      { type: "h3", text: "功能性 Cookie" },
      {
        type: "ul",
        items: [
          <>帮助记住非必要偏好设置、支持并改善媒体播放、使网站功能更便捷的可选 Cookie。</>,
          <>如被禁用，网站仍可运行，但您的部分偏好设置可能无法被记住。</>,
          <>示例可能包括公告状态与显示设置、视频播放器设置与偏好及类似的浏览器存储。</>,
        ],
      },
      { type: "h3", text: "分析类 Cookie" },
      {
        type: "ul",
        items: [
          <>帮助我们衡量用户访问情况、了解哪些页面和资源对不同类别的访客有用，并改进网站性能与功能的可选 Cookie。</>,
          <>目前我们仅在您同意的情况下使用 Google Analytics。</>,
          <>示例可能包括 Google Analytics Cookie（如 _ga 及相关衡量 Cookie），具体以 Google 的 Cookie 与数据保留设置为准。</>,
        ],
      },
    ],
  },
  {
    heading: "3. 如何管理 Cookie",
    blocks: [
      {
        type: "p",
        node: <>根据您所在的司法辖区，当您访问本网站时，您可以接受全部 Cookie 或拒绝非必要 Cookie。</>,
      },
      {
        type: "p",
        node: <>您可以通过浏览器设置管理 Cookie。请注意，屏蔽某些技术可能影响某些网站功能的可用性或性能。</>,
      },
      {
        type: "p",
        node: (
          <>
            在任何情况下，严格必要 Cookie 均保持完全启用以支持网站功能，且您仅通过使用本网站即视为给予相应同意。在法律要求的情况下，如果您的浏览器或设备发送了可识别的退出偏好信号，我们将自动应用您的选择。
          </>
        ),
      },
    ],
  },
  {
    heading: "4. 第三方 Cookie",
    blocks: [
      {
        type: "p",
        node: <>本网站上的部分 Cookie 或类似技术可能由支持我们网站运营、安全、分析或通讯的第三方服务提供商提供。</>,
      },
      {
        type: "p",
        node: <>在我们使用 Google Analytics 的情况下，Google 可能依据其自身的条款与隐私声明处理有关您网站使用情况的信息。</>,
      },
      {
        type: "p",
        node: <>本网站还可能包含指向第三方平台或渠道的链接。该等第三方网站独立于 Remi 运营，并对其自身的 Cookie 与隐私实践负责。</>,
      },
    ],
  },
  {
    heading: "5. 本政策的变更",
    blocks: [
      {
        type: "p",
        node: (
          <>
            我们可能不时更新本政策。任何更新版本将发布于本网站，并附新的&ldquo;最后更新&rdquo;日期。对本政策的变更自发布时生效。我们建议您在每次访问本网站时查阅本
            Cookie 政策，以了解最新变更。
          </>
        ),
      },
      {
        type: "p",
        node: <>如果我们引入新类别的可选 Cookie，或实质性改变当前 Cookie 的使用方式，我们将在适用法律要求时再次征求您的同意。</>,
      },
    ],
  },
  {
    heading: "6. 联系我们",
    blocks: [
      {
        type: "p",
        node: (
          <>
            如您对本政策有任何疑问，或对我们使用 Cookie 有任何意见，请通过电子邮件联系我们：
            <a href="mailto:compliance@remitech.ai" className={ext}>
              compliance@remitech.ai
            </a>
            。
          </>
        ),
      },
    ],
  },
];
