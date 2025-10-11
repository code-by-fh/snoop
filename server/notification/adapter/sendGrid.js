import sgMail from "@sendgrid/mail";
import { markdown2Html } from "../../services/markdown.js";

export const send = ({ serviceName, listings, notificationAdapters, jobName }) => {
  const { apiKey, receiver, from, templateId } = notificationAdapters.find((adapter) => adapter.id === config.id).fields;
  sgMail.setApiKey(apiKey);
  const msg = {
    templateId,
    to: receiver
      .trim()
      .split(",")
      .map((r) => r.trim()),
    from,
    subject: `Job ${jobName} | Service ${serviceName} found ${listings.length} new listing(s)`,
    dynamic_template_data: {
      serviceName: `Job: (${jobName}) | Service: ${serviceName}`,
      numberOfListings: listings.length,
      listings: listings,
    },
  };
  return sgMail.send(msg);
};

export const config = {
  id: "sendgrid",
  name: "SendGrid",
  description: "SendGrid is being used to send new listings via mail.",
  readme: markdown2Html("./notification/adapter/sendGrid.md"),
  fields: {
    apiKey: {
      type: "text",
      label: "Api Key",
      description: "The api key needed to access this service.",
    },
    receiver: {
      type: "email",
      label: "Receiver Email",
      description: "The email address (single one) which Fredy is using to send notifications to.",
    },
    from: {
      type: "email",
      label: "Sender Email",
      description: "The email address from which Fredy send email. Beware, this email address needs to be verified by Sendgrid.",
    },
    templateId: {
      type: "text",
      label: "Template Id",
      description: "Sendgrid supports templates which Fredy is using to send out emails that looks awesome ;)",
    },
  },
};
