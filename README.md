# GTMC 子账号登录采集

## iPhone Surge 在线安装

GitHub 仓库 `asicv/Surge-Module` 的根目录须放置以下四个最新版文件：

- `gtmc-login-github.sgmodule`
- `gtmc-login-request.js`
- `gtmc-login-response.js`
- `gtmc-login-copy.js`

在 iPhone Surge 中用下面的原始文件 URL 添加模块：

`https://raw.githubusercontent.com/asicv/Surge-Module/main/gtmc-login-github.sgmodule`

`python3 tools/build_surge_github_module.py asicv Surge-Module` 只会更新本地生成文件，不会上传 GitHub。生成文件里的 `script-path` 指向仓库根目录中的三个 `.js` 文件；若 GitHub 中的脚本实际放在其他目录，须调整生成器或仓库布局。更新仓库后，在 Surge 中更新模块和脚本缓存。在线安装无需将文件放入 iCloud Drive。

## iPhone Surge 本地安装

将 `gtmc-login-ios.zip` 解压得到的 `Module` 和 `Script` 两个文件夹放入 iPhone「文件」App 的 `iCloud Drive/Surge/`（对应 `Surge/Module/gtmc-login-capture.sgmodule` 与 `Surge/Script/gtmc-login-*.js`）。在 Surge 的模块列表中刷新并启用「GTMC 子账号登录采集」。本地包由 `python3 tools/build_surge_ios_bundle.py` 从同一套脚本生成。

两种安装方式任选其一，不要同时启用。启用 Surge MITM 并让丰云行流量经过 Surge。模块只匹配已验证的 `appUserLogin.json` 密码登录（`loginType=2`）；已有登录会话不会触发采集。如果其他已启用模块先匹配同一请求或响应，Surge 只会运行第一个匹配脚本，需避免规则冲突。

登录成功后 Surge 会提示“已保存成功登录资料”。在 Surge 的脚本列表中长按对应的 `gtmc-copy-*` 脚本执行，点通知即可复制单个字段：

`gtmc-copy-phone`、`gtmc-copy-token`、`gtmc-copy-user-id`、`gtmc-copy-uuid`、`gtmc-copy-login-form`。用完运行 `gtmc-clear-login-data` 清除本机采集。

每次只把一个字段复制到 iPhone 剪贴板。前四项对应 HA 初次配置的手机号、JWT、用户 ID、账户 ID；`login_form` 填到 HA 集成选项中的“密码登录请求体”，与“JWT 过期时自动登录”一起使用。当前 HA 条目若已经保存这些字段，无需重新填。仅用 HA 专用子账号：完整登录可能使同账号的手机 App 会话退出。

Surge iOS 持久存储会保存最近一次成功登录的完整 JWT 和密码等效表单。复制完成后可以禁用模块并在 Surge 中清除脚本持久数据。不要分享持久数据、脚本日志或剪贴板内容。模块本身不向 HA 写配置，也不会自动替 HA 登录；HA 已有的自动登录机制负责会话到期后的重登。
