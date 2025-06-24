/**
 * 游戏棋盘管理类
 */
class GameBoard {
    constructor() {
        this.board = [];
        this.boardElement = null;
        this.selectedCell = null;
        this.isAnimating = false;
        this.init();
    }

    /**
     * 初始化棋盘
     */
    init() {
        this.boardElement = document.getElementById('game-board');
        this.createEmptyBoard();
        this.fillBoard();
        this.renderBoard();
        this.bindEvents();
    }

    /**
     * 创建空棋盘
     */
    createEmptyBoard() {
        this.board = [];
        for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
            this.board[row] = [];
            for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
                this.board[row][col] = null;
            }
        }
    }

    /**
     * 填充棋盘
     */
    fillBoard() {
        for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
            for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
                if (this.board[row][col] === null) {
                    this.board[row][col] = this.generateSafeCell(row, col);
                }
            }
        }
    }

    /**
     * 生成安全的单元格（避免初始就有三消）
     * @param {number} row 行
     * @param {number} col 列
     * @returns {number} 单元格类型
     */
    generateSafeCell(row, col) {
        const forbiddenTypes = new Set();
        
        // 检查水平方向
        if (col >= 2 && 
            this.board[row][col-1] === this.board[row][col-2]) {
            forbiddenTypes.add(this.board[row][col-1]);
        }
        
        // 检查垂直方向
        if (row >= 2 && 
            this.board[row-1][col] === this.board[row-2][col]) {
            forbiddenTypes.add(this.board[row-1][col]);
        }

        let cellType;
        do {
            cellType = GameUtils.randomCellType();
        } while (forbiddenTypes.has(cellType));

        return cellType;
    }

    /**
     * 渲染棋盘到DOM
     */
    renderBoard() {
        if (!this.boardElement) return;

        // 清空现有内容
        this.boardElement.innerHTML = '';

        // 创建单元格
        for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
            for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
                const cell = this.createCellElement(row, col);
                this.boardElement.appendChild(cell);
            }
        }
    }

    /**
     * 创建单元格DOM元素
     * @param {number} row 行
     * @param {number} col 列
     * @returns {HTMLElement} 单元格元素
     */
    createCellElement(row, col) {
        const cellType = this.board[row][col];
        const cell = GameUtils.createElement('div', {
            className: 'game-cell',
            'data-row': row,
            'data-col': col,
            'data-type': cellType
        });

        // 创建图片元素
        const img = GameUtils.createElement('img', {
            src: GAME_CONFIG.IMAGE_PATHS[cellType],
            alt: `游戏元素 ${cellType + 1}`,
            draggable: false
        });

        // 图片加载错误处理
        img.onerror = () => {
            console.warn(`图片加载失败: ${GAME_CONFIG.IMAGE_PATHS[cellType]}`);
            // 使用颜色块作为备用显示
            cell.style.backgroundColor = this.getBackupColor(cellType);
            cell.textContent = cellType + 1;
        };

        cell.appendChild(img);
        return cell;
    }

    /**
     * 获取备用颜色
     * @param {number} type 类型
     * @returns {string} 颜色值
     */
    getBackupColor(type) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
        return colors[type] || '#ddd';
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        if (!this.boardElement) return;

        this.boardElement.addEventListener('click', (e) => {
            if (this.isAnimating) return;

            const cell = e.target.closest('.game-cell');
            if (!cell) return;

            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);

            this.handleCellClick(row, col, cell);
        });
    }

    /**
     * 处理单元格点击
     * @param {number} row 行
     * @param {number} col 列
     * @param {HTMLElement} cellElement 单元格元素
     */
    handleCellClick(row, col, cellElement) {
        if (!this.selectedCell) {
            // 选择第一个单元格
            this.selectCell(row, col, cellElement);
        } else {
            const selectedRow = this.selectedCell.row;
            const selectedCol = this.selectedCell.col;

            if (selectedRow === row && selectedCol === col) {
                // 取消选择
                this.deselectCell();
            } else if (GameUtils.areAdjacent(selectedRow, selectedCol, row, col)) {
                // 交换相邻单元格
                this.swapCells(selectedRow, selectedCol, row, col);
            } else {
                // 选择新的单元格
                this.deselectCell();
                this.selectCell(row, col, cellElement);
            }
        }
    }

    /**
     * 选择单元格
     * @param {number} row 行
     * @param {number} col 列
     * @param {HTMLElement} cellElement 单元格元素
     */
    selectCell(row, col, cellElement) {
        this.selectedCell = { row, col, element: cellElement };
        GameUtils.addClass(cellElement, 'selected');
        GameUtils.showMessage('请选择相邻的元素进行交换');
    }

    /**
     * 取消选择单元格
     */
    deselectCell() {
        if (this.selectedCell) {
            GameUtils.removeClass(this.selectedCell.element, 'selected');
            this.selectedCell = null;
            GameUtils.showMessage('点击相邻的元素来交换位置！');
        }
    }

    /**
     * 交换单元格
     * @param {number} row1 第一个单元格行
     * @param {number} col1 第一个单元格列
     * @param {number} row2 第二个单元格行
     * @param {number} col2 第二个单元格列
     */
    swapCells(row1, col1, row2, col2) {
        // 交换数据
        const temp = this.board[row1][col1];
        this.board[row1][col1] = this.board[row2][col2];
        this.board[row2][col2] = temp;

        // 更新DOM
        this.updateCellDisplay(row1, col1);
        this.updateCellDisplay(row2, col2);

        // 取消选择
        this.deselectCell();

        // 检查是否形成匹配
        const matches = this.findMatches();
        if (matches.length > 0) {
            GameUtils.showMessage('太棒了！找到匹配！', 'success');
            // 触发消除逻辑（将在后续实现）
            this.handleMatches(matches);
        } else {
            // 无效移动，撤销交换
            GameUtils.showMessage('无效移动，已撤销', 'error');
            setTimeout(() => {
                this.swapCells(row1, col1, row2, col2); // 撤销交换
            }, 500);
        }
    }

    /**
     * 更新单元格显示
     * @param {number} row 行
     * @param {number} col 列
     */
    updateCellDisplay(row, col) {
        const cellElement = this.getCellElement(row, col);
        if (!cellElement) return;

        const cellType = this.board[row][col];

        if (cellType === null) {
            // 如果是空单元格，隐藏内容
            cellElement.style.opacity = '0';
            cellElement.dataset.type = '';
            return;
        }

        // 显示单元格
        cellElement.style.opacity = '1';
        cellElement.dataset.type = cellType;

        let img = cellElement.querySelector('img');
        if (!img) {
            // 如果没有图片元素，创建一个
            img = GameUtils.createElement('img', {
                draggable: false
            });
            cellElement.appendChild(img);
        }

        img.src = GAME_CONFIG.IMAGE_PATHS[cellType];
        img.alt = `游戏元素 ${cellType + 1}`;

        // 图片加载错误处理
        img.onerror = () => {
            console.warn(`图片加载失败: ${GAME_CONFIG.IMAGE_PATHS[cellType]}`);
            cellElement.style.backgroundColor = this.getBackupColor(cellType);
            cellElement.textContent = cellType + 1;
        };
    }

    /**
     * 获取单元格DOM元素
     * @param {number} row 行
     * @param {number} col 列
     * @returns {HTMLElement} 单元格元素
     */
    getCellElement(row, col) {
        return this.boardElement.querySelector(
            `[data-row="${row}"][data-col="${col}"]`
        );
    }

    /**
     * 查找匹配
     * @returns {Array} 匹配的单元格数组
     */
    findMatches() {
        const matches = [];
        const visited = new Set();

        // 检查水平匹配
        for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
            for (let col = 0; col <= GAME_CONFIG.BOARD_SIZE - GAME_CONFIG.MIN_MATCH; col++) {
                const match = this.findHorizontalMatch(row, col);
                if (match.length >= GAME_CONFIG.MIN_MATCH) {
                    match.forEach(cell => {
                        const key = `${cell.row}-${cell.col}`;
                        if (!visited.has(key)) {
                            matches.push(cell);
                            visited.add(key);
                        }
                    });
                }
            }
        }

        // 检查垂直匹配
        for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
            for (let row = 0; row <= GAME_CONFIG.BOARD_SIZE - GAME_CONFIG.MIN_MATCH; row++) {
                const match = this.findVerticalMatch(row, col);
                if (match.length >= GAME_CONFIG.MIN_MATCH) {
                    match.forEach(cell => {
                        const key = `${cell.row}-${cell.col}`;
                        if (!visited.has(key)) {
                            matches.push(cell);
                            visited.add(key);
                        }
                    });
                }
            }
        }

        return matches;
    }

    /**
     * 查找水平匹配
     * @param {number} row 行
     * @param {number} startCol 起始列
     * @returns {Array} 匹配的单元格
     */
    findHorizontalMatch(row, startCol) {
        const match = [];
        const cellType = this.board[row][startCol];

        for (let col = startCol; col < GAME_CONFIG.BOARD_SIZE; col++) {
            if (this.board[row][col] === cellType) {
                match.push({ row, col, type: cellType });
            } else {
                break;
            }
        }

        return match.length >= GAME_CONFIG.MIN_MATCH ? match : [];
    }

    /**
     * 查找垂直匹配
     * @param {number} startRow 起始行
     * @param {number} col 列
     * @returns {Array} 匹配的单元格
     */
    findVerticalMatch(startRow, col) {
        const match = [];
        const cellType = this.board[startRow][col];

        for (let row = startRow; row < GAME_CONFIG.BOARD_SIZE; row++) {
            if (this.board[row][col] === cellType) {
                match.push({ row, col, type: cellType });
            } else {
                break;
            }
        }

        return match.length >= GAME_CONFIG.MIN_MATCH ? match : [];
    }

    /**
     * 处理匹配（临时实现，后续会完善）
     * @param {Array} matches 匹配的单元格
     */
    handleMatches(matches) {
        console.log('找到匹配:', matches);
        // 这里将在后续实现完整的消除逻辑
        GameUtils.showMessage(`消除了 ${matches.length} 个元素！`, 'success');
    }

    /**
     * 重置棋盘
     */
    reset() {
        this.deselectCell();
        this.createEmptyBoard();
        this.fillBoard();
        this.renderBoard();
        GameUtils.showMessage('游戏已重置！');
    }
}

// 导出类
window.GameBoard = GameBoard;
