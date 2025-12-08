import type { FormPage } from "@/types/formBuilder";

// CPS Template - Pre-defined 16-page Client Profiling Sheet structure
export const CPS_TEMPLATE_PAGES: Omit<FormPage, 'id'>[] = [
  // Page 1: Contact Matrix
  {
    name: "Contact Matrix",
    description: "Key contact information for all stakeholders",
    order: 0,
    fields: [
      {
        id: `field-${Date.now()}-1`,
        type: "short-text",
        label: "Contact Name",
        placeholder: "Full name",
        order: 0,
        validation: { required: true }
      },
      {
        id: `field-${Date.now()}-2`,
        type: "email",
        label: "Email Address",
        placeholder: "contact@example.com",
        order: 1,
        validation: { required: true }
      },
      {
        id: `field-${Date.now()}-3`,
        type: "phone",
        label: "Mobile Number",
        placeholder: "+1 (555) 000-0000",
        order: 2,
        validation: { required: true }
      },
      {
        id: `field-${Date.now()}-4`,
        type: "short-text",
        label: "Designation",
        placeholder: "Job title/role",
        order: 3
      },
      {
        id: `field-${Date.now()}-5`,
        type: "short-text",
        label: "Department",
        placeholder: "Marketing, Sales, etc.",
        order: 4
      },
      {
        id: `field-${Date.now()}-6`,
        type: "multiple-choice",
        label: "Primary Contact",
        description: "Is this the primary point of contact?",
        order: 5,
        options: [
          { id: "yes", label: "Yes", value: "yes" },
          { id: "no", label: "No", value: "no" }
        ]
      },
      {
        id: `field-${Date.now()}-7`,
        type: "long-text",
        label: "Additional Notes",
        placeholder: "Any specific notes about this contact",
        order: 6
      }
    ]
  },

  // Page 2: Business Objectives
  {
    name: "Business Objectives",
    description: "Define primary business goals and KPIs",
    order: 1,
    fields: [
      {
        id: `field-${Date.now()}-8`,
        type: "checkboxes",
        label: "Marketing Services Required",
        description: "Select all that apply",
        order: 0,
        options: [
          { id: "smm", label: "Social Media Marketing", value: "social-media" },
          { id: "seo", label: "SEO", value: "seo" },
          { id: "website", label: "Website Development", value: "website" },
          { id: "ppc", label: "PPC", value: "ppc" },
          { id: "orm", label: "ORM", value: "orm" },
          { id: "revenue", label: "Revenue/Leads", value: "revenue-leads" }
        ]
      },
      {
        id: `field-${Date.now()}-9`,
        type: "long-text",
        label: "Social Media Marketing Goals",
        description: "Awareness, engagement, leads",
        placeholder: "Describe your social media objectives",
        order: 1
      },
      {
        id: `field-${Date.now()}-10`,
        type: "long-text",
        label: "SEO Goals",
        description: "% growth, conversion rate",
        placeholder: "Increase leads/traffic targets",
        order: 2
      },
      {
        id: `field-${Date.now()}-11`,
        type: "long-text",
        label: "Website Development Goals",
        description: "New site/revamp, UI/UX, security",
        placeholder: "Launch date, load time, audits",
        order: 3
      },
      {
        id: `field-${Date.now()}-12`,
        type: "long-text",
        label: "PPC Goals",
        description: "ROI & conversions",
        placeholder: "Target CPA/CTR",
        order: 4
      },
      {
        id: `field-${Date.now()}-13`,
        type: "long-text",
        label: "ORM Goals",
        description: "Ratings & reviews improvement",
        placeholder: "% positive reviews target",
        order: 5
      },
      {
        id: `field-${Date.now()}-14`,
        type: "long-text",
        label: "Revenue/Leads Goals",
        description: "Sales/conversion improvement",
        placeholder: "Conversion % or numbers",
        order: 6
      },
      {
        id: `field-${Date.now()}-15`,
        type: "dropdown",
        label: "Reporting Frequency",
        order: 7,
        options: [
          { id: "monthly", label: "Monthly", value: "monthly" },
          { id: "quarterly", label: "Quarterly", value: "quarterly" },
          { id: "biweekly", label: "Bi-weekly", value: "biweekly" }
        ]
      }
    ]
  },

  // Page 3: Audience & Market
  {
    name: "Audience & Market",
    description: "Target audience and market analysis",
    order: 2,
    fields: [
      {
        id: `field-${Date.now()}-16`,
        type: "long-text",
        label: "Top Domestic Markets",
        placeholder: "List primary domestic markets",
        order: 0,
        validation: { required: true }
      },
      {
        id: `field-${Date.now()}-17`,
        type: "long-text",
        label: "Top International Markets",
        placeholder: "List key international markets",
        order: 1
      },
      {
        id: `field-${Date.now()}-18`,
        type: "long-text",
        label: "Peak Demand Seasons",
        placeholder: "When is demand highest?",
        order: 2
      },
      {
        id: `field-${Date.now()}-19`,
        type: "long-text",
        label: "Purchase/Engagement Window",
        placeholder: "Typical booking or purchase timeline",
        order: 3
      },
      {
        id: `field-${Date.now()}-20`,
        type: "long-text",
        label: "Typical Engagement Cycle",
        placeholder: "Customer journey timeline",
        order: 4
      },
      {
        id: `field-${Date.now()}-21`,
        type: "long-text",
        label: "Price Range / Offers",
        placeholder: "Pricing strategy and promotional offers",
        order: 5
      },
      {
        id: `field-${Date.now()}-22`,
        type: "long-text",
        label: "Target Audience Demographics",
        description: "Age, income, interests, etc.",
        placeholder: "Describe your ideal customer",
        order: 6
      }
    ]
  },

  // Page 4: Social Media
  {
    name: "Social Media",
    description: "Social media presence and strategy",
    order: 3,
    fields: [
      {
        id: `field-${Date.now()}-23`,
        type: "short-text",
        label: "Facebook Page URL",
        placeholder: "https://facebook.com/...",
        order: 0
      },
      {
        id: `field-${Date.now()}-24`,
        type: "short-text",
        label: "Instagram Handle",
        placeholder: "@username",
        order: 1
      },
      {
        id: `field-${Date.now()}-25`,
        type: "short-text",
        label: "LinkedIn Page URL",
        placeholder: "https://linkedin.com/company/...",
        order: 2
      },
      {
        id: `field-${Date.now()}-26`,
        type: "short-text",
        label: "Twitter/X Handle",
        placeholder: "@username",
        order: 3
      },
      {
        id: `field-${Date.now()}-27`,
        type: "short-text",
        label: "YouTube Channel URL",
        placeholder: "https://youtube.com/@...",
        order: 4
      },
      {
        id: `field-${Date.now()}-28`,
        type: "number",
        label: "Current Facebook Followers",
        placeholder: "0",
        order: 5
      },
      {
        id: `field-${Date.now()}-29`,
        type: "number",
        label: "Current Instagram Followers",
        placeholder: "0",
        order: 6
      },
      {
        id: `field-${Date.now()}-30`,
        type: "long-text",
        label: "Content Strategy",
        description: "What type of content performs best?",
        placeholder: "Videos, images, stories, etc.",
        order: 7
      },
      {
        id: `field-${Date.now()}-31`,
        type: "number",
        label: "Posting Frequency (per week)",
        placeholder: "7",
        order: 8
      },
      {
        id: `field-${Date.now()}-32`,
        type: "multiple-choice",
        label: "Have Access to Business Manager?",
        order: 9,
        options: [
          { id: "yes", label: "Yes", value: "yes" },
          { id: "no", label: "No", value: "no" },
          { id: "need-setup", label: "Need Setup", value: "need-setup" }
        ]
      }
    ]
  },

  // Page 5: Website Dev
  {
    name: "Website Dev",
    description: "Website development requirements",
    order: 4,
    fields: [
      {
        id: `field-${Date.now()}-33`,
        type: "short-text",
        label: "Current Website URL",
        placeholder: "https://...",
        order: 0,
        validation: { required: true }
      },
      {
        id: `field-${Date.now()}-34`,
        type: "dropdown",
        label: "Website Purpose",
        order: 1,
        options: [
          { id: "ecommerce", label: "E-commerce", value: "ecommerce" },
          { id: "portfolio", label: "Portfolio", value: "portfolio" },
          { id: "booking", label: "Booking Engine", value: "booking" },
          { id: "corporate", label: "Corporate Website", value: "corporate" },
          { id: "blog", label: "Blog/Content", value: "blog" }
        ]
      },
      {
        id: `field-${Date.now()}-35`,
        type: "short-text",
        label: "Platform/CMS",
        placeholder: "WordPress, Shopify, Custom, etc.",
        order: 2
      },
      {
        id: `field-${Date.now()}-36`,
        type: "checkboxes",
        label: "Desired Features",
        order: 3,
        options: [
          { id: "booking", label: "Online Booking", value: "booking" },
          { id: "payment", label: "Payment Gateway", value: "payment" },
          { id: "chat", label: "Live Chat", value: "chat" },
          { id: "multilingual", label: "Multi-language", value: "multilingual" },
          { id: "blog", label: "Blog Section", value: "blog" }
        ]
      },
      {
        id: `field-${Date.now()}-37`,
        type: "multiple-choice",
        label: "Mobile Responsive",
        order: 4,
        options: [
          { id: "yes", label: "Yes", value: "yes" },
          { id: "no", label: "No", value: "no" }
        ],
        validation: { required: true }
      },
      {
        id: `field-${Date.now()}-38`,
        type: "short-text",
        label: "Accessibility Requirements",
        placeholder: "WCAG, ADA compliance, etc.",
        order: 5
      },
      {
        id: `field-${Date.now()}-39`,
        type: "short-text",
        label: "SEO Integration Needs",
        placeholder: "Schema markup, meta tags, etc.",
        order: 6
      },
      {
        id: `field-${Date.now()}-40`,
        type: "short-text",
        label: "Security Measures",
        placeholder: "SSL, firewall, security plugins",
        order: 7
      },
      {
        id: `field-${Date.now()}-41`,
        type: "long-text",
        label: "Performance Goals",
        placeholder: "Page load time targets, Core Web Vitals",
        order: 8
      },
      {
        id: `field-${Date.now()}-42`,
        type: "short-text",
        label: "Analytics Setup",
        placeholder: "GA4, GTM, heatmaps, etc.",
        order: 9
      },
      {
        id: `field-${Date.now()}-43`,
        type: "long-text",
        label: "Maintenance Plan",
        placeholder: "Update frequency, backup schedule",
        order: 10
      }
    ]
  },

  // Page 6: ORM Guidelines
  {
    name: "ORM Guidelines",
    description: "Online Reputation Management strategy",
    order: 5,
    fields: [
      {
        id: `field-${Date.now()}-44`,
        type: "checkboxes",
        label: "Review Platforms to Monitor",
        order: 0,
        options: [
          { id: "google", label: "Google Reviews", value: "google" },
          { id: "tripadvisor", label: "TripAdvisor", value: "tripadvisor" },
          { id: "yelp", label: "Yelp", value: "yelp" },
          { id: "facebook", label: "Facebook", value: "facebook" },
          { id: "booking", label: "Booking.com", value: "booking" }
        ]
      },
      {
        id: `field-${Date.now()}-45`,
        type: "number",
        label: "Current Google Rating",
        placeholder: "4.5",
        order: 1
      },
      {
        id: `field-${Date.now()}-46`,
        type: "number",
        label: "Target Rating",
        placeholder: "4.8",
        order: 2
      },
      {
        id: `field-${Date.now()}-47`,
        type: "long-text",
        label: "Response Guidelines - Positive Reviews",
        placeholder: "How to respond to positive feedback",
        order: 3
      },
      {
        id: `field-${Date.now()}-48`,
        type: "long-text",
        label: "Response Guidelines - Negative Reviews",
        placeholder: "Escalation process for negative feedback",
        order: 4
      },
      {
        id: `field-${Date.now()}-49`,
        type: "multiple-choice",
        label: "Approval Required for Responses?",
        order: 5,
        options: [
          { id: "yes", label: "Yes", value: "yes" },
          { id: "no", label: "No", value: "no" }
        ]
      }
    ]
  },

  // Page 7: Channel Tracking
  {
    name: "Channel Tracking",
    description: "Marketing channel tracking setup",
    order: 6,
    fields: [
      {
        id: `field-${Date.now()}-50`,
        type: "short-text",
        label: "Google Analytics Property ID",
        placeholder: "G-XXXXXXXXXX",
        order: 0
      },
      {
        id: `field-${Date.now()}-51`,
        type: "short-text",
        label: "Google Tag Manager ID",
        placeholder: "GTM-XXXXXXX",
        order: 1
      },
      {
        id: `field-${Date.now()}-52`,
        type: "short-text",
        label: "Facebook Pixel ID",
        placeholder: "000000000000000",
        order: 2
      },
      {
        id: `field-${Date.now()}-53`,
        type: "checkboxes",
        label: "UTM Parameters in Use",
        order: 3,
        options: [
          { id: "source", label: "utm_source", value: "source" },
          { id: "medium", label: "utm_medium", value: "medium" },
          { id: "campaign", label: "utm_campaign", value: "campaign" },
          { id: "content", label: "utm_content", value: "content" }
        ]
      },
      {
        id: `field-${Date.now()}-54`,
        type: "long-text",
        label: "Conversion Goals",
        placeholder: "List all conversion events to track",
        order: 4
      },
      {
        id: `field-${Date.now()}-55`,
        type: "multiple-choice",
        label: "E-commerce Tracking Enabled?",
        order: 5,
        options: [
          { id: "yes", label: "Yes", value: "yes" },
          { id: "no", label: "No", value: "no" }
        ]
      }
    ]
  },

  // Page 8: SEO Guidelines
  {
    name: "SEO Guidelines",
    description: "SEO strategy and requirements",
    order: 7,
    fields: [
      {
        id: `field-${Date.now()}-56`,
        type: "long-text",
        label: "Primary Keywords",
        placeholder: "List top 5-10 target keywords",
        order: 0,
        validation: { required: true }
      },
      {
        id: `field-${Date.now()}-57`,
        type: "long-text",
        label: "Secondary Keywords",
        placeholder: "Additional keywords to target",
        order: 1
      },
      {
        id: `field-${Date.now()}-58`,
        type: "long-text",
        label: "Competitor Websites",
        placeholder: "List main competitors",
        order: 2
      },
      {
        id: `field-${Date.now()}-59`,
        type: "number",
        label: "Current Organic Traffic (monthly)",
        placeholder: "0",
        order: 3
      },
      {
        id: `field-${Date.now()}-60`,
        type: "number",
        label: "Target Organic Traffic (monthly)",
        placeholder: "0",
        order: 4
      },
      {
        id: `field-${Date.now()}-61`,
        type: "long-text",
        label: "Content Strategy",
        placeholder: "Blog frequency, topic clusters, etc.",
        order: 5
      },
      {
        id: `field-${Date.now()}-62`,
        type: "checkboxes",
        label: "Technical SEO Priorities",
        order: 6,
        options: [
          { id: "speed", label: "Page Speed", value: "speed" },
          { id: "mobile", label: "Mobile Optimization", value: "mobile" },
          { id: "schema", label: "Schema Markup", value: "schema" },
          { id: "sitemap", label: "XML Sitemap", value: "sitemap" },
          { id: "robots", label: "Robots.txt", value: "robots" }
        ]
      },
      {
        id: `field-${Date.now()}-63`,
        type: "multiple-choice",
        label: "Local SEO Required?",
        order: 7,
        options: [
          { id: "yes", label: "Yes", value: "yes" },
          { id: "no", label: "No", value: "no" }
        ]
      }
    ]
  },

  // Page 9: PPC Campaigns
  {
    name: "PPC Campaigns",
    description: "Pay-per-click campaign details",
    order: 8,
    fields: [
      {
        id: `field-${Date.now()}-64`,
        type: "number",
        label: "Monthly PPC Budget",
        placeholder: "0",
        order: 0,
        validation: { required: true }
      },
      {
        id: `field-${Date.now()}-65`,
        type: "checkboxes",
        label: "PPC Platforms",
        order: 1,
        options: [
          { id: "google", label: "Google Ads", value: "google-ads" },
          { id: "facebook", label: "Facebook Ads", value: "facebook-ads" },
          { id: "instagram", label: "Instagram Ads", value: "instagram-ads" },
          { id: "linkedin", label: "LinkedIn Ads", value: "linkedin-ads" }
        ]
      },
      {
        id: `field-${Date.now()}-66`,
        type: "long-text",
        label: "Campaign Objectives",
        placeholder: "Leads, sales, brand awareness, etc.",
        order: 2
      },
      {
        id: `field-${Date.now()}-67`,
        type: "number",
        label: "Target CPA (Cost Per Acquisition)",
        placeholder: "0",
        order: 3
      },
      {
        id: `field-${Date.now()}-68`,
        type: "number",
        label: "Target CTR (%)",
        placeholder: "2.5",
        order: 4
      },
      {
        id: `field-${Date.now()}-69`,
        type: "long-text",
        label: "Target Audience",
        placeholder: "Demographics, interests, behaviors",
        order: 5
      },
      {
        id: `field-${Date.now()}-70`,
        type: "date",
        label: "Campaign Start Date",
        order: 6,
        validation: { required: true }
      }
    ]
  },

  // Page 10: Project Health
  {
    name: "Project Health",
    description: "Project status and health monitoring",
    order: 9,
    fields: [
      {
        id: `field-${Date.now()}-71`,
        type: "dropdown",
        label: "Overall Project Status",
        order: 0,
        options: [
          { id: "on-track", label: "On Track", value: "on-track" },
          { id: "at-risk", label: "At Risk", value: "at-risk" },
          { id: "delayed", label: "Delayed", value: "delayed" },
          { id: "completed", label: "Completed", value: "completed" }
        ],
        validation: { required: true }
      },
      {
        id: `field-${Date.now()}-72`,
        type: "rating",
        label: "Client Satisfaction (1-5 stars)",
        order: 1
      },
      {
        id: `field-${Date.now()}-73`,
        type: "long-text",
        label: "Current Challenges",
        placeholder: "List any blockers or issues",
        order: 2
      },
      {
        id: `field-${Date.now()}-74`,
        type: "long-text",
        label: "Recent Wins",
        placeholder: "Achievements and successes",
        order: 3
      },
      {
        id: `field-${Date.now()}-75`,
        type: "long-text",
        label: "Upcoming Milestones",
        placeholder: "Next deliverables and deadlines",
        order: 4
      },
      {
        id: `field-${Date.now()}-76`,
        type: "multiple-choice",
        label: "Budget Status",
        order: 5,
        options: [
          { id: "under", label: "Under Budget", value: "under" },
          { id: "on", label: "On Budget", value: "on" },
          { id: "over", label: "Over Budget", value: "over" }
        ]
      },
      {
        id: `field-${Date.now()}-77`,
        type: "date",
        label: "Last Review Meeting",
        order: 6
      },
      {
        id: `field-${Date.now()}-78`,
        type: "date",
        label: "Next Review Meeting",
        order: 7
      }
    ]
  },

  // Page 11: Campaign Calendar
  {
    name: "Campaign Calendar",
    description: "Marketing campaign schedule",
    order: 10,
    fields: [
      {
        id: `field-${Date.now()}-79`,
        type: "short-text",
        label: "Campaign Name",
        placeholder: "Q1 Holiday Campaign",
        order: 0,
        validation: { required: true }
      },
      {
        id: `field-${Date.now()}-80`,
        type: "date",
        label: "Campaign Start Date",
        order: 1,
        validation: { required: true }
      },
      {
        id: `field-${Date.now()}-81`,
        type: "date",
        label: "Campaign End Date",
        order: 2
      },
      {
        id: `field-${Date.now()}-82`,
        type: "dropdown",
        label: "Campaign Type",
        order: 3,
        options: [
          { id: "seasonal", label: "Seasonal", value: "seasonal" },
          { id: "product", label: "Product Launch", value: "product" },
          { id: "brand", label: "Brand Awareness", value: "brand" },
          { id: "promo", label: "Promotional", value: "promo" }
        ]
      },
      {
        id: `field-${Date.now()}-83`,
        type: "checkboxes",
        label: "Marketing Channels",
        order: 4,
        options: [
          { id: "social", label: "Social Media", value: "social" },
          { id: "email", label: "Email", value: "email" },
          { id: "ppc", label: "PPC", value: "ppc" },
          { id: "seo", label: "SEO", value: "seo" }
        ]
      },
      {
        id: `field-${Date.now()}-84`,
        type: "long-text",
        label: "Campaign Notes",
        placeholder: "Key messages, creative briefs, etc.",
        order: 5
      }
    ]
  },

  // Page 12: Client Sentiments
  {
    name: "Client Sentiments",
    description: "Track client feedback and sentiment",
    order: 11,
    fields: [
      {
        id: `field-${Date.now()}-85`,
        type: "dropdown",
        label: "Overall Sentiment",
        order: 0,
        options: [
          { id: "positive", label: "Positive", value: "positive" },
          { id: "neutral", label: "Neutral", value: "neutral" },
          { id: "negative", label: "Negative", value: "negative" }
        ],
        validation: { required: true }
      },
      {
        id: `field-${Date.now()}-86`,
        type: "long-text",
        label: "Positive Feedback",
        placeholder: "What's working well?",
        order: 1
      },
      {
        id: `field-${Date.now()}-87`,
        type: "long-text",
        label: "Negative Feedback",
        placeholder: "What needs improvement?",
        order: 2
      },
      {
        id: `field-${Date.now()}-88`,
        type: "long-text",
        label: "Action Items",
        placeholder: "Steps to address concerns",
        order: 3
      },
      {
        id: `field-${Date.now()}-89`,
        type: "date",
        label: "Feedback Date",
        order: 4
      },
      {
        id: `field-${Date.now()}-90`,
        type: "multiple-choice",
        label: "Follow-up Needed?",
        order: 5,
        options: [
          { id: "yes", label: "Yes", value: "yes" },
          { id: "no", label: "No", value: "no" }
        ]
      }
    ]
  },

  // Page 13: Tracking Status
  {
    name: "Tracking Status",
    description: "Monitor tracking implementation status",
    order: 12,
    fields: [
      {
        id: `field-${Date.now()}-91`,
        type: "checkboxes",
        label: "Tracking Tools Implemented",
        order: 0,
        options: [
          { id: "ga4", label: "Google Analytics 4", value: "ga4" },
          { id: "gtm", label: "Google Tag Manager", value: "gtm" },
          { id: "fbpixel", label: "Facebook Pixel", value: "fbpixel" },
          { id: "linkedin", label: "LinkedIn Insight Tag", value: "linkedin" },
          { id: "hotjar", label: "Hotjar", value: "hotjar" }
        ]
      },
      {
        id: `field-${Date.now()}-92`,
        type: "multiple-choice",
        label: "Goals/Conversions Configured?",
        order: 1,
        options: [
          { id: "yes", label: "Yes", value: "yes" },
          { id: "no", label: "No", value: "no" },
          { id: "partial", label: "Partially", value: "partial" }
        ]
      },
      {
        id: `field-${Date.now()}-93`,
        type: "multiple-choice",
        label: "E-commerce Tracking Active?",
        order: 2,
        options: [
          { id: "yes", label: "Yes", value: "yes" },
          { id: "no", label: "No", value: "no" },
          { id: "na", label: "N/A", value: "na" }
        ]
      },
      {
        id: `field-${Date.now()}-94`,
        type: "long-text",
        label: "Custom Events Tracked",
        placeholder: "List all custom events",
        order: 3
      },
      {
        id: `field-${Date.now()}-95`,
        type: "date",
        label: "Last Tracking Audit Date",
        order: 4
      },
      {
        id: `field-${Date.now()}-96`,
        type: "long-text",
        label: "Known Tracking Issues",
        placeholder: "Any gaps or problems?",
        order: 5
      }
    ]
  },

  // Page 14: Partner Details
  {
    name: "Partner Details",
    description: "Third-party partners and vendors",
    order: 13,
    fields: [
      {
        id: `field-${Date.now()}-97`,
        type: "short-text",
        label: "Partner/Vendor Name",
        placeholder: "Company name",
        order: 0,
        validation: { required: true }
      },
      {
        id: `field-${Date.now()}-98`,
        type: "dropdown",
        label: "Partner Type",
        order: 1,
        options: [
          { id: "tech", label: "Technology Provider", value: "tech" },
          { id: "agency", label: "Agency", value: "agency" },
          { id: "consultant", label: "Consultant", value: "consultant" },
          { id: "supplier", label: "Supplier", value: "supplier" }
        ]
      },
      {
        id: `field-${Date.now()}-99`,
        type: "short-text",
        label: "Contact Person",
        placeholder: "Primary contact name",
        order: 2
      },
      {
        id: `field-${Date.now()}-100`,
        type: "email",
        label: "Contact Email",
        placeholder: "partner@example.com",
        order: 3
      },
      {
        id: `field-${Date.now()}-101`,
        type: "phone",
        label: "Contact Phone",
        placeholder: "+1 (555) 000-0000",
        order: 4
      },
      {
        id: `field-${Date.now()}-102`,
        type: "long-text",
        label: "Services Provided",
        placeholder: "What do they handle?",
        order: 5
      },
      {
        id: `field-${Date.now()}-103`,
        type: "date",
        label: "Contract Start Date",
        order: 6
      },
      {
        id: `field-${Date.now()}-104`,
        type: "date",
        label: "Contract End Date",
        order: 7
      }
    ]
  },

  // Page 15: Month-End
  {
    name: "Month-End",
    description: "Month-end reporting checklist",
    order: 14,
    fields: [
      {
        id: `field-${Date.now()}-105`,
        type: "date",
        label: "Reporting Period",
        placeholder: "MM/YYYY",
        order: 0,
        validation: { required: true }
      },
      {
        id: `field-${Date.now()}-106`,
        type: "checkboxes",
        label: "Reports Completed",
        order: 1,
        options: [
          { id: "social", label: "Social Media Report", value: "social" },
          { id: "seo", label: "SEO Report", value: "seo" },
          { id: "ppc", label: "PPC Report", value: "ppc" },
          { id: "website", label: "Website Analytics", value: "website" },
          { id: "orm", label: "ORM Report", value: "orm" }
        ]
      },
      {
        id: `field-${Date.now()}-107`,
        type: "number",
        label: "Total Budget Spent",
        placeholder: "0",
        order: 2
      },
      {
        id: `field-${Date.now()}-108`,
        type: "number",
        label: "Total Leads Generated",
        placeholder: "0",
        order: 3
      },
      {
        id: `field-${Date.now()}-109`,
        type: "number",
        label: "Total Conversions",
        placeholder: "0",
        order: 4
      },
      {
        id: `field-${Date.now()}-110`,
        type: "long-text",
        label: "Key Insights",
        placeholder: "What were the main findings?",
        order: 5
      },
      {
        id: `field-${Date.now()}-111`,
        type: "long-text",
        label: "Next Month's Focus",
        placeholder: "Priorities for upcoming month",
        order: 6
      },
      {
        id: `field-${Date.now()}-112`,
        type: "multiple-choice",
        label: "Client Reviewed Report?",
        order: 7,
        options: [
          { id: "yes", label: "Yes", value: "yes" },
          { id: "no", label: "No", value: "no" },
          { id: "pending", label: "Pending", value: "pending" }
        ]
      }
    ]
  },

  // Page 16: Campaign Results
  {
    name: "Campaign Results",
    description: "Campaign performance metrics",
    order: 15,
    fields: [
      {
        id: `field-${Date.now()}-113`,
        type: "short-text",
        label: "Campaign Name",
        placeholder: "Campaign identifier",
        order: 0,
        validation: { required: true }
      },
      {
        id: `field-${Date.now()}-114`,
        type: "date",
        label: "Campaign Period Start",
        order: 1
      },
      {
        id: `field-${Date.now()}-115`,
        type: "date",
        label: "Campaign Period End",
        order: 2
      },
      {
        id: `field-${Date.now()}-116`,
        type: "number",
        label: "Total Impressions",
        placeholder: "0",
        order: 3
      },
      {
        id: `field-${Date.now()}-117`,
        type: "number",
        label: "Total Clicks",
        placeholder: "0",
        order: 4
      },
      {
        id: `field-${Date.now()}-118`,
        type: "number",
        label: "Total Conversions",
        placeholder: "0",
        order: 5
      },
      {
        id: `field-${Date.now()}-119`,
        type: "number",
        label: "Total Spend",
        placeholder: "0",
        order: 6
      },
      {
        id: `field-${Date.now()}-120`,
        type: "number",
        label: "ROI (%)",
        placeholder: "0",
        order: 7
      },
      {
        id: `field-${Date.now()}-121`,
        type: "long-text",
        label: "Key Learnings",
        placeholder: "What worked? What didn't?",
        order: 8
      },
      {
        id: `field-${Date.now()}-122`,
        type: "long-text",
        label: "Recommendations",
        placeholder: "Future optimizations",
        order: 9
      }
    ]
  }
];

// Helper function to generate CPS template with unique field IDs
export const generateCPSTemplate = (_projectId: string, _projectName?: string): Omit<FormPage, 'id'>[] => {
  return CPS_TEMPLATE_PAGES.map((page, pageIndex) => ({
    ...page,
    fields: page.fields.map((field, fieldIndex) => ({
      ...field,
      id: `cps-field-${Date.now()}-${pageIndex}-${fieldIndex}`
    }))
  }));
};
