const CLIENT_ID = '4e22c0f3-e4a4-432b-88ec-56594715748c';
const TENANT = 'common';
const ISSUER = `https://login.microsoftonline.com/common/v2.0`;
const REDIRECT_URL_IOS = 'com.library://com.library/auth/ios/callback';
const REDIRECT_URL_ANDROID = 'com.library://com.library/auth/android/callback';
const SCOPES = ['User.Read'];
const ADDITIONAL_PARAMETERS = {
    prompt: 'select_account',
};

export const envConfig = {
    CLIENT_ID,
    TENANT,
    ISSUER,
    REDIRECT_URL_IOS,
    REDIRECT_URL_ANDROID,
    SCOPES,
    ADDITIONAL_PARAMETERS,
};
