/**
 * 小小乐游戏主类
 */
class XiaoXiaoLeGame {
    constructor() {
        this.board = null;
        this.audioManager = null;
        this.score = 0;
        this.highScore = 0;
        this.combo = 0;
        this.isGameRunning = false;
        this.isPaused = false;
    }

    /**
     * 初始化游戏
     */
    init() {
        this.showLoading(true);
        
        // 初始化各个组件
        this.initComponents();
        
        // 加载游戏数据
        this.loadGameData();
        
        // 绑定事件
        this.bindEvents();
        
        // 开始游戏
        this.startGame();
        
        setTimeout(() => {
            this.showLoading(false);
            GameUtils.showMessage('游戏开始！点击相邻元素进行交换', 'success');

            // 显示调试面板（开发时使用）
            this.showDebugPanel();

            // 设置全局访问
            window.game = this;
        }, 1000);
    }

    /**
     * 初始化组件
     */
    initComponents() {
        this.audioManager = new AudioManager();
        this.board = new GameBoard();

        // 预加载音效
        this.audioManager.preloadSounds();

        // 重写棋盘的handleMatches方法
        this.board.handleMatches = this.handleMatches.bind(this);
    }

    /**
     * 加载游戏数据
     */
    loadGameData() {
        this.highScore = GameUtils.storage.get('highScore', 0);
        this.updateScoreDisplay();
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 重新开始按钮
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.restartGame();
                this.audioManager.playClick();
            });
        }

        // 暂停按钮
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.togglePause();
                this.audioManager.playClick();
            });
        }

        // 设置按钮
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showSettings();
                this.audioManager.playClick();
            });
        }



        // 模态框事件
        this.bindModalEvents();
    }

    /**
     * 绑定模态框事件
     */
    bindModalEvents() {
        // 游戏结束模态框
        const restartModalBtn = document.getElementById('restart-modal-btn');
        const closeModalBtn = document.getElementById('close-modal-btn');
        
        if (restartModalBtn) {
            restartModalBtn.addEventListener('click', () => {
                this.hideModal('game-over-modal');
                this.restartGame();
            });
        }

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                this.hideModal('game-over-modal');
            });
        }

        // 设置模态框
        const saveSettingsBtn = document.getElementById('save-settings-btn');
        const cancelSettingsBtn = document.getElementById('cancel-settings-btn');

        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.saveSettings();
                this.hideModal('settings-modal');
            });
        }

        if (cancelSettingsBtn) {
            cancelSettingsBtn.addEventListener('click', () => {
                this.hideModal('settings-modal');
            });
        }
    }

    /**
     * 开始游戏
     */
    startGame() {
        this.isGameRunning = true;
        this.isPaused = false;
        this.score = 0;
        this.combo = 0;
        this.updateScoreDisplay();
        
        // 检查初始匹配
        this.checkInitialMatches();
    }

    /**
     * 检查初始匹配
     */
    checkInitialMatches() {
        const matches = this.board.findMatches();
        if (matches.length > 0) {
            // 如果有初始匹配，自动消除
            setTimeout(() => {
                this.handleMatches(matches);
            }, 500);
        }
    }

    /**
     * 处理匹配
     * @param {Array} matches 匹配的单元格
     */
    async handleMatches(matches) {
        if (!matches || matches.length === 0) return;

        this.board.isAnimating = true;
        
        // 播放消除音效
        console.log('准备播放消除音效...');
        if (this.audioManager) {
            console.log('AudioManager存在，调用playMatch');
            this.audioManager.playMatch();
        } else {
            console.warn('AudioManager不存在！');
        }
        
        // 计算分数
        const points = this.calculateScore(matches.length);
        this.addScore(points);
        
        // 增加连击
        this.combo++;
        this.updateScoreDisplay();
        
        // 显示消除动画
        await this.animateRemoval(matches);
        
        // 移除匹配的元素
        this.removeMatches(matches);
        
        // 元素下落
        await this.animateFall();
        
        // 填充新元素
        this.fillEmptySpaces();
        
        // 检查连锁反应
        const newMatches = this.board.findMatches();
        if (newMatches.length > 0) {
            // 连击音效
            this.audioManager.playCombo();
            GameUtils.showMessage(`${this.combo}连击！`, 'success');
            
            // 递归处理连锁
            setTimeout(() => {
                this.handleMatches(newMatches);
            }, 300);
        } else {
            // 重置连击
            this.combo = 0;
            this.updateScoreDisplay();
            this.board.isAnimating = false;
            
            // 检查游戏是否结束
            this.checkGameOver();
        }
    }

    /**
     * 计算分数
     * @param {number} matchCount 匹配数量
     * @returns {number} 分数
     */
    calculateScore(matchCount) {
        let baseScore = matchCount * 10;
        let comboBonus = this.combo * 5;
        return baseScore + comboBonus;
    }

    /**
     * 添加分数
     * @param {number} points 分数
     */
    addScore(points) {
        this.score += points;
        
        // 检查最高分
        if (this.score > this.highScore) {
            this.highScore = this.score;
            GameUtils.storage.set('highScore', this.highScore);
        }
    }

    /**
     * 更新分数显示
     */
    updateScoreDisplay() {
        GameUtils.updateScore('current-score', this.score);
        GameUtils.updateScore('high-score', this.highScore, false);
        GameUtils.updateScore('combo-count', this.combo, false);
    }

    /**
     * 消除动画
     * @param {Array} matches 要消除的匹配
     */
    async animateRemoval(matches) {
        matches.forEach(match => {
            const cellElement = this.board.getCellElement(match.row, match.col);
            if (cellElement) {
                GameUtils.addClass(cellElement, 'removing');
            }
        });

        await GameUtils.delay(GAME_CONFIG.ANIMATION_DURATION);
    }

    /**
     * 移除匹配的元素
     * @param {Array} matches 匹配的元素
     */
    removeMatches(matches) {
        matches.forEach(match => {
            this.board.board[match.row][match.col] = null;
        });
    }

    /**
     * 下落动画
     */
    async animateFall() {
        // 让元素下落填补空位
        for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
            // 收集该列所有非空元素
            const nonEmptyElements = [];
            for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
                if (this.board.board[row][col] !== null) {
                    nonEmptyElements.push(this.board.board[row][col]);
                }
            }

            // 清空该列
            for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
                this.board.board[row][col] = null;
            }

            // 从底部开始填充非空元素
            let fillRow = GAME_CONFIG.BOARD_SIZE - 1;
            for (let i = nonEmptyElements.length - 1; i >= 0; i--) {
                this.board.board[fillRow][col] = nonEmptyElements[i];
                this.board.updateCellDisplay(fillRow, col);

                // 添加下落动画
                const cellElement = this.board.getCellElement(fillRow, col);
                if (cellElement) {
                    GameUtils.addClass(cellElement, 'falling');
                    setTimeout(() => {
                        GameUtils.removeClass(cellElement, 'falling');
                    }, GAME_CONFIG.ANIMATION_DURATION);
                }
                fillRow--;
            }
        }

        await GameUtils.delay(GAME_CONFIG.ANIMATION_DURATION);
    }

    /**
     * 填充空位
     */
    fillEmptySpaces() {
        // 从顶部开始填充空位
        for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
            for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
                if (this.board.board[row][col] === null) {
                    // 生成新的随机元素
                    this.board.board[row][col] = GameUtils.randomCellType();
                    this.board.updateCellDisplay(row, col);

                    // 添加新元素动画
                    const cellElement = this.board.getCellElement(row, col);
                    if (cellElement) {
                        GameUtils.addClass(cellElement, 'new-element');
                        setTimeout(() => {
                            GameUtils.removeClass(cellElement, 'new-element');
                        }, GAME_CONFIG.ANIMATION_DURATION * 2);
                    }
                }
            }
        }

        // 确保棋盘完全填满
        this.board.renderBoard();
    }

    /**
     * 检查游戏是否结束
     */
    checkGameOver() {
        // 简单的游戏结束检查：是否还有可能的移动
        // 这里可以实现更复杂的逻辑
        GameUtils.showMessage('继续游戏！寻找更多匹配', 'info');
    }

    /**
     * 重新开始游戏
     */
    restartGame() {
        this.board.reset();
        this.startGame();
        GameUtils.showMessage('游戏重新开始！', 'success');
    }

    /**
     * 切换暂停状态
     */
    togglePause() {
        this.isPaused = !this.isPaused;
        
        const pauseBtn = document.getElementById('pause-btn');
        const icon = pauseBtn?.querySelector('.btn-icon');
        const text = pauseBtn?.querySelector('.btn-text');
        
        if (this.isPaused) {
            if (icon) icon.textContent = '▶️';
            if (text) text.textContent = '继续';
            GameUtils.showMessage('游戏已暂停', 'info');
        } else {
            if (icon) icon.textContent = '⏸️';
            if (text) text.textContent = '暂停';
            GameUtils.showMessage('游戏继续', 'success');
        }
    }

    /**
     * 显示设置
     */
    showSettings() {
        this.showModal('settings-modal');
    }

    /**
     * 保存设置
     */
    saveSettings() {
        const volumeSlider = document.getElementById('sound-volume');
        if (volumeSlider) {
            this.audioManager.setVolume(volumeSlider.value / 100);
        }
        
        GameUtils.showMessage('设置已保存', 'success');
    }

    /**
     * 显示模态框
     * @param {string} modalId 模态框ID
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            GameUtils.addClass(modal, 'show');
        }
    }

    /**
     * 隐藏模态框
     * @param {string} modalId 模态框ID
     */
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            GameUtils.removeClass(modal, 'show');
        }
    }

    /**
     * 显示/隐藏加载提示
     * @param {boolean} show 是否显示
     */
    showLoading(show) {
        const loading = document.getElementById('loading');
        if (loading) {
            if (show) {
                GameUtils.addClass(loading, 'show');
            } else {
                GameUtils.removeClass(loading, 'show');
            }
        }
    }



    /**
     * 显示调试面板
     */
    showDebugPanel() {
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel) {
            debugPanel.style.display = 'block';
            this.updateDebugInfo();

            // 定期更新调试信息
            setInterval(() => {
                this.updateDebugInfo();
            }, 2000);
        }
    }


}

// 导出类
window.XiaoXiaoLeGame = XiaoXiaoLeGame;
