// Run one of the gtmc-copy-* generic scripts in Surge iOS.
// Surge asks before copying the value to the iOS clipboard.
(function () {
  try {
    if ($argument === "clear") {
      $persistentStore.write(null, "gtmc_login_pending");
      $persistentStore.write(null, "gtmc_login_latest");
      $notification.post("GTMC 登录采集", "本机采集已清除", "登录资料已从 Surge 持久存储移除。");
      return;
    }
    var allowed = ["phone", "token", "user_id", "uuid", "login_form"];
    if (allowed.indexOf($argument) === -1) return;
    var raw = $persistentStore.read("gtmc_login_latest");
    if (!raw) {
      $notification.post("GTMC 登录采集", "还没有登录记录", "请先在丰云行完成一次密码登录。");
      return;
    }
    var record = JSON.parse(raw);
    var value = record[$argument];
    if (typeof value !== "string" || !value) return;
    $notification.post("GTMC 登录采集", "点此复制 " + $argument,
      "复制后粘贴到 Home Assistant 对应字段。",
      { action: "clipboard", text: value });
  } catch (_) {
    $notification.post("GTMC 登录采集", "读取失败", "请检查模块和登录记录。");
  } finally {
    $done();
  }
})();
