# 🐱 小小乐游戏 - GitHub 部署指南

## 🚀 快速部署步骤

### 方法一：使用自动化脚本（推荐）

#### Windows 用户：
```bash
# 双击运行或在命令行执行
deploy.bat
```

#### Mac/Linux 用户：
```bash
# 给脚本执行权限
chmod +x deploy.sh

# 运行脚本
./deploy.sh
```

### 方法二：手动操作

#### 1. 在 GitHub 创建私有仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `xiaoxiaole`
   - **Description**: `🐱 小小乐 - 可爱的猫咪三消游戏`
   - **Visibility**: 选择 **Private** (私有仓库)
   - **不要勾选** "Add a README file"
   - **不要勾选** "Add .gitignore"
   - **不要勾选** "Choose a license"
3. 点击 **"Create repository"**

#### 2. 在本地初始化 Git 仓库

打开命令行，在项目根目录执行：

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 创建首次提交
git commit -m "🎮 初始提交：小小乐猫咪三消游戏

✨ 功能特色：
- 🐱 可爱的猫咪主题，5种不同表情
- 🔊 真实猫叫音效，消除时播放
- 📱 响应式设计，支持手机和桌面
- ✨ 流畅的消除和下落动画
- 🎯 经典三消玩法
- 🏆 分数系统和连击奖励
- ⚙️ 音效音量和动画速度设置

🛠️ 技术栈：
- HTML5 + CSS3 + JavaScript (ES6+)
- Web Audio API + HTML5 Audio
- CSS3 Transitions + Transforms
- Flexbox + Media Queries

🚀 部署就绪：
- 包含 Netlify 和 Vercel 配置
- SEO 优化和 meta 标签
- 完整的项目文档"

# 设置主分支名称
git branch -M main

# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/xiaoxiaole.git

# 推送到 GitHub
git push -u origin main
```

#### 3. 验证上传成功

访问你的仓库地址：`https://github.com/YOUR_USERNAME/xiaoxiaole`

应该能看到所有项目文件已经上传成功。

## 🌐 部署到网站

### GitHub Pages 部署（免费）

1. 进入你的 GitHub 仓库
2. 点击 **Settings** 标签
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 部分选择：
   - **Deploy from a branch**
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. 点击 **Save**
6. 等待几分钟，访问：`https://YOUR_USERNAME.github.io/xiaoxiaole`

### Netlify 部署（推荐）

1. 访问 https://netlify.com
2. 注册/登录账号
3. 点击 **"New site from Git"**
4. 选择 **GitHub**，授权访问
5. 选择 `xiaoxiaole` 仓库
6. 部署设置：
   - **Branch**: `main`
   - **Build command**: 留空
   - **Publish directory**: 留空
7. 点击 **"Deploy site"**
8. 部署完成后获得类似 `https://amazing-name-123456.netlify.app` 的地址

### Vercel 部署

1. 访问 https://vercel.com
2. 注册/登录账号
3. 点击 **"New Project"**
4. 选择 **"Import Git Repository"**
5. 选择你的 `xiaoxiaole` 仓库
6. 保持默认设置，点击 **"Deploy"**
7. 部署完成后获得类似 `https://xiaoxiaole.vercel.app` 的地址

## 🔧 后续更新

当你修改游戏代码后，更新到 GitHub：

```bash
# 添加修改的文件
git add .

# 提交更改
git commit -m "描述你的更改"

# 推送到 GitHub
git push origin main
```

如果使用 Netlify 或 Vercel，它们会自动检测到 GitHub 的更新并重新部署。

## 🎯 自定义域名（可选）

如果你有自己的域名，可以在部署平台设置自定义域名：

### Netlify 自定义域名
1. 在 Netlify 项目设置中找到 **Domain management**
2. 点击 **Add custom domain**
3. 输入你的域名
4. 按照提示设置 DNS 记录

### GitHub Pages 自定义域名
1. 在仓库根目录创建 `CNAME` 文件
2. 文件内容写入你的域名（如：`game.yourdomain.com`）
3. 在域名 DNS 设置中添加 CNAME 记录指向 `YOUR_USERNAME.github.io`

## 📊 项目文件清单

确保以下文件都已上传到 GitHub：

```
xiaoxiaole/
├── 📄 index.html              # 主页面
├── 📁 css/
│   ├── style.css             # 主样式
│   └── animations.css        # 动画样式
├── 📁 js/
│   ├── game.js               # 游戏逻辑
│   ├── board.js              # 棋盘管理
│   ├── audio.js              # 音频管理
│   └── utils.js              # 工具函数
├── 📁 images/                # 猫咪图片
├── 📁 audio/                 # 猫叫音效
├── 📄 README.md              # 项目说明
├── 📄 .gitignore             # Git 忽略文件
├── 📄 netlify.toml           # Netlify 配置
├── 📄 vercel.json            # Vercel 配置
├── 📄 deploy.sh              # Linux/Mac 部署脚本
├── 📄 deploy.bat             # Windows 部署脚本
├── 📄 部署指南.md             # 部署说明
└── 📄 GitHub部署指南.md       # 本文件
```

## 🎉 完成！

恭喜！你的小小乐游戏现在已经：
- ✅ 存储在私有 GitHub 仓库中
- ✅ 可以通过网址访问
- ✅ 支持自动部署更新
- ✅ 具备完整的项目文档

享受你的猫咪三消游戏吧！🐱🎮
