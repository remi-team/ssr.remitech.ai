import * as React from "react";
import { Link } from "@/i18n/navigation";

import type { PolicySection } from "../../_components/policy-page-layout";

/** English Privacy Policy content — verbatim from the legacy production site. */

const ext = "text-[#C87533] hover:underline";

export const privacyIntroEn: React.ReactNode[] = [
  <>
    This Privacy Policy (this &quot;Policy&quot;) explains how Remi Technology Pte. Ltd. and its
    affiliated entities (collectively, &quot;Remi&quot;, &quot;we&quot;, &quot;us&quot; or
    &quot;our&quot;) operating{" "}
    <a href="https://www.remitech.ai" className={ext}>
      www.remitech.ai
    </a>{" "}
    (this &quot;website&quot;) collect, use, disclose and protect personal data when you visit this
    website, contact us, register for website or member access, request information, download or
    view resources, or otherwise interact with us through this website.
  </>,
  <>
    This website is primarily intended for institutional and professional audiences, including
    banks, regulated financial institutions, fintech companies, payment companies, licensed
    digital-asset institutions, regulators, media representatives and business partners. It is not
    intended for children or for individual financial services.
  </>,
];

const L = ({ children }: { children: React.ReactNode }) => (
  <strong className="text-[#2c2520]">{children}</strong>
);

export const privacySectionsEn: PolicySection[] = [
  {
    heading: "1. Personal Data We Collect",
    blocks: [
      {
        type: "p",
        node: (
          <>
            Personal data, or personal information, means any information about an individual from
            which that person can be identified. It does not include data where the identity has
            been removed (anonymous data). We may collect personal data or information that you
            voluntarily provide to us and derived through consented channels or automated tracking
            mechanisms when you interact with our website, which may include without limitation the
            following:
          </>
        ),
      },
      {
        type: "ul",
        items: [
          <>
            <L>Identity Data</L> includes first name, middle name, maiden name, last name, title,
            tax ID, marital status, date of birth, gender, identity document number, nationality
            and any other information contained in any identification documents you provide to us
            (e.g. your passport or driver&apos;s license).
          </>,
          <>
            <L>Contact Data</L> includes billing address, residential address, email address,
            telephone numbers and correspondence records.
          </>,
          <>
            <L>Transaction Data</L> includes details of your activity in the website such as the
            amount, date, time, recipient for each transaction.
          </>,
          <>
            <L>Technical Data</L> includes your internet protocol (IP) address, login data, browser
            type and version, time zone setting and location, browser plug-in types and versions,
            operating system and platform and other technology on the devices you use to access the
            website.
          </>,
          <>
            <L>Profile Data</L> includes your username or similar identifier, password, your
            preferences, feedback and any survey responses.
          </>,
          <>
            <L>Usage Data</L> includes information about how you use the website.
          </>,
          <>
            <L>Communications Data</L> includes your preferences in using our website and your
            communication preferences.
          </>,
          <>
            <L>Survey and Customer Feedback Data</L> includes information you provide in any survey
            or feedback forms on the website.
          </>,
        ],
      },
      {
        type: "p",
        node: (
          <>
            We also collect, use and share aggregated data such as statistical or demographic data
            for any purpose. Aggregated data may be derived from your personal data but is not
            considered personal data in law as this data does not directly or indirectly reveal
            your identity. However, if we combine or connect aggregated data with your personal
            data so that it can directly or indirectly identify you, we treat the combined data as
            personal data which will be used in accordance with this Policy.
          </>
        ),
      },
      {
        type: "p",
        node: (
          <>
            Where you consent, we use Google Analytics to understand website traffic, page usage
            and content performance.
          </>
        ),
      },
      {
        type: "p",
        node: (
          <>
            We do not intentionally collect special or sensitive categories of personal data
            through the public website. Please do not submit sensitive personal data in free-text
            message fields unless we specifically request it.
          </>
        ),
      },
    ],
  },
  {
    heading: "2. How We Use Personal Data",
    blocks: [
      {
        type: "p",
        node: (
          <>
            To the extent as permitted by applicable laws governing your use of our website, we
            use personal data for the following purposes:
          </>
        ),
      },
      {
        type: "ul",
        items: [
          <>
            To verify your identity when you access and use our website to ensure the security of
            your personal information.
          </>,
          <>
            To retain and use details of the services that you have previously used or inquired
            about to make suggestions to you for other services or content which we think you may
            also be interested in, provide you with more tailored offers and personalise your
            experience on the website.
          </>,
          <>To operate, secure and improve the website.</>,
          <>To respond to inquiries and provide requested information.</>,
          <>
            To assess institutional eligibility, membership inquiries and potential business
            relationships.
          </>,
          <>To create, maintain and secure website or member accounts.</>,
          <>
            To provide access to resources, product information, technical documentation and
            demonstrations.
          </>,
          <>To conduct business development, partnership and onboarding discussions.</>,
          <>
            To comply with legal, regulatory, sanctions, AML / CFT, audit, tax, accounting and
            governance obligations where applicable.
          </>,
          <>
            To protect Remi, our website, our network, our users and our partners from fraud,
            misuse, cyber threats and unauthorised access.
          </>,
          <>
            To measure and improve website performance and content, where you have consented to
            analytics cookies.
          </>,
          <>To send business communications where permitted by law or where you have opted in.</>,
          <>For other necessary purposes to improve your use of our website.</>,
        ],
      },
    ],
  },
  {
    heading: "3. Legal Bases for Processing",
    blocks: [
      {
        type: "p",
        node: (
          <>
            We only process personal data where we have an appropriate legal basis to do so and
            within the applicable legal framework of the jurisdiction governing your use of our
            website. Depending on the circumstances, such legal bases generally include:
          </>
        ),
      },
      {
        type: "ul",
        items: [
          <>
            <L>Consent</L> — for optional analytics cookies and similar technologies, and for
            certain optional communications where required.
          </>,
          <>
            <L>Contract or pre-contractual steps</L> — to respond to your requests, evaluate a
            potential business relationship, support registration, onboarding or membership
            discussions, and provide requested services.
          </>,
          <>
            <L>Legitimate interests</L> — to operate a B2B website, respond to institutional
            inquiries, maintain business relationships, secure our systems, improve our services
            and prevent misuse, provided those interests are not overridden by your rights and
            interests.
          </>,
          <>
            <L>Legal obligation</L> — to comply with applicable legal, regulatory, audit, tax, AML
            / CFT, sanctions, recordkeeping or supervisory obligations.
          </>,
        ],
      },
      {
        type: "p",
        node: (
          <>
            You may withdraw your consent at any time where our processing is based on consent.
            Withdrawal does not affect the lawfulness of processing carried out before withdrawal.
          </>
        ),
      },
    ],
  },
  {
    heading: "4. Cookies and Similar Technologies",
    blocks: [
      {
        type: "p",
        node: (
          <>
            We use cookies, local storage, session storage, service-worker technologies and similar
            tools.
          </>
        ),
      },
      {
        type: "p",
        node: (
          <>
            Strictly necessary technologies are used for website security, consent management,
            account login, authentication, session management and requested functionality. They are
            active by default.
          </>
        ),
      },
      {
        type: "p",
        node: (
          <>
            Optional functional technologies may remember non-essential preferences or improve
            media playback and user experience.
          </>
        ),
      },
      {
        type: "p",
        node: (
          <>
            Optional analytics technologies help us understand website usage. We currently use
            Google Analytics only where you have given your consent under our cookies policy.
          </>
        ),
      },
      {
        type: "p",
        node: (
          <>
            You may accept or reject non-essential cookies through our cookie banner. Please refer
            to our{" "}
            <Link href="/cookie-policy" className={ext}>
              Cookie Policy
            </Link>{" "}
            for more details.
          </>
        ),
      },
    ],
  },
  {
    heading: "5. How We Share Personal Data",
    blocks: [
      {
        type: "p",
        node: (
          <>
            To the extent as permitted by applicable laws governing your use of our website, we may
            share your personal data with:
          </>
        ),
      },
      {
        type: "ul",
        items: [
          <>
            Remi group entities and affiliates, where necessary for website operation, business
            development, compliance, onboarding or network-related services.
          </>,
          <>
            Service providers that support hosting, security, cloud infrastructure, email, customer
            relationship management, analytics, document management, communications and website
            operations.
          </>,
          <>Google Analytics, only if you consent to analytics cookies.</>,
          <>Professional advisers, auditors, insurers, banks and legal counsel.</>,
          <>
            Regulators, supervisory authorities, law enforcement agencies, courts or other public
            authorities, where required or permitted by law.
          </>,
          <>
            Counterparties or partners in a proposed business transaction, merger, restructuring,
            financing or transfer of business, subject to appropriate confidentiality safeguards.
          </>,
        ],
      },
      { type: "p", node: <>We do not sell personal data.</> },
    ],
  },
  {
    heading: "6. International Transfers",
    blocks: [
      {
        type: "p",
        node: (
          <>
            Remi operates internationally and may process personal data in Singapore, the United
            States, European Economic Area, the United Kingdom and other jurisdictions where Remi,
            its affiliates, service providers or partners operate.
          </>
        ),
      },
      {
        type: "p",
        node: (
          <>
            Where personal data is transferred across borders, we use appropriate safeguards, such
            as contractual protections, transfer risk assessments and technical and organisational
            measures, to help ensure that personal data continues to receive an appropriate level
            of protection as required by applicable laws.
          </>
        ),
      },
    ],
  },
  {
    heading: "7. Retention",
    blocks: [
      {
        type: "p",
        node: (
          <>
            We keep personal data only for as long as reasonably necessary for the purposes
            described in this Policy, unless a longer retention period is required or permitted by
            applicable law. The criteria used to determine the appropriate retention period
            includes:
          </>
        ),
      },
      {
        type: "ul",
        items: [
          <>Regulatory requirements we are subject to;</>,
          <>Necessity of information to provide our services;</>,
          <>The types of personal information being processed;</>,
          <>The legal basis for processing your information — e.g. consent.</>,
        ],
      },
      {
        type: "p",
        node: (
          <>
            Subject to any specific applicable laws requiring longer period, typical retention
            periods include:
          </>
        ),
      },
      {
        type: "ul",
        items: [
          <>
            Cookie consent records: for the life of the consent record and a reasonable period
            thereafter for audit purposes.
          </>,
          <>
            Website security logs: generally up to 12 months unless needed for investigation or
            security purposes.
          </>,
          <>
            Contact inquiries: generally up to 3 years after the last meaningful interaction,
            unless the inquiry becomes part of an ongoing business relationship.
          </>,
          <>
            Account and registration records: for the duration of the account or relationship and a
            reasonable period thereafter.
          </>,
          <>
            Membership, onboarding, compliance and due diligence records: as required for legal,
            regulatory, audit, AML / CFT, sanctions, tax, accounting or contractual purposes, which
            may be longer.
          </>,
          <>
            Analytics data: determined according to our Google Analytics settings and applicable
            retention controls. We may retain anonymised or aggregated information that no longer
            identifies an individual.
          </>,
        ],
      },
    ],
  },
  {
    heading: "8. Security",
    blocks: [
      {
        type: "p",
        node: (
          <>
            We use technical and organisational measures designed to protect personal data against
            unauthorised access, loss, misuse, alteration or disclosure. These measures may include
            access controls, encryption, secure authentication, logging, monitoring, vulnerability
            management and internal policies.
          </>
        ),
      },
      {
        type: "p",
        node: (
          <>
            No website or transmission method is completely secure and Remi should not be held
            responsible for unauthorized or accidental access beyond our control. If you believe
            your interaction with Remi is no longer secure, please contact us immediately.
          </>
        ),
      },
    ],
  },
  {
    heading: "9. Your Rights",
    blocks: [
      {
        type: "p",
        node: (
          <>
            Depending on where you are located and which laws apply to you, you may have rights to:
          </>
        ),
      },
      {
        type: "ul",
        items: [
          <>Access your personal data;</>,
          <>Correct inaccurate or incomplete personal data;</>,
          <>Request deletion of your personal data;</>,
          <>Restrict or object to certain processing;</>,
          <>Receive a portable copy of certain personal data;</>,
          <>Withdraw consent where processing is based on consent;</>,
          <>Object to direct marketing;</>,
          <>Lodge a complaint with a data protection authority.</>,
        ],
      },
      {
        type: "p",
        node: (
          <>
            To exercise your rights, please contact us by emailing{" "}
            <a href="mailto:compliance@remitech.ai" className={ext}>
              compliance@remitech.ai
            </a>
            . We may need to verify your identity and authority before responding to your request.
          </>
        ),
      },
    ],
  },
  {
    heading: "10. Third-Party Websites",
    blocks: [
      {
        type: "p",
        node: (
          <>
            Our website may contain links to third-party websites and platforms. Those third
            parties operate independently of Remi and are responsible for their own privacy
            practices. We encourage you to read review their privacy policies before providing
            personal data to them.
          </>
        ),
      },
    ],
  },
  {
    heading: "11. Children's Privacy",
    blocks: [
      {
        type: "p",
        node: (
          <>
            This website is intended for institutional and professional users. We do not knowingly
            collect personal data from children. If you believe we have received personal data from
            children under the age of 18, please email us at{" "}
            <a href="mailto:compliance@remitech.ai" className={ext}>
              compliance@remitech.ai
            </a>
            . If you are under the age of 18 but you want to use our website, your parent or
            guardian must review and agree to be bound by this policy on your behalf.
          </>
        ),
      },
    ],
  },
  {
    heading: "12. Changes to This Policy",
    blocks: [
      {
        type: "p",
        node: (
          <>
            We may update this Privacy Policy from time to time. Any updated version will be posted
            on this website with a new &quot;Last updated&quot; date. If we make material changes,
            we will provide additional notice where required by law.
          </>
        ),
      },
    ],
  },
  {
    heading: "13. Contact Us",
    blocks: [
      {
        type: "p",
        node: (
          <>
            For privacy-related questions, requests or complaints, please contact us by emailing:{" "}
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
