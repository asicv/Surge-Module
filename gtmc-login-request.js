// Capture only the confirmed native password-login form. Never log its value.
(function () {
  try {
    if ($request.method !== "POST" || typeof $request.body !== "string") return;
    var body = $request.body;
    var fields = new URLSearchParams(body);
    var seen = Object.create(null);
    var duplicate = false;
    fields.forEach(function (_, key) {
      if (seen[key]) duplicate = true;
      seen[key] = true;
    });
    if (duplicate) return;
    var required = ["accessToken", "appVersion", "checkCode", "deviceId",
      "deviceType", "distinctId", "fyxDevice", "loginType", "oftenType",
      "password", "phoneName", "phoneNumber", "pushId"];
    if (required.some(function (key) { return fields.getAll(key).length !== 1; })) return;
    if (fields.get("loginType") !== "2" || fields.get("checkCode") ||
        !fields.get("password") || !fields.get("phoneNumber") ||
        !fields.get("appVersion") || !fields.get("fyxDevice")) return;
    $persistentStore.write(JSON.stringify({
      requestId: $request.id,
      capturedAt: Date.now(),
      form: body,
      phone: fields.get("phoneNumber")
    }), "gtmc_login_pending");
  } catch (_) {
    // Capture failure must never affect App login.
  } finally {
    $done({});
  }
})();
