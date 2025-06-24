@echo off
chcp 65001 >nul
echo 🐱 小小乐游戏 - Git 仓库初始化脚本
echo ==================================

REM 检查是否已经是 Git 仓库
if exist ".git" (
    echo 📁 检测到现有 Git 仓库
    
    REM 添加所有文件
    echo 📝 添加文件到 Git...
    git add .
    
    REM 提交更改
    echo 💾 提交更改...
    set /p commit_message="请输入提交信息 (默认: 更新小小乐游戏): "
    if "%commit_message%"=="" set commit_message=更新小小乐游戏
    git commit -m "%commit_message%"
    
    REM 推送到远程仓库
    echo 🚀 推送到远程仓库...
    git push origin main
    
    echo ✅ Git 推送完成！
) else (
    echo 🔧 初始化新的 Git 仓库...
    
    REM 初始化 Git 仓库
    git init
    
    REM 添加所有文件
    echo 📝 添加所有文件...
    git add .
    
    REM 首次提交
    echo 💾 创建首次提交...
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
    
    REM 设置主分支
    git branch -M main
    
    echo.
    echo 🔗 连接到 GitHub 仓库: https://github.com/czh-ooo/xiaoxiaole.git
    echo.

    echo 🔗 添加远程仓库...
    git remote add origin "https://github.com/czh-ooo/xiaoxiaole.git"

    echo 🚀 推送到 GitHub...
    git push -u origin main

    if %errorlevel%==0 (
        echo ✅ 成功推送到 GitHub！
        echo 🌐 仓库地址: https://github.com/czh-ooo/xiaoxiaole
    ) else (
        echo ❌ 推送失败，请检查：
        echo 1. GitHub 仓库是否已创建
        echo 2. 是否有推送权限
        echo 3. 网络连接是否正常
    )
)

echo.
echo 🎉 Git 操作完成！
echo.
echo 📋 后续步骤：
echo 1. 🌐 GitHub Pages: 在仓库设置中启用 Pages
echo 2. 🚀 Netlify: 连接 GitHub 仓库自动部署
echo 3. ⚡ Vercel: 导入 GitHub 项目一键部署
echo.
echo 🎮 享受你的小小乐游戏！
pause
