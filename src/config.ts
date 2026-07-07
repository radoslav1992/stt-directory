// Self-hosted listmonk instance powering the footer email-subscribe form.
// Set both values and the form appears; leave empty to keep it hidden.
//   LISTMONK_URL       — origin of your instance, no trailing slash,
//                        e.g. 'https://news.speechtotext.dev'
//   LISTMONK_LIST_UUID — the UUID of the public list to subscribe to
//                        (listmonk admin → Lists → copy UUID)
// The privacy policy's "Email updates" section describes this self-hosted
// setup — update it if you switch providers.
export const LISTMONK_URL = 'https://news.speechtotext.dev';
export const LISTMONK_LIST_UUID = 'aef0a058-4b8a-4e1e-a8a9-475d3b108d3f';

// Google Analytics 4 measurement id. Empty string disables the gtag snippet.
// The privacy policy's "Analytics" section describes GA — keep them in sync.
export const GA_MEASUREMENT_ID = 'G-PF14W9N7K5';
