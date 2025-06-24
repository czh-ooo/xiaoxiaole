# 🐱 小小乐 - 可爱的三消游戏

一个基于 HTML5 的可爱三消游戏，采用猫咪主题，支持桌面和移动设备。

## 🎮 游戏特色

- 🐱 **可爱的猫咪主题** - 5种不同表情的猫咪角色
- 🔊 **真实猫叫音效** - 消除时播放真实的猫叫声
- 📱 **响应式设计** - 完美支持手机、平板和桌面
- ✨ **流畅动画** - 精美的消除和下落动画效果
- 🎯 **经典玩法** - 交换相邻元素形成三连或以上消除
- 🏆 **分数系统** - 记录当前分数、最高分和连击数

## 🚀 在线体验

[点击这里开始游戏](https://你的域名.com)

## 🎯 游戏玩法

1. **目标**：通过交换相邻的猫咪元素，形成三个或更多相同的猫咪连线
2. **操作**：
   - 桌面：点击选择第一个元素，再点击相邻元素进行交换
   - 移动端：触摸选择和交换元素
3. **得分**：
   - 基础分数：每个消除的元素 10 分
   - 连击奖励：连续消除获得额外分数
4. **音效**：消除猫咪时会播放可爱的猫叫声

## 🛠️ 技术栈

- **前端**：HTML5 + CSS3 + JavaScript (ES6+)
- **音频**：Web Audio API + HTML5 Audio
- **动画**：CSS3 Transitions + Transforms
- **响应式**：Flexbox + Media Queries

## 📁 项目结构

```
xiaoxiaole/
├── index.html          # 主页面
├── css/
│   ├── style.css       # 主样式文件
│   └── animations.css  # 动画样式
├── js/
│   ├── game.js         # 游戏主逻辑
│   ├── board.js        # 棋盘管理
│   ├── audio.js        # 音频管理
│   └── utils.js        # 工具函数
├── images/             # 猫咪图片资源
├── audio/              # 猫叫音效文件
└── README.md           # 项目说明
```

## 🎨 游戏截图

### 桌面版
![桌面版截图](images/desktop-screenshot.png)

### 移动版
![移动版截图](images/mobile-screenshot.png)

## 🔧 本地运行

1. **克隆项目**
```bash
git clone https://github.com/你的用户名/xiaoxiaole.git
cd xiaoxiaole
```

2. **启动本地服务器**
```bash
# 使用 Python
python -m http.server 3000

# 或使用 Node.js
npx serve .

# 或使用 PHP
php -S localhost:3000
```

3. **打开浏览器**
访问 `http://localhost:3000`

## 🌟 功能特点

### 🎵 音效系统
- 自动音频解锁，无需手动操作
- 5种不同的猫叫声随机播放
- 支持音量调节和静音
- 兼容各种浏览器的音频策略

### 🎮 游戏机制
- 智能匹配检测算法
- 连击系统和分数计算
- 自动填充和重力下落
- 游戏状态管理（暂停/继续）

### 📱 用户体验
- 直观的操作提示
- 流畅的动画反馈
- 响应式布局适配
- 本地存储最高分

## 🚀 部署指南

### GitHub Pages 部署
1. Fork 这个项目
2. 在仓库设置中启用 GitHub Pages
3. 选择 main 分支作为源
4. 访问 `https://你的用户名.github.io/xiaoxiaole`

### Netlify 部署
1. 注册 Netlify 账号
2. 连接 GitHub 仓库
3. 自动部署完成

详细部署指南请查看 [部署指南.md](部署指南.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发计划
- [ ] 添加更多关卡
- [ ] 实现道具系统
- [ ] 添加成就系统
- [ ] 支持多人对战
- [ ] PWA 支持

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- 猫咪图片素材来源于网络
- 音效文件为真实猫叫声录制
- 感谢所有测试和反馈的朋友们

---

**享受游戏，喵~ 🐱**
