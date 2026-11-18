// Capture only the confirmed native password-login form. Never log its value.
(function () {
  try {
    if ($request.method !== "POST" || typeof $request.body !== "string") return;
    var body = $request.body;
    var fields = new URLSearchParams(body);
    var required = ["accessToken", "appVersion", "checkCode", "deviceId",
      "deviceType", "distinctId", "fyxDevice", "loginType", "oftenType",
      "password", "phoneName", "phoneNumber", "pushId"];
    if (required.some(function (key) { return !fields.has(key); })) return;
    if (fields.get("loginType") !== "2" || fields.get("checkCode") ||
        !fields.get("password") || !fields.get("phoneNumber")) return;
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
