# Bili Welcome

## 安装

```bash
npm install -g bili-welcome
```

更新时使用

```bash
npm install -g bili-welcome@latest
```

## 使用

```bash
bwel
```

### 参数

| 参数 | 简写 | 说明 | 备注 |
| --- |:-: | --- | --- |
| --config | -c | 配置文件路径 | 默认为 `./config.json` |
| --debug | -d | 开启调试模式 | |
| --no-response | -R | 关闭自动回复 | 默认启用自动回复 |
| --csrf | | cookie 中的 `bili_jct` 用作 `csrf` | |
| --sess | | cookie 中的 `SESSDATA` 用作 `sess` | |
| --roomId | | 直播间号 | 必须为整数 |

```bash
bwel -c "./config/config.json" -d -R --csrf 1234 --sess 5678 --roomId 4321
```

## 配置

`roomId`, `sess` 与 `csrf` 可以在命令行指定，但建议通过配置文件来指定。

注意，命令行指定的配置文件会覆盖全局配置文件中的参数，而通过命令行指定的参数具有最高的优先级。

### 配置文件

在 `Windows` 系统中，全局配置文件位于 `%LOCALAPPDATA%\bili-welcome\config.json` 文件，`macOS` 与 `Linux` 会读取 `~/.config/bili-welcome/config.json` 文件。如果不存在则会创建并写入空配置。

### 配置选项

```typescript
interface ConfigOptions {
    sess: string;
    csrf: string;
    roomId: number;
    // 指定为 true 或 false 时将会完全打开或关闭自动回复
    response:
        | boolean
        | {
              // 感谢投喂灯牌加入粉丝团的用户
              fans: boolean;
              // 感谢点击关注的用户
              follow: boolean;
              // 欢迎进入直播间的用户
              enter: boolean;
          };
}
```

获取 `csrf` 与 `sess` 的方法见 [获取 csrf 与 sess](#获取-csrf-与-sess)。

如果配置文件中没有指定，也没有在调用命令时传入，并且启用了自动回复（默认行为），则会在调用时尝试自动登录获取。

> ℹ 自动回复已启用，但 csrf 与 sess 未指定。尝试使用二维码登录
>
> ℹ 请使用手机 app 扫描二维码登录

扫码完成并在手机上确认登陆后即可自动获取 `csrf` 和 `sess`。配置会自动写入全局配置文件中。

### 获取 csrf 与 sess

打开开发工具后，进入 `Application`，左侧选择 `Storage` 里的 `Cookies`，找到 `bili_jct` 和 `SESSDATA`，将其值填入配置文件或命令行参数中。

![cookie](doc/cookie.png)

`bili_jct` 对应 `csrf`，`SESSDATA` 对应 `sess`。
