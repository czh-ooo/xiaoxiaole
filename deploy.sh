#!/bin/bash

# 小小乐游戏 Git 初始化和部署脚本
echo "🐱 小小乐游戏 - Git 仓库初始化脚本"
echo "=================================="

# 检查是否已经是 Git 仓库
if [ -d ".git" ]; then
    echo "📁 检测到现有 Git 仓库"

    # 添加所有文件
    echo "📝 添加文件到 Git..."
    git add .

    # 提交更改
    echo "💾 提交更改..."
    read -p "请输入提交信息 (默认: 更新小小乐游戏): " commit_message
    commit_message=${commit_message:-"更新小小乐游戏"}
    git commit -m "$commit_message"

    # 推送到远程仓库
    echo "🚀 推送到远程仓库..."
    git push origin main

    echo "✅ Git 推送完成！"
else
    echo "🔧 初始化新的 Git 仓库..."

    # 初始化 Git 仓库
    git init

    # 添加所有文件
    echo "📝 添加所有文件..."
    git add .

    # 首次提交
    echo "💾 创建首次提交..."
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

    # 设置主分支
    git branch -M main

    echo ""
    echo "🔗 请按以下步骤连接到 GitHub 仓库："
    echo "1. 在 GitHub 创建新的私有仓库 'xiaoxiaole'"
    echo "2. 复制仓库 URL"
    echo "3. 运行以下命令："
    echo ""
    echo "   git remote add origin https://github.com/你的用户名/xiaoxiaole.git"
    echo "   git push -u origin main"
    echo ""

    # 询问是否现在就添加远程仓库
    read -p "是否现在添加远程仓库？请输入你的 GitHub 用户名 (留空跳过): " github_username

    if [ ! -z "$github_username" ]; then
        echo "🔗 添加远程仓库..."
        git remote add origin "https://github.com/$github_username/xiaoxiaole.git"

        echo "🚀 推送到 GitHub..."
        git push -u origin main

        if [ $? -eq 0 ]; then
            echo "✅ 成功推送到 GitHub！"
            echo "🌐 仓库地址: https://github.com/$github_username/xiaoxiaole"
        else
            echo "❌ 推送失败，请检查："
            echo "1. GitHub 仓库是否已创建"
            echo "2. 用户名是否正确"
            echo "3. 是否有推送权限"
        fi
    else
        echo "⏭️ 跳过远程仓库设置"
    fi
fi

echo ""
echo "🎉 Git 操作完成！"
echo ""
echo "📋 后续步骤："
echo "1. 🌐 GitHub Pages: 在仓库设置中启用 Pages"
echo "2. 🚀 Netlify: 连接 GitHub 仓库自动部署"
echo "3. ⚡ Vercel: 导入 GitHub 项目一键部署"
echo ""
echo "🎮 享受你的小小乐游戏！"
