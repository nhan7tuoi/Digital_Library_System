export const openNotificationWithIcon = (api, message, description) => {
  api["error"]({
    message: message,
    description: description,
  });
};
