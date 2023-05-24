# Bili Welcome

## 安装

```bash
npm install -g bili-welcome
```

## 配置

可以通过命令行或者配置文件来配置。首先需要获取到 `csrf` 和 `sess`，可以通过浏览器的开发者工具来获取。

打开开发工具后，进入 `Application`，左侧选择 `Storage` 里的 `Cookies`，找到 `bili_jct` 和 `SESSDATA`，将其值填入配置文件或命令行参数中。

![cookie](doc/cookie.png)

`bili_jct` 对应 `csrf`，`SESSDATA` 对应 `sess`。

### 配置文件

默认读取当前目录下的 `config.txt` 文件，如果不存在则使用命令行参数。

也可以通过 `--config <path>` 或 `-c <path>` 来指定配置文件路径。

```txt
csrf=1234
sess=5678
roomId=4321
```

### 命令行

```bash
bwel --csrf=1234 --sess=5678 --roomId=4321
```

可以通过 `--debug` 或 `-d` 进入调试模式，调试模式下会输出更多信息。

注意，命令行参数会覆盖配置文件中的指定的参数。
