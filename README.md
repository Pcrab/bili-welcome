# Bili Welcome

## 安装

```bash
npm install -g bili-welcome
```

## 配置

可以通过命令行或者配置文件来配置

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

注意，命令行参数会覆盖配置文件中的指定的参数。
