/**
 * 小小乐游戏工具函数
 */

// 游戏配置常量
const GAME_CONFIG = {
    BOARD_SIZE: 10,
    CELL_TYPES: 5,
    MIN_MATCH: 3,
    ANIMATION_DURATION: 300,
    FALL_DELAY: 50,
    IMAGE_PATHS: [
        'images/34082df024cbd3452775445f36e3e768.jpg',
        'images/39cb2fcd8c04f21d862de15d7839afe6.jpeg',
        'images/454779ffc4a9e5b2b2beb8ee8d3a6c5c.jpeg',
        'images/871f70e60b68c90c3cb092f36d4ea455.jpg',
        'images/e575cb5387e15a72b0f903285aa37d8f.jpeg'
    ]
};

// 工具函数类
class GameUtils {
    /**
     * 生成随机整数
     * @param {number} min 最小值
     * @param {number} max 最大值
     * @returns {number} 随机整数
     */
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 生成随机元素类型
     * @returns {number} 元素类型 (0-4)
     */
    static randomCellType() {
        return this.randomInt(0, GAME_CONFIG.CELL_TYPES - 1);
    }

    /**
     * 检查坐标是否在棋盘范围内
     * @param {number} row 行
     * @param {number} col 列
     * @returns {boolean} 是否有效
     */
    static isValidPosition(row, col) {
        return row >= 0 && row < GAME_CONFIG.BOARD_SIZE && 
               col >= 0 && col < GAME_CONFIG.BOARD_SIZE;
    }

    /**
     * 获取相邻位置
     * @param {number} row 行
     * @param {number} col 列
     * @returns {Array} 相邻位置数组
     */
    static getAdjacentPositions(row, col) {
        const positions = [];
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1] // 上下左右
        ];

        directions.forEach(([dr, dc]) => {
            const newRow = row + dr;
            const newCol = col + dc;
            if (this.isValidPosition(newRow, newCol)) {
                positions.push([newRow, newCol]);
            }
        });

        return positions;
    }

    /**
     * 检查两个位置是否相邻
     * @param {number} row1 第一个位置的行
     * @param {number} col1 第一个位置的列
     * @param {number} row2 第二个位置的行
     * @param {number} col2 第二个位置的列
     * @returns {boolean} 是否相邻
     */
    static areAdjacent(row1, col1, row2, col2) {
        const rowDiff = Math.abs(row1 - row2);
        const colDiff = Math.abs(col1 - col2);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    /**
     * 延迟执行函数
     * @param {number} ms 延迟毫秒数
     * @returns {Promise} Promise对象
     */
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 添加CSS类
     * @param {HTMLElement} element DOM元素
     * @param {string} className 类名
     */
    static addClass(element, className) {
        if (element && !element.classList.contains(className)) {
            element.classList.add(className);
        }
    }

    /**
     * 移除CSS类
     * @param {HTMLElement} element DOM元素
     * @param {string} className 类名
     */
    static removeClass(element, className) {
        if (element && element.classList.contains(className)) {
            element.classList.remove(className);
        }
    }

    /**
     * 切换CSS类
     * @param {HTMLElement} element DOM元素
     * @param {string} className 类名
     */
    static toggleClass(element, className) {
        if (element) {
            element.classList.toggle(className);
        }
    }

    /**
     * 创建DOM元素
     * @param {string} tag 标签名
     * @param {Object} attributes 属性对象
     * @param {string} textContent 文本内容
     * @returns {HTMLElement} 创建的元素
     */
    static createElement(tag, attributes = {}, textContent = '') {
        const element = document.createElement(tag);
        
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });

        if (textContent) {
            element.textContent = textContent;
        }

        return element;
    }

    /**
     * 显示状态消息
     * @param {string} message 消息内容
     * @param {string} type 消息类型 (success, error, info)
     */
    static showMessage(message, type = 'info') {
        const statusElement = document.getElementById('status-message');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `status-message ${type}`;
            
            // 添加动画效果
            this.addClass(statusElement, 'updating');
            setTimeout(() => {
                this.removeClass(statusElement, 'updating');
            }, 500);
        }
    }

    /**
     * 更新分数显示
     * @param {string} elementId 元素ID
     * @param {number} value 分数值
     * @param {boolean} animate 是否显示动画
     */
    static updateScore(elementId, value, animate = true) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value.toLocaleString();
            
            if (animate) {
                this.addClass(element, 'updating');
                setTimeout(() => {
                    this.removeClass(element, 'updating');
                }, 500);
            }
        }
    }

    /**
     * 显示分数弹出效果
     * @param {HTMLElement} element 目标元素
     * @param {number} points 分数
     */
    static showScorePopup(element, points) {
        const popup = this.createElement('div', {
            className: 'score-popup'
        }, `+${points}`);

        const rect = element.getBoundingClientRect();
        popup.style.left = rect.left + rect.width / 2 + 'px';
        popup.style.top = rect.top + 'px';

        document.body.appendChild(popup);

        // 1秒后移除弹出元素
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 1000);
    }

    /**
     * 本地存储操作
     */
    static storage = {
        /**
         * 保存数据到本地存储
         * @param {string} key 键名
         * @param {*} value 值
         */
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.warn('无法保存到本地存储:', e);
            }
        },

        /**
         * 从本地存储获取数据
         * @param {string} key 键名
         * @param {*} defaultValue 默认值
         * @returns {*} 存储的值或默认值
         */
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.warn('无法从本地存储读取:', e);
                return defaultValue;
            }
        },

        /**
         * 删除本地存储数据
         * @param {string} key 键名
         */
        remove(key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.warn('无法删除本地存储:', e);
            }
        }
    };

    /**
     * 防抖函数
     * @param {Function} func 要防抖的函数
     * @param {number} wait 等待时间
     * @returns {Function} 防抖后的函数
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * 节流函数
     * @param {Function} func 要节流的函数
     * @param {number} limit 限制时间
     * @returns {Function} 节流后的函数
     */
    static throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// 导出配置和工具类
window.GAME_CONFIG = GAME_CONFIG;
window.GameUtils = GameUtils;
