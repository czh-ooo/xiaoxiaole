/**
 * 音效管理类
 */
class AudioManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.5;
        this.init();
    }

    /**
     * 初始化音效系统
     */
    init() {
        // 从本地存储加载设置
        this.enabled = GameUtils.storage.get('soundEnabled', true);
        this.volume = GameUtils.storage.get('soundVolume', 0.5);

        // 创建音效对象
        this.createSounds();

        // 绑定事件
        this.bindEvents();

        // 自动解锁音频（延迟一点以确保页面加载完成）
        setTimeout(() => {
            this.autoUnlockAudio();
        }, 100);
    }

    /**
     * 创建音效对象
     */
    createSounds() {
        // 初始化sounds对象
        this.sounds = {
            click: this.createBeepSound(400, 0.1), // 点击音效
            invalid: this.createBeepSound(200, 0.2), // 无效操作音效
            success: this.createSuccessSound() // 成功音效
        };

        // 加载真实的猫叫声音频文件
        this.loadMultipleMeowSounds();
    }

    /**
     * 创建喵喵叫声音效
     * @returns {Function} 播放函数
     */
    createMeowSound() {
        return () => {
            if (!this.enabled) return;

            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator1 = audioContext.createOscillator();
                const oscillator2 = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator1.connect(gainNode);
                oscillator2.connect(gainNode);
                gainNode.connect(audioContext.destination);

                // 模拟猫叫声的频率变化
                oscillator1.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator1.frequency.linearRampToValueAtTime(400, audioContext.currentTime + 0.1);
                oscillator1.frequency.linearRampToValueAtTime(600, audioContext.currentTime + 0.3);

                oscillator2.frequency.setValueAtTime(1200, audioContext.currentTime);
                oscillator2.frequency.linearRampToValueAtTime(800, audioContext.currentTime + 0.2);

                oscillator1.type = 'sawtooth';
                oscillator2.type = 'triangle';

                // 音量包络，模拟猫叫的起伏
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.4, audioContext.currentTime + 0.05);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, audioContext.currentTime + 0.15);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, audioContext.currentTime + 0.25);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

                oscillator1.start(audioContext.currentTime);
                oscillator2.start(audioContext.currentTime);
                oscillator1.stop(audioContext.currentTime + 0.4);
                oscillator2.stop(audioContext.currentTime + 0.4);
            } catch (error) {
                console.warn('喵喵叫音效播放失败:', error);
            }
        };
    }

    /**
     * 创建连击喵叫声
     * @returns {Function} 播放函数
     */
    createComboMeowSound() {
        return () => {
            if (!this.enabled) return;

            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();

                // 播放两声快速的喵叫
                for (let i = 0; i < 2; i++) {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    const startTime = audioContext.currentTime + i * 0.2;

                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    oscillator.frequency.setValueAtTime(900 + i * 200, startTime);
                    oscillator.frequency.linearRampToValueAtTime(500 + i * 100, startTime + 0.15);
                    oscillator.type = 'sawtooth';

                    gainNode.gain.setValueAtTime(0, startTime);
                    gainNode.gain.linearRampToValueAtTime(this.volume * 0.5, startTime + 0.02);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

                    oscillator.start(startTime);
                    oscillator.stop(startTime + 0.15);
                }
            } catch (error) {
                console.warn('连击喵叫音效播放失败:', error);
            }
        };
    }

    /**
     * 创建成功音效
     * @returns {Function} 播放函数
     */
    createSuccessSound() {
        return () => {
            if (!this.enabled) return;

            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                // 上升的音调表示成功
                oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(800, audioContext.currentTime + 0.3);
                oscillator.type = 'triangle';

                gainNode.gain.setValueAtTime(this.volume * 0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            } catch (error) {
                console.warn('成功音效播放失败:', error);
            }
        };
    }

    /**
     * 使用Web Audio API创建简单的蜂鸣音效
     * @param {number} frequency 频率
     * @param {number} duration 持续时间
     * @returns {Function} 播放函数
     */
    createBeepSound(frequency, duration) {
        return () => {
            if (!this.enabled) return;

            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(this.volume * 0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (error) {
                console.warn('音效播放失败:', error);
            }
        };
    }

    /**
     * 加载多个猫叫声音频文件
     */
    loadMultipleMeowSounds() {
        this.meowSounds = [];
        this.comboMeowSounds = [];
        this.loadedCount = 0;
        this.totalSounds = 5;

        console.log('开始加载猫叫声音频文件...');

        // 加载5个不同的猫叫声
        for (let i = 1; i <= 5; i++) {
            const audio = new Audio(`audio/meow${i}.mp3`);
            audio.preload = 'auto';
            audio.volume = this.volume;
            audio.crossOrigin = 'anonymous'; // 处理跨域问题

            audio.addEventListener('loadeddata', () => {
                this.loadedCount++;
                console.log(`猫叫声 ${i} 加载成功 (${this.loadedCount}/${this.totalSounds})`);
            });

            audio.addEventListener('error', (e) => {
                console.warn(`猫叫声音频文件加载失败: audio/meow${i}.mp3`, e);
            });

            audio.addEventListener('canplaythrough', () => {
                console.log(`猫叫声 ${i} 可以播放`);
            });

            this.meowSounds.push(audio);

            // 为连击创建副本
            const comboAudio = new Audio(`audio/meow${i}.mp3`);
            comboAudio.preload = 'auto';
            comboAudio.volume = this.volume * 1.2; // 连击音效稍微大声一点
            comboAudio.crossOrigin = 'anonymous';
            this.comboMeowSounds.push(comboAudio);
        }

        // 创建播放函数并添加到sounds对象
        if (!this.sounds) {
            this.sounds = {};
        }
        this.sounds.match = this.createRandomMeowPlayer();
        this.sounds.combo = this.createComboMeowPlayer();

        console.log(`已创建 ${this.meowSounds.length} 个猫叫声音频对象`);
    }

    /**
     * 创建随机猫叫声播放器
     * @returns {Function} 播放函数
     */
    createRandomMeowPlayer() {
        return () => {
            console.log('尝试播放猫叫声...', { enabled: this.enabled, soundsCount: this.meowSounds?.length });

            if (!this.enabled) {
                console.log('音效已禁用');
                return;
            }

            if (!this.meowSounds || this.meowSounds.length === 0) {
                console.warn('没有可用的猫叫声音频，使用合成音效');
                this.createMeowSound()();
                return;
            }

            try {
                // 随机选择一个猫叫声
                const randomIndex = Math.floor(Math.random() * this.meowSounds.length);
                const audio = this.meowSounds[randomIndex];

                console.log(`播放猫叫声 ${randomIndex + 1}`);

                audio.currentTime = 0;
                audio.volume = this.volume;

                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log(`猫叫声 ${randomIndex + 1} 播放成功`);
                    }).catch(error => {
                        console.warn(`猫叫声 ${randomIndex + 1} 播放失败:`, error);
                        // 如果真实音频播放失败，回退到合成音效
                        console.log('回退到合成音效');
                        this.createMeowSound()();
                    });
                }
            } catch (error) {
                console.warn('猫叫声播放异常:', error);
                // 回退到合成音效
                console.log('回退到合成音效');
                this.createMeowSound()();
            }
        };
    }

    /**
     * 创建连击猫叫声播放器
     * @returns {Function} 播放函数
     */
    createComboMeowPlayer() {
        return () => {
            if (!this.enabled || this.comboMeowSounds.length === 0) return;

            try {
                // 快速播放两个不同的猫叫声
                const index1 = Math.floor(Math.random() * this.comboMeowSounds.length);
                let index2 = Math.floor(Math.random() * this.comboMeowSounds.length);

                // 确保两个音效不同
                while (index2 === index1 && this.comboMeowSounds.length > 1) {
                    index2 = Math.floor(Math.random() * this.comboMeowSounds.length);
                }

                const audio1 = this.comboMeowSounds[index1];
                const audio2 = this.comboMeowSounds[index2];

                // 播放第一个猫叫声
                audio1.currentTime = 0;
                audio1.volume = this.volume * 1.2;
                audio1.play().catch(error => {
                    console.warn('连击猫叫声1播放失败:', error);
                });

                // 延迟播放第二个猫叫声
                setTimeout(() => {
                    audio2.currentTime = 0;
                    audio2.volume = this.volume * 1.1;
                    audio2.play().catch(error => {
                        console.warn('连击猫叫声2播放失败:', error);
                    });
                }, 200);

            } catch (error) {
                console.warn('连击猫叫声播放失败:', error);
                // 回退到合成音效
                this.createComboMeowSound()();
            }
        };
    }

    /**
     * 加载音频文件
     * @param {string} name 音效名称
     * @param {string} src 音频文件路径
     */
    loadAudioFile(name, src) {
        const audio = new Audio(src);
        audio.preload = 'auto';
        audio.volume = this.volume;

        audio.addEventListener('error', () => {
            console.warn(`音频文件加载失败: ${src}`);
        });

        this.sounds[name] = () => {
            if (!this.enabled) return;

            try {
                audio.currentTime = 0;
                audio.volume = this.volume;
                audio.play().catch(error => {
                    console.warn('音效播放失败:', error);
                });
            } catch (error) {
                console.warn('音效播放失败:', error);
            }
        };
    }

    /**
     * 播放音效
     * @param {string} soundName 音效名称
     */
    play(soundName) {
        console.log(`尝试播放音效: ${soundName}`, {
            enabled: this.enabled,
            soundExists: !!this.sounds[soundName]
        });

        if (!this.enabled) {
            console.log('音效已禁用，跳过播放');
            return;
        }

        if (!this.sounds[soundName]) {
            console.warn(`音效不存在: ${soundName}`);
            return;
        }

        try {
            console.log(`开始播放音效: ${soundName}`);
            this.sounds[soundName]();
        } catch (error) {
            console.warn(`播放音效失败: ${soundName}`, error);
        }
    }

    /**
     * 播放消除音效（喵喵叫）
     */
    playMatch() {
        this.play('match');
    }

    /**
     * 播放点击音效
     */
    playClick() {
        this.play('click');
    }

    /**
     * 播放连击音效
     */
    playCombo() {
        this.play('combo');
    }

    /**
     * 播放无效操作音效
     */
    playInvalid() {
        this.play('invalid');
    }

    /**
     * 播放成功音效
     */
    playSuccess() {
        this.play('success');
    }

    /**
     * 设置音效开关
     * @param {boolean} enabled 是否启用
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        GameUtils.storage.set('soundEnabled', enabled);

        // 更新UI
        const soundBtn = document.getElementById('sound-btn');
        if (soundBtn) {
            const icon = soundBtn.querySelector('.btn-icon');
            if (icon) {
                icon.textContent = enabled ? '🔊' : '🔇';
            }
        }
    }

    /**
     * 设置音量
     * @param {number} volume 音量 (0-1)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        GameUtils.storage.set('soundVolume', this.volume);

        // 更新猫叫声音频的音量
        if (this.meowSounds) {
            this.meowSounds.forEach(audio => {
                audio.volume = this.volume;
            });
        }

        if (this.comboMeowSounds) {
            this.comboMeowSounds.forEach(audio => {
                audio.volume = this.volume * 1.2;
            });
        }

        // 更新其他音频对象的音量
        Object.keys(this.sounds).forEach(key => {
            const sound = this.sounds[key];
            if (sound && sound.volume !== undefined) {
                sound.volume = this.volume;
            }
        });
    }

    /**
     * 切换音效开关
     */
    toggle() {
        this.setEnabled(!this.enabled);

        // 播放测试音效
        if (this.enabled) {
            setTimeout(() => this.playClick(), 100);
        }
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 音效按钮点击事件
        const soundBtn = document.getElementById('sound-btn');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                this.toggle();
                GameUtils.addClass(soundBtn, 'clicked');
                setTimeout(() => {
                    GameUtils.removeClass(soundBtn, 'clicked');
                }, 300);
            });
        }

        // 音量滑块事件
        const volumeSlider = document.getElementById('sound-volume');
        if (volumeSlider) {
            volumeSlider.value = this.volume * 100;
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value / 100);
            });
        }
    }

    /**
     * 自动解锁音频（不需要用户交互）
     */
    autoUnlockAudio() {
        console.log('自动解锁音频播放...');

        // 创建一个静音的音频上下文来"解锁"音频播放
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // 检查音频上下文状态
            if (audioContext.state === 'suspended') {
                // 尝试恢复音频上下文
                audioContext.resume().then(() => {
                    console.log('音频上下文已恢复');
                    this.unlockHtml5Audio();
                }).catch(error => {
                    console.warn('音频上下文恢复失败:', error);
                    // 如果恢复失败，等待用户交互
                    this.waitForUserInteraction();
                });
            } else {
                console.log('音频上下文状态正常');
                this.unlockHtml5Audio();
            }
        } catch (error) {
            console.warn('音频上下文初始化失败:', error);
            this.waitForUserInteraction();
        }
    }

    /**
     * 解锁HTML5音频
     */
    unlockHtml5Audio() {
        if (this.meowSounds && this.meowSounds.length > 0) {
            this.meowSounds.forEach((audio, index) => {
                const originalVolume = audio.volume;
                audio.volume = 0;
                audio.play().then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                    audio.volume = originalVolume;
                    console.log(`猫叫声 ${index + 1} 已解锁`);
                }).catch(error => {
                    // 静默处理错误，不影响游戏体验
                    console.log(`猫叫声 ${index + 1} 将在首次用户交互时解锁`);
                });
            });
        }
    }

    /**
     * 等待用户交互来解锁音频
     */
    waitForUserInteraction() {
        const unlockEvents = ['click', 'touchstart', 'keydown'];
        const unlockHandler = () => {
            console.log('用户交互，解锁音频播放...');
            this.handleFirstUserInteraction();

            // 移除事件监听器
            unlockEvents.forEach(eventType => {
                document.removeEventListener(eventType, unlockHandler);
            });
        };

        unlockEvents.forEach(eventType => {
            document.addEventListener(eventType, unlockHandler, { once: true });
        });
    }

    /**
     * 处理首次用户交互（解决浏览器音频播放限制）
     */
    handleFirstUserInteraction() {
        console.log('首次用户交互，解锁音频播放...');

        // 创建一个静音的音频上下文来"解锁"音频播放
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.01);

            console.log('音频上下文已解锁');
        } catch (error) {
            console.warn('音频上下文初始化失败:', error);
        }

        // 同时解锁HTML5音频
        if (this.meowSounds && this.meowSounds.length > 0) {
            this.meowSounds.forEach((audio, index) => {
                const originalVolume = audio.volume;
                audio.volume = 0;
                audio.play().then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                    audio.volume = originalVolume;
                    console.log(`猫叫声 ${index + 1} 已解锁`);
                }).catch(error => {
                    console.warn(`猫叫声 ${index + 1} 解锁失败:`, error);
                });
            });
        }
    }

    /**
     * 预加载所有音效
     */
    preloadSounds() {
        console.log('音效系统已初始化');

        // 预加载猫叫声音频
        if (this.meowSounds && this.meowSounds.length > 0) {
            console.log(`已加载 ${this.meowSounds.length} 个猫叫声音效`);

            // 测试播放第一个音效（静音）
            const testAudio = this.meowSounds[0];
            const originalVolume = testAudio.volume;
            testAudio.volume = 0;
            testAudio.play().then(() => {
                testAudio.pause();
                testAudio.currentTime = 0;
                testAudio.volume = originalVolume;
                console.log('猫叫声音效预加载成功');
            }).catch(error => {
                console.warn('猫叫声音效预加载失败:', error);
            });
        }
    }


}

// 导出类
window.AudioManager = AudioManager;