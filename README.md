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
| --no-blockBot | -B | 关闭屏蔽机器人用户 | 默认启用屏蔽机器人用户 |
| --no-response | -R | 关闭自动回复 | 默认启用自动回复 |
| --roomId | | 直播间号 | 必须为整数 |

```bash
bwel -c "./config/config.json" -d -R --csrf 1234 --sess 5678 --roomId 4321
```

## 配置

### 配置文件

在 `Windows` 系统中，全局配置文件位于 `%LOCALAPPDATA%\bili-welcome\config.json` 文件，`macOS` 与 `Linux` 会读取 `~/.config/bili-welcome/config.json` 文件。如果不存在则会创建并写入空配置。

即使命令行通过 `--config` 或 `-c` 参数指定了配置文件，**依然会读取全局配置文件**。指定的配置会覆盖全局配置文件中的配置。

### 配置选项

```typescript
interface ConfigOptions {
    sess: string; // SESSDATA
    csrf: string; // bili_jct
    blockBot: boolen | string; // 是否屏蔽机器人用户
    roomId: number; // 长直播间号
    sendGap: number; // 发送消息的间隔，单位为毫秒
    maxRetry: number; // 最大重试次数
    // 指定为 true 或 false 时将会完全打开或关闭自动回复
    response:
        | boolean
        | {
              // 感谢投喂灯牌加入粉丝团的用户
              fans: boolean;
              // 感谢点击关注的用户，收到该消息原理未知，因此感谢不稳定
              follow: boolean;
              // 欢迎进入直播间的用户
              enter: boolean;
              // 感谢投喂礼物的用户
              gift: boolean;
          };
    giftMergeTime: number; // 礼物合并时间，单位为毫秒
}
```

### 获取 csrf 与 sess

如果配置文件中没有指定，并且启用了自动回复（默认行为），则会在调用时尝试自动登录获取。

> ℹ 自动回复已启用，但 csrf 与 sess 未指定。尝试使用二维码登录
>
> ℹ 请使用手机 app 扫描二维码登录

扫码完成并在手机上确认登陆后即可自动获取 `csrf` 和 `sess`。配置会自动写入全局配置文件中。

打开开发工具后，进入 `Application`，左侧选择 `Storage` 里的 `Cookies`，找到 `bili_jct` 和 `SESSDATA`，将其值填入配置文件或命令行参数中。

![cookie](doc/cookie.png)

`bili_jct` 对应 `csrf`，`SESSDATA` 对应 `sess`。

### blockBot

默认情况下，会屏蔽机器人用户。如果需要关闭屏蔽，请在配置文件中将 `blockBot` 设置为 `false`。

当用户名满足机器人正则表达式时，会被屏蔽。可以将 `blockBot` 的值设置为正则表达式字符串，以自定义机器人的匹配规则。

默认的机器人正则表达式字符串为 `"(\\d\\d-\\d\\d-\\d\\d\\d.*)|(bili_[0-9]{5,})"`。

### roomId

设置监听的直播间号。

### sendGap

设置回复消息发送的时间间隔，单位为毫秒。

所有消息都会在队列中，按照指定的间隔一条条发送。

### maxRetry

设置最大重试次数。消息在发送失败后会被加入队列的最前面，优先尝试重发消息。

### response

可以将 `response` 设置为 `true` 或 `false`，回复所有种类的消息或关闭所有回复。

也可以针对某一种消息进行设置。默认开启回复。

```json
{
    "response": {
        "fans": true,
        "enter": false,
        "gift": true
    }
}
```

上面的代码中，指定回复加入粉丝团和赠送礼物，关闭了进场消息。没有指定是否回复用户关注直播间，因此默认会进行回复。

也可以设置为字符串类型来自定义回复内容。

```json
{
    "response": {
        "enter": "欢迎%s来到直播间",
        "fans": "%s加入了%m",
        "gift": "%s赠送了%c个%g"
    }
}
```

可以用 `%s` 指代用户名，`%m` 指代主播粉丝牌名称。在 `gift` 中，还可以用 `%c` 指代礼物数量，`%g` 指代礼物名称。

注意，由于有弹幕最长长度限制，用户名可能会被截取，因此 `%s` 只会替换出现的第一次。

当前默认回复内容为:

```json
{
    "response": {
        "enter": "欢迎 %s 进入直播间～",
        "fans": "感谢 %s 加入%m～",
        "follow": "感谢 %s 的关注喵～",
        "gift": "感谢 %s 的%c个%g～"
    }
}
```

### giftMergeTime

设置礼物合并等待时间，单位为毫秒。

用户可能会在短时间内送出多个同种礼物。为了避免多次发送消息，会将同一用户在短时间内送出的同一种礼物合并感谢。每次赠送该礼物都会刷新计时。

```txt
用户「xxx」赠送了 1 个 xxx
用户「xxx」赠送了 1 个 xxx
用户「xxx」赠送了 1 个 xxx
用户「xxx」赠送了 1 个 xxx
用户「xxx」赠送了 1 个 xxx
用户「xxx」赠送了 1 个 xxx
用户「xxx」赠送了 1 个 xxx
用户「xxx」赠送了 1 个 xxx
```

将会被合并后感谢："感谢xxx送的8个xxx"

注意，**每个**用户送出的**每种**礼物都会单独计时。

## 已知问题

1. 启用感谢关注的用户时，由于只监听 `INTERACT_WORD` 事件，而用户关注直播间触发该事件的原理未知，因此感谢关注不稳定。
