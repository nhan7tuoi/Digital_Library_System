import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "11407c16-3804-492a-9989-09fd88b1d244",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "https://thuvieniuh.online/auth", // URL của ứng dụng
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
