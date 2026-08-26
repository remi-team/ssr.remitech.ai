import * as React from "react";

import type { PolicySection } from "../../_components/policy-page-layout";

/** English Cookie Policy content — verbatim from the legacy production site. */

const ext = "text-[#C87533] hover:underline";

export const cookieIntroEn: React.ReactNode[] = [
  <>
    This Cookie Policy (this &quot;Policy&quot;) explains how Remi Technology Pte. Ltd. and its
    affiliated entities (collectively, &quot;Remi&quot;, &quot;we&quot;, &quot;us&quot; or
    &quot;our&quot;) operating{" "}
    <a href="https://www.remitech.ai" className={ext}>
      www.remitech.ai
    </a>{" "}
    (this &quot;website&quot;) use cookies and similar technologies on this website.
  </>,
  <>
    This Policy should be read together with the Remi Privacy Notice, which explains how we
    collect, use, disclose and protect personal data more generally.
  </>,
  <>
    For questions about this policy, please contact us at{" "}
    <a href="mailto:compliance@remitech.ai" className={ext}>
      compliance@remitech.ai
    </a>
    .
  </>,
];

export const cookieSectionsEn: PolicySection[] = [
  {
    heading: "1. What Cookies and Similar Technologies Are",
    blocks: [
      {
        type: "p",
        node: (
          <>
            Cookies are small text files placed on your browser or device when you visit a website.
            They are sometimes considered as forming part of the &quot;memory&quot; of your use of
            websites and related services as they allow service providers to remember you and
            respond appropriately. Similar technologies include local storage, session storage,
            pixels, tags, service-worker storage and other browser-based tools.
          </>
        ),
      },
      {
        type: "p",
        node: (
          <>
            These technologies may help a website operate securely, remember users&apos;
            choices, support login sessions, measure website usage and improve users&apos; overall
            experience. Our website may use these technologies to collect information about your
            equipment, browsing actions, and usage patterns. The information we collect through our
            cookies helps us (1) remember your information to avoid re-entering of the same
            information by you; (2) understand how you use and interact with our website; (3)
            measure the usability of our websites and the effectiveness of our communications; and
            (4) otherwise manage and enhance our website, and ensure our website is working
            properly.
          </>
        ),
      },
    ],
  },
  {
    heading: "2. Categories of Cookies We Use",
    blocks: [
      {
        type: "p",
        node: (
          <>
            If you continue to use this website after displaying our pop-up cookie notification
            banner, you thereby grant your consent to our use of cookies.
          </>
        ),
      },
      {
        type: "p",
        node: (
          <>
            On our website, different types of cookies are used for different purposes, including
            Strictly Necessary Cookies, Functional Cookies and Analytics Cookies. Some cookies may
            be served by external third parties to provide additional functionality to our website,
            as described below.
          </>
        ),
      },
      { type: "h3", text: "Strictly Necessary Cookies" },
      {
        type: "ul",
        items: [
          <>
            Required for the website to function properly, protect it from misuse, remember your
            cookie preferences, support account login and maintain secure sessions.
          </>,
          <>Always active and do not require your additional consent.</>,
          <>
            Examples may include consent preference records, authentication tokens for logged-in
            users, security-related session data and service-worker functionality.
          </>,
        ],
      },
      { type: "h3", text: "Functional Cookies" },
      {
        type: "ul",
        items: [
          <>
            Optional cookies that help remember non-essential preferences, support and improve
            media playback and make website features more convenient.
          </>,
          <>
            If disabled, the website will remain in function, but some of your preferences may not
            be remembered.
          </>,
          <>
            Examples may include announcement state and display settings, video-player settings and
            preferences and similar browser storage.
          </>,
        ],
      },
      { type: "h3", text: "Analytics Cookies" },
      {
        type: "ul",
        items: [
          <>
            Optional cookies that help us measure users&apos; visits, understand which pages and
            resources are useful to different categories of visitors, and improve the performance
            and functionality of our website.
          </>,
          <>We currently use Google Analytics only if you consent.</>,
          <>
            Examples may include Google Analytics cookies such as _ga and related measurement
            cookies, subject to Google&apos;s cookie and data retention settings.
          </>,
        ],
      },
    ],
  },
  {
    heading: "3. How You Can Manage Cookies",
    blocks: [
      {
        type: "p",
        node: (
          <>
            Depending on your jurisdiction, when you visit our website, you may accept all cookies
            or reject non-essential cookies.
          </>
        ),
      },
      {
        type: "p",
        node: (
          <>
            You can manage cookies through your browser settings. Please note that blocking certain
            technologies may affect the availability or performance of certain website features.
          </>
        ),
      },
      {
        type: "p",
        node: (
          <>
            In all cases, Strictly Necessary Cookies remain fully enabled for the functions of the
            website and your consent is duly granted solely by your use of our website. Where
            required by law, we automatically apply your choices in the event that your browser or
            device sends a recognized opt-out preference signal.
          </>
        ),
      },
    ],
  },
  {
    heading: "4. Third-Party Cookies",
    blocks: [
      {
        type: "p",
        node: (
          <>
            Some cookies or similar technologies on our website may be provided by third-party
            service providers that support our website operations, security, analytics or
            communications.
          </>
        ),
      },
      {
        type: "p",
        node: (
          <>
            Where we use Google Analytics, Google may process information about your website usage
            in accordance with Google&apos;s own terms and privacy notices.
          </>
        ),
      },
      {
        type: "p",
        node: (
          <>
            Our website may also contain links to third-party platforms or channels. Those
            third-party websites operate independently from Remi and shall be responsible for their
            own cookies and privacy practices.
          </>
        ),
      },
    ],
  },
  {
    heading: "5. Changes to This Policy",
    blocks: [
      {
        type: "p",
        node: (
          <>
            We may update this Policy from time to time. Any updated version will be posted on this
            website with a new &quot;Last updated&quot; date. Changes to this Policy are effective
            when they are posted. We encourage you to review the Cookie Policy whenever you visit
            our Websites to keep yourself informed of the latest changes.
          </>
        ),
      },
      {
        type: "p",
        node: (
          <>
            If we introduce new categories of optional cookies, or materially change how we use our
            current cookies, we will seek your consent again where required by applicable laws.
          </>
        ),
      },
    ],
  },
  {
    heading: "6. Contact Us",
    blocks: [
      {
        type: "p",
        node: (
          <>
            If you have any questions about this Policy or comments about our use of cookies,
            please contact us by Emailing:{" "}
            <a href="mailto:compliance@remitech.ai" className={ext}>
              compliance@remitech.ai
            </a>
            .
          </>
        ),
      },
    ],
  },
];
