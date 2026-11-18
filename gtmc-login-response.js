// Only a matched successful login is promoted from pending to latest.
(function () {
  try {
    var raw = $persistentStore.read("gtmc_login_pending");
    if (!raw) return;
    var pending = JSON.parse(raw);
    if (pending.requestId !== $request.id) return;
    $persistentStore.write(null, "gtmc_login_pending");
    if (Date.now() - pending.capturedAt > 120000 ||
        $response.status !== 200 || typeof $response.body !== "string") return;
    var result = JSON.parse($response.body);
    if (result.success !== true || result.resultCode !== 200 ||
        !result.data || typeof result.data.jwt !== "string" ||
        !result.data.rData || !result.data.rData.userId ||
        !result.data.rData.uuid ||
        String(result.data.rData.telPhone || result.data.rData.username) !== pending.phone) return;
    $persistentStore.write(JSON.stringify({
      capturedAt: Date.now(),
      phone: pending.phone,
      token: result.data.jwt,
      user_id: String(result.data.rData.userId),
      uuid: String(result.data.rData.uuid),
      login_form: pending.form
    }), "gtmc_login_latest");
    $notification.post("GTMC 登录采集", "已保存成功登录资料", "可用本机导出工具复制到 HA；未修改 App 响应。");
  } catch (_) {
    // Never print upstream bodies, credentials or parsing errors.
  } finally {
    $done({});
  }
})();
