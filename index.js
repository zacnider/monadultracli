#!/usr/bin/env node

import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import inquirer from 'inquirer';
import WebSocket from 'ws';
import blessed from 'blessed';
import boxen from 'boxen';
import ora from 'ora';

class MonadCLIDashboard {
    constructor() {
        this.ws = null;
        this.subscriptions = new Map();
        this.blockTimes = [];
        this.lastBlockTime = null;
        this.connectTime = null;
        this.speculativeTimes = new Map();
        this.logEventCount = 0;
        this.stats = {
            totalBlocks: 0,
            totalMonadBlocks: 0,
            totalLogs: 0,
            proposedBlocks: 0,
            finalizedBlocks: 0,
            minBlockTime: Infinity,
            maxBlockTime: 0
        };
        this.uptimeInterval = null;
        this.screen = null;
        this.logBox = null;
        this.statsBox = null;
        this.statusBox = null;
        this.isConnected = false;
        this.spinner = null;
        this.animationFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        this.currentFrame = 0;
    }

    // Beautiful animated banner display
    showBanner() {
        console.clear();
        
        // Create animated MONAD text
        const monadText = figlet.textSync('MONAD', {
            font: 'ANSI Shadow',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        });

        const ultraText = figlet.textSync('ULTRA CLI', {
            font: 'Small Slant',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        });

        // Rainbow gradient for MONAD
        const rainbowGradient = gradient([
            '#ff0000', '#ff7f00', '#ffff00', '#00ff00', 
            '#0000ff', '#4b0082', '#9400d3'
        ]);
        
        // Cyber gradient for ULTRA CLI
        const cyberGradient = gradient([
            '#00d4ff', '#00ff88', '#ffd700', '#ff6b6b'
        ]);
        
        console.log(rainbowGradient(monadText));
        console.log(cyberGradient(ultraText));
        
        // Animated welcome box with glowing effect
        const welcomeContent = 
            chalk.bold.cyan('🚀 MONAD TESTNET REAL-TIME DASHBOARD 🚀\n') +
            chalk.white('⚡ Terminal-based Live Blockchain Monitoring ⚡\n') +
            chalk.yellow('🌐 Real-time WebSocket Data Streaming 🌐\n') +
            chalk.magenta('💎 Speculative Execution Tracking 💎');
        
        const welcomeBox = boxen(welcomeContent, {
            padding: 1,
            margin: 1,
            borderStyle: 'double',
            borderColor: 'cyan',
            backgroundColor: '#0a0a0a',
            dimBorder: false
        });
        
        console.log(welcomeBox);
        
        // Animated loading with custom spinner
        const loadingSpinner = ora({
            text: gradient(['#00d4ff', '#00ff88'])('Initializing Monad Ultra CLI Dashboard...'),
            spinner: {
                interval: 100,
                frames: [
                    '🌟 ✨ 💫 ⭐ 🌟 ✨ 💫',
                    '✨ 💫 ⭐ 🌟 ✨ 💫 ⭐',
                    '💫 ⭐ 🌟 ✨ 💫 ⭐ 🌟',
                    '⭐ 🌟 ✨ 💫 ⭐ 🌟 ✨',
                    '🌟 ✨ 💫 ⭐ 🌟 ✨ 💫'
                ]
            },
            color: 'cyan'
        }).start();
        
        // Show loading progress
        setTimeout(() => {
            loadingSpinner.text = gradient(['#ff6b6b', '#4ecdc4'])('Loading blockchain modules...');
        }, 800);
        
        setTimeout(() => {
            loadingSpinner.text = gradient(['#ffd93d', '#6c5ce7'])('Connecting to Monad network...');
        }, 1600);
        
        setTimeout(() => {
            loadingSpinner.succeed(gradient(['#00ff88', '#ffd700'])('✅ Dashboard Ready! Welcome to Monad Ultra CLI!'));
            this.showWelcomeAnimation();
        }, 2400);
    }

    // Welcome animation with colors
    showWelcomeAnimation() {
        const frames = [
            '🌟 WELCOME TO MONAD ULTRA 🌟',
            '✨ WELCOME TO MONAD ULTRA ✨',
            '💫 WELCOME TO MONAD ULTRA 💫',
            '⭐ WELCOME TO MONAD ULTRA ⭐'
        ];
        
        let frameIndex = 0;
        const animationInterval = setInterval(() => {
            process.stdout.write('\r' + gradient(['#ff6b6b', '#4ecdc4', '#45b7d1'])(frames[frameIndex]));
            frameIndex = (frameIndex + 1) % frames.length;
        }, 200);
        
        setTimeout(() => {
            clearInterval(animationInterval);
            console.log('\n');
            this.showMainMenu();
        }, 2000);
    }

    // Enhanced main menu with beautiful colors
    async showMainMenu() {
        console.clear();
        
        // Show animated header
        const headerText = figlet.textSync('MONAD CLI', { font: 'Small' });
        console.log(gradient(['#00d4ff', '#00ff88'])(headerText));
        
        const choices = [
            {
                name: gradient(['#00ff88', '#00d4ff'])('🔌 Connect to Monad Testnet'),
                value: 'connect',
                disabled: this.isConnected
            },
            {
                name: gradient(['#ff6b6b', '#ff8e8e'])('🔒 Disconnect'),
                value: 'disconnect',
                disabled: !this.isConnected
            },
            {
                name: gradient(['#4ecdc4', '#44a08d'])('📊 Open Real-Time Dashboard'),
                value: 'dashboard',
                disabled: !this.isConnected
            },
            {
                name: gradient(['#ffd93d', '#ff9f43'])('⚡ Speculative Monitoring'),
                value: 'speculative',
                disabled: !this.isConnected
            },
            {
                name: gradient(['#a8e6cf', '#7fcdcd'])('📈 Show Statistics'),
                value: 'stats',
                disabled: !this.isConnected
            },
            {
                name: gradient(['#dda0dd', '#98d8c8'])('🔔 Manage Subscriptions'),
                value: 'subscriptions',
                disabled: !this.isConnected
            },
            {
                name: gradient(['#ff7675', '#fd79a8'])('🌐 Network Information'),
                value: 'network',
                disabled: false
            },
            {
                name: chalk.gray('❌ Exit'),
                value: 'exit'
            }
        ];

        // Show connection status with animation
        const statusText = this.isConnected ? 
            gradient(['#00ff88', '#00d4ff'])('🟢 CONNECTED TO MONAD TESTNET') :
            gradient(['#ff6b6b', '#ff8e8e'])('🔴 DISCONNECTED');
        
        console.log(boxen(statusText, {
            padding: 0,
            margin: 1,
            borderStyle: 'round',
            borderColor: this.isConnected ? 'green' : 'red'
        }));

        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: gradient(['#74b9ff', '#0984e3'])('🎯 What would you like to do?'),
                choices: choices,
                pageSize: 10
            }
        ]);

        await this.handleMenuAction(answer.action);
    }

    // Handle menu actions
    async handleMenuAction(action) {
        switch (action) {
            case 'connect':
                await this.connectToMonad();
                break;
            case 'disconnect':
                await this.disconnect();
                break;
            case 'dashboard':
                await this.openDashboard();
                break;
            case 'speculative':
                await this.openSpeculativeMonitoring();
                break;
            case 'stats':
                await this.showStats();
                break;
            case 'subscriptions':
                await this.manageSubscriptions();
                break;
            case 'network':
                await this.showNetworkInfo();
                break;
            case 'exit':
                await this.exit();
                break;
            default:
                await this.showMainMenu();
        }
    }

    // Enhanced connection with beautiful animations
    async connectToMonad() {
        console.clear();
        
        const connectHeader = figlet.textSync('CONNECTING', { font: 'Small' });
        console.log(gradient(['#00d4ff', '#00ff88'])(connectHeader));
        
        const spinner = ora({
            text: gradient(['#74b9ff', '#0984e3'])('Establishing WebSocket connection to Monad Testnet...'),
            spinner: {
                interval: 80,
                frames: [
                    '🌐 ⚡ 🔗 💫',
                    '⚡ 🔗 💫 🌐',
                    '🔗 💫 🌐 ⚡',
                    '💫 🌐 ⚡ 🔗'
                ]
            },
            color: 'cyan'
        }).start();

        try {
            this.ws = new WebSocket('wss://testnet-rpc.monad.xyz');
            
            this.ws.onopen = () => {
                spinner.succeed(gradient(['#00ff88', '#ffd700'])('✅ Successfully connected to Monad Testnet!'));
                this.isConnected = true;
                this.connectTime = Date.now();
                this.startUptimeCounter();
                this.testBasicConnection();
                
                // Show success animation
                console.log(boxen(
                    gradient(['#00ff88', '#00d4ff'])('🎉 CONNECTION ESTABLISHED 🎉\n') +
                    chalk.white('Ready to monitor Monad blockchain in real-time!'),
                    {
                        padding: 1,
                        margin: 1,
                        borderStyle: 'double',
                        borderColor: 'green'
                    }
                ));
                
                setTimeout(() => {
                    this.showMainMenu();
                }, 2000);
            };

            this.ws.onmessage = (event) => {
                this.handleMessage(JSON.parse(event.data));
            };

            this.ws.onerror = (error) => {
                spinner.fail(gradient(['#ff6b6b', '#ff8e8e'])('❌ Connection error: ' + error));
                setTimeout(() => this.showMainMenu(), 2000);
            };

            this.ws.onclose = (event) => {
                this.isConnected = false;
                this.stopUptimeCounter();
                console.log(gradient(['#ffd93d', '#ff9f43'])(`🔒 Connection closed (Code: ${event.code})`));
                setTimeout(() => this.showMainMenu(), 2000);
            };

        } catch (error) {
            spinner.fail(gradient(['#ff6b6b', '#ff8e8e'])('❌ Connection failed: ' + error.message));
            setTimeout(() => this.showMainMenu(), 2000);
        }
    }

    // Enhanced disconnect with animation
    async disconnect() {
        if (this.ws) {
            const spinner = ora({
                text: gradient(['#ff9f43', '#ffd93d'])('Disconnecting from Monad Testnet...'),
                spinner: 'dots12',
                color: 'yellow'
            }).start();
            
            this.unsubscribeAll();
            setTimeout(() => {
                this.ws.close();
                this.isConnected = false;
                spinner.succeed(gradient(['#00ff88', '#00d4ff'])('✅ Successfully disconnected'));
                setTimeout(() => this.showMainMenu(), 1500);
            }, 1000);
        }
    }

    // Enhanced real-time dashboard with beautiful UI
    async openDashboard() {
        console.clear();
        
        // Create blessed terminal UI
        this.screen = blessed.screen({
            smartCSR: true,
            title: 'Monad Ultra Real-Time Dashboard',
            fullUnicode: true
        });

        // Animated header with gradient
        const header = blessed.box({
            top: 0,
            left: 0,
            width: '100%',
            height: 3,
            content: '{center}🚀 MONAD ULTRA REAL-TIME DASHBOARD 🚀{/center}',
            tags: true,
            border: {
                type: 'line'
            },
            style: {
                fg: 'cyan',
                bg: 'black',
                border: {
                    fg: 'cyan'
                }
            }
        });

        // Enhanced status box with colors
        this.statusBox = blessed.box({
            top: 3,
            left: 0,
            width: '100%',
            height: 5,
            content: this.getStatusContent(),
            tags: true,
            border: {
                type: 'line'
            },
            style: {
                fg: 'white',
                bg: 'black',
                border: {
                    fg: 'yellow'
                }
            }
        });

        // Enhanced log box with scrolling
        this.logBox = blessed.log({
            top: 8,
            left: 0,
            width: '70%',
            height: '70%',
            content: '',
            tags: true,
            border: {
                type: 'line'
            },
            style: {
                fg: 'white',
                bg: 'black',
                border: {
                    fg: 'green'
                }
            },
            scrollable: true,
            alwaysScroll: true,
            mouse: true,
            keys: true
        });

        // Enhanced stats box
        this.statsBox = blessed.box({
            top: 8,
            left: '70%',
            width: '30%',
            height: '70%',
            content: this.getStatsContent(),
            tags: true,
            border: {
                type: 'line'
            },
            style: {
                fg: 'white',
                bg: 'black',
                border: {
                    fg: 'magenta'
                }
            }
        });

        // Enhanced controls info
        const controls = blessed.box({
            bottom: 0,
            left: 0,
            width: '100%',
            height: 3,
            content: '{center}ESC: Main Menu | Q: Quit | S: Subscriptions | R: Refresh{/center}',
            tags: true,
            style: {
                fg: 'gray',
                bg: 'black'
            }
        });

        this.screen.append(header);
        this.screen.append(this.statusBox);
        this.screen.append(this.logBox);
        this.screen.append(this.statsBox);
        this.screen.append(controls);

        // Enhanced keyboard events
        this.screen.key(['escape'], () => {
            this.screen.destroy();
            this.showMainMenu();
        });

        this.screen.key(['q', 'C-c'], () => {
            this.exit();
        });

        this.screen.key(['s'], () => {
            this.screen.destroy();
            this.manageSubscriptions();
        });

        this.screen.key(['r'], () => {
            if (this.statusBox) {
                this.statusBox.setContent(this.getStatusContent());
            }
            if (this.statsBox) {
                this.statsBox.setContent(this.getStatsContent());
            }
            this.screen.render();
        });

        this.screen.render();

        // Auto-refresh with animation
        this.dashboardInterval = setInterval(() => {
            if (this.statusBox) {
                this.statusBox.setContent(this.getStatusContent());
            }
            if (this.statsBox) {
                this.statsBox.setContent(this.getStatsContent());
            }
            this.screen.render();
        }, 1000);

        // Add welcome message to log
        this.addLog('🎉 Welcome to Monad Ultra Dashboard! Monitoring blockchain in real-time...');
    }

    // Enhanced status content with colors
    getStatusContent() {
        const status = this.isConnected ? 
            '{green-fg}🟢 CONNECTED{/green-fg}' : 
            '{red-fg}🔴 DISCONNECTED{/red-fg}';
        
        const uptime = this.getUptime();
        const lastBlock = this.stats.totalBlocks > 0 ? 
            `#{cyan-fg}${this.stats.totalBlocks}{/cyan-fg}` : '{gray-fg}-{/gray-fg}';
        
        return `{center}Status: ${status} | {yellow-fg}⏰ Uptime:{/yellow-fg} ${uptime} | {blue-fg}📦 Last Block:{/blue-fg} ${lastBlock} | {magenta-fg}🔔 Subscriptions:{/magenta-fg} ${this.subscriptions.size}{/center}`;
    }

    // Enhanced stats content with beautiful formatting
    getStatsContent() {
        return `
{center}{bold}{cyan-fg}📊 STATISTICS{/cyan-fg}{/bold}{/center}

{green-fg}🧱 Standard Blocks:{/green-fg} {white-fg}${this.stats.totalBlocks.toLocaleString()}{/white-fg}
{yellow-fg}⚡ Speculative Blocks:{/yellow-fg} {white-fg}${this.stats.totalMonadBlocks.toLocaleString()}{/white-fg}
{blue-fg}📋 Event Logs:{/blue-fg} {white-fg}${this.stats.totalLogs.toLocaleString()}{/white-fg}
{yellow-fg}🟡 Proposed:{/yellow-fg} {white-fg}${this.stats.proposedBlocks.toLocaleString()}{/white-fg}
{green-fg}🟢 Finalized:{/green-fg} {white-fg}${this.stats.finalizedBlocks.toLocaleString()}{/white-fg}

{magenta-fg}⏱️ Avg Block Time:{/magenta-fg} {cyan-fg}${this.getAverageBlockTime()}ms{/cyan-fg}
{gray-fg}📈 Min/Max:{/gray-fg} {white-fg}${this.stats.minBlockTime === Infinity ? '-' : this.stats.minBlockTime}/${this.stats.maxBlockTime}ms{/white-fg}

{red-fg}🔥 Network:{/red-fg} {white-fg}Monad Testnet{/white-fg}
{blue-fg}⚡ Chain ID:{/blue-fg} {white-fg}10143{/white-fg}
        `;
    }

    // Network information display
    async showNetworkInfo() {
        console.clear();
        
        const networkHeader = figlet.textSync('NETWORK', { font: 'Small' });
        console.log(gradient(['#74b9ff', '#0984e3'])(networkHeader));
        
        const networkInfo = boxen(
            gradient(['#00d4ff', '#00ff88'])('🌐 MONAD TESTNET INFORMATION\n\n') +
            chalk.white(`🔗 Endpoint: ${chalk.cyan('wss://testnet-rpc.monad.xyz')}\n`) +
            chalk.white(`⚡ Chain ID: ${chalk.yellow('10143')}\n`) +
            chalk.white(`🏗️ Consensus: ${chalk.magenta('MonadBFT')}\n`) +
            chalk.white(`⏱️ Block Time: ${chalk.green('~400ms')}\n`) +
            chalk.white(`🚀 Speculative Advantage: ${chalk.red('~1s')}\n`) +
            chalk.white(`📡 Supported Methods: ${chalk.blue('newHeads, logs, monadNewHeads, monadLogs')}\n`) +
            chalk.white(`💎 Features: ${chalk.rainbow('Speculative Execution, Parallel Processing')}\n`) +
            chalk.white(`🔥 Performance: ${chalk.bold.red('Ultra High Speed Blockchain')}`),
            {
                padding: 1,
                margin: 1,
                borderStyle: 'double',
                borderColor: 'cyan'
            }
        );

        console.log(networkInfo);
        
        await inquirer.prompt([
            {
                type: 'input',
                name: 'continue',
                message: gradient(['#ffd93d', '#ff9f43'])('Press Enter to return to main menu...')
            }
        ]);

        this.showMainMenu();
    }

    // Enhanced speculative monitoring
    async openSpeculativeMonitoring() {
        console.clear();
        
        const speculativeHeader = figlet.textSync('SPECULATIVE', { font: 'Small' });
        console.log(gradient(['#ffd93d', '#ff6b6b'])(speculativeHeader));
        
        const choices = [
            {
                name: gradient(['#ffd93d', '#ff9f43'])('⚡ Monad newHeads (Speculative)'),
                value: 'monad_heads'
            },
            {
                name: gradient(['#ff6b6b', '#ff8e8e'])('🔥 Monad Logs (Speculative)'),
                value: 'monad_logs'
            },
            {
                name: gradient(['#74b9ff', '#0984e3'])('🧱 Standard newHeads'),
                value: 'standard_heads'
            },
            {
                name: gradient(['#00d4ff', '#00ff88'])('📋 Standard Logs'),
                value: 'standard_logs'
            },
            {
                name: chalk.gray('🔙 Back to Main Menu'),
                value: 'back'
            }
        ];

        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'subscription',
                message: gradient(['#a8e6cf', '#7fcdcd'])('🎯 Which subscription would you like to start?'),
                choices: choices
            }
        ]);

        switch (answer.subscription) {
            case 'monad_heads':
                this.subscribeToMonadNewHeads();
                break;
            case 'monad_logs':
                this.subscribeToMonadLogs();
                break;
            case 'standard_heads':
                this.subscribeToNewHeads();
                break;
            case 'standard_logs':
                this.subscribeToLogs();
                break;
            default:
                this.showMainMenu();
                return;
        }

        setTimeout(() => this.openDashboard(), 1000);
    }

    // Enhanced subscription methods with beautiful logging
    subscribeToNewHeads() {
        this.addLog('🔔 {blue-fg}Starting Standard newHeads subscription...{/blue-fg}');
        this.sendMessage({
            id: 1,
            jsonrpc: "2.0",
            method: "eth_subscribe",
            params: ["newHeads"]
        });
    }

    subscribeToMonadNewHeads() {
        this.addLog('🔔 {yellow-fg}Starting Monad Speculative newHeads subscription...{/yellow-fg}');
        this.sendMessage({
            id: 2,
            jsonrpc: "2.0",
            method: "eth_subscribe",
            params: ["monadNewHeads"]
        });
    }

    subscribeToLogs() {
        this.addLog('🔔 {cyan-fg}Starting Standard logs subscription...{/cyan-fg}');
        this.sendMessage({
            id: 3,
            jsonrpc: "2.0",
            method: "eth_subscribe",
            params: ["logs"]
        });
    }

    subscribeToMonadLogs() {
        this.addLog('🔔 {red-fg}Starting Monad Speculative logs subscription...{/red-fg}');
        this.sendMessage({
            id: 4,
            jsonrpc: "2.0",
            method: "eth_subscribe",
            params: ["monadLogs"]
        });
    }

    // Enhanced statistics display
    async showStats() {
        console.clear();
        
        const statsHeader = figlet.textSync('STATS', { font: 'Small' });
        console.log(gradient(['#a8e6cf', '#7fcdcd'])(statsHeader));
        
        const statsBox = boxen(
            gradient(['#00d4ff', '#00ff88'])('📈 MONAD ULTRA STATISTICS\n\n') +
            chalk.white(`🧱 Standard Blocks: ${gradient(['#74b9ff', '#0984e3'])(this.stats.totalBlocks.toString())}\n`) +
            chalk.white(`⚡ Speculative Blocks: ${gradient(['#ffd93d', '#ff9f43'])(this.stats.totalMonadBlocks.toString())}\n`) +
            chalk.white(`📋 Event Logs: ${gradient(['#00d4ff', '#00ff88'])(this.stats.totalLogs.toString())}\n`) +
            chalk.white(`🟡 Proposed Blocks: ${gradient(['#ffd93d', '#ff9f43'])(this.stats.proposedBlocks.toString())}\n`) +
            chalk.white(`🟢 Finalized Blocks: ${gradient(['#00ff88', '#00d4ff'])(this.stats.finalizedBlocks.toString())}\n\n`) +
            chalk.white(`⏱️ Average Block Time: ${gradient(['#ff6b6b', '#ff8e8e'])(this.getAverageBlockTime().toString())}ms\n`) +
            chalk.white(`📊 Min/Max Block Time: ${chalk.gray(this.stats.minBlockTime === Infinity ? '-' : this.stats.minBlockTime.toString())}/${chalk.gray(this.stats.maxBlockTime.toString())}ms\n`) +
            chalk.white(`🔗 Active Subscriptions: ${gradient(['#dda0dd', '#98d8c8'])(this.subscriptions.size.toString())}\n`) +
            chalk.white(`⏰ Connection Uptime: ${gradient(['#00ff88', '#ffd700'])(this.getUptime())}`),
            {
                padding: 1,
                margin: 1,
                borderStyle: 'double',
                borderColor: 'cyan'
            }
        );

        console.log(statsBox);
        
        await inquirer.prompt([
            {
                type: 'input',
                name: 'continue',
                message: gradient(['#ff6b6b', '#4ecdc4'])('Press Enter to return to main menu...')
            }
        ]);

        this.showMainMenu();
    }

    // Enhanced subscription management
    async manageSubscriptions() {
        console.clear();
        
        const subHeader = figlet.textSync('SUBS', { font: 'Small' });
        console.log(gradient(['#dda0dd', '#98d8c8'])(subHeader));

        const choices = [
            {
                name: gradient(['#74b9ff', '#0984e3'])('📋 Show All Active Subscriptions'),
                value: 'show'
            },
            {
                name: gradient(['#00ff88', '#00d4ff'])('➕ Add New Subscription'),
                value: 'add'
            },
            {
                name: gradient(['#ff6b6b', '#ff8e8e'])('🗑️ Cancel All Subscriptions'),
                value: 'cancel'
            },
            {
                name: chalk.gray('🔙 Back to Main Menu'),
                value: 'back'
            }
        ];

        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: gradient(['#ffd93d', '#ff9f43'])('🎯 What would you like to do?'),
                choices: choices
            }
        ]);

        switch (answer.action) {
            case 'show':
                this.showActiveSubscriptions();
                break;
            case 'add':
                await this.openSpeculativeMonitoring();
                break;
            case 'cancel':
                this.unsubscribeAll();
                console.log(gradient(['#00ff88', '#00d4ff'])('✅ All subscriptions cancelled successfully'));
                setTimeout(() => this.showMainMenu(), 1500);
                break;
            default:
                this.showMainMenu();
        }
    }

    // Enhanced active subscriptions display
    showActiveSubscriptions() {
        console.clear();
        
        if (this.subscriptions.size === 0) {
            console.log(gradient(['#ffd93d', '#ff9f43'])('⚠️ No active subscriptions found'));
        } else {
            console.log(gradient(['#00ff88', '#00d4ff'])(`📋 Active Subscriptions (${this.subscriptions.size}):\n`));
            
            this.subscriptions.forEach((subscriptionId, messageId) => {
                const type = messageId === 1 ? 'Standard newHeads' :
                           messageId === 2 ? 'Monad newHeads' :
                           messageId === 3 ? 'Standard logs' :
                           messageId === 4 ? 'Monad logs' : 'Unknown';
                
                const typeColor = messageId === 1 ? gradient(['#74b9ff', '#0984e3']) :
                                messageId === 2 ? gradient(['#ffd93d', '#ff9f43']) :
                                messageId === 3 ? gradient(['#00d4ff', '#00ff88']) :
                                messageId === 4 ? gradient(['#ff6b6b', '#ff8e8e']) :
                                chalk.gray;
                
                console.log(chalk.white(`• ${typeColor(type)}: ${chalk.cyan(subscriptionId)}`));
            });
        }
        
        setTimeout(async () => {
            await inquirer.prompt([
                {
                    type: 'input',
                    name: 'continue',
                    message: gradient(['#a8e6cf', '#7fcdcd'])('Press Enter to continue...')
                }
            ]);
            this.manageSubscriptions();
        }, 100);
    }

    // Utility methods
    getUptime() {
        if (!this.connectTime) return '0s';
        const uptime = Math.floor((Date.now() - this.connectTime) / 1000);
        const minutes = Math.floor(uptime / 60);
        const seconds = uptime % 60;
        return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    }

    getAverageBlockTime() {
        if (this.blockTimes.length === 0) return 0;
        const avg = this.blockTimes.reduce((a, b) => a + b, 0) / this.blockTimes.length;
        return Math.round(avg);
    }

    // Test basic connection
    testBasicConnection() {
        this.sendMessage({
            id: 999,
            jsonrpc: "2.0",
            method: "eth_blockNumber",
            params: []
        });
    }

    // Send message to WebSocket
    sendMessage(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    // Handle incoming messages
    handleMessage(message) {
        if (message.method === 'eth_subscription') {
            this.handleSubscriptionData(message);
        } else if (message.result && message.id) {
            if (message.id === 999) {
                const blockNumber = parseInt(message.result, 16);
                this.addLog(`📊 {cyan-fg}Current block: #{/cyan-fg}${blockNumber.toLocaleString()}`);
            } else if (typeof message.result === 'string' && message.result.startsWith('0x')) {
                this.subscriptions.set(message.id, message.result);
                this.addLog(`📝 {green-fg}Subscription created: ${message.result.substring(0, 10)}...{/green-fg}`);
            }
        } else if (message.error) {
            this.addLog(`❌ {red-fg}RPC Error: ${JSON.stringify(message.error)}{/red-fg}`);
        }
    }

    // Handle subscription data
    handleSubscriptionData(message) {
        const { subscription, result } = message.params;
        
        if (result.number) {
            if (result.blockId && result.commitState) {
                this.handleMonadNewBlock(result);
            } else {
                this.handleStandardNewBlock(result);
            }
        } else if (result.address || Array.isArray(result)) {
            this.handleEventLog(result, result.blockId ? 'monad' : 'standard');
        }
    }

    // Handle standard new block
    handleStandardNewBlock(block) {
        const blockNumber = parseInt(block.number, 16);
        const gasUsed = parseInt(block.gasUsed, 16);
        const gasLimit = parseInt(block.gasLimit, 16);
        const gasUsagePercent = ((gasUsed / gasLimit) * 100).toFixed(1);
        
        this.stats.totalBlocks++;
        this.calculateBlockTime();
        
        this.addLog(`🧱 {blue-fg}Standard Block #{/blue-fg}${blockNumber.toLocaleString()} | {yellow-fg}Gas: ${gasUsagePercent}%{/yellow-fg}`);
    }

    // Handle Monad new block
    handleMonadNewBlock(block) {
        const blockNumber = parseInt(block.number, 16);
        const gasUsed = parseInt(block.gasUsed, 16);
        const gasLimit = parseInt(block.gasLimit, 16);
        const gasUsagePercent = ((gasUsed / gasLimit) * 100).toFixed(1);
        
        this.stats.totalMonadBlocks++;
        
        if (block.commitState === 'Proposed') {
            this.stats.proposedBlocks++;
        } else if (block.commitState === 'Finalized') {
            this.stats.finalizedBlocks++;
        }
        
        this.calculateBlockTime();
        
        const stateColor = block.commitState === 'Proposed' ? 'yellow-fg' :
                          block.commitState === 'Finalized' ? 'green-fg' : 'blue-fg';
        
        this.addLog(`⚡ {red-fg}Monad Block #{/red-fg}${blockNumber.toLocaleString()} {${stateColor}}[${block.commitState}]{/${stateColor}} | {yellow-fg}Gas: ${gasUsagePercent}%{/yellow-fg}`);
    }

    // Handle event log
    handleEventLog(log, type) {
        this.stats.totalLogs++;
        const prefix = type === 'monad' ? '🔥' : '📋';
        const color = type === 'monad' ? 'red-fg' : 'blue-fg';
        
        if (Array.isArray(log)) {
            this.addLog(`${prefix} {${color}}${log.length} event logs received (${type}){/${color}}`);
        } else {
            const blockNumber = log.blockNumber ? parseInt(log.blockNumber, 16) : 'pending';
            this.addLog(`${prefix} {${color}}Event log: ${log.address.substring(0, 10)}... | Block: #${blockNumber}{/${color}}`);
        }
    }

    // Add log entry
    addLog(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `{gray-fg}[${timestamp}]{/gray-fg} ${message}`;
        
        if (this.logBox) {
            this.logBox.log(logMessage);
        } else {
            console.log(logMessage);
        }
        
        this.logEventCount++;
    }

    // Calculate block time
    calculateBlockTime() {
        const currentTime = Date.now();
        if (this.lastBlockTime) {
            const timeDiff = currentTime - this.lastBlockTime;
            this.blockTimes.push(timeDiff);
            
            this.stats.minBlockTime = Math.min(this.stats.minBlockTime, timeDiff);
            this.stats.maxBlockTime = Math.max(this.stats.maxBlockTime, timeDiff);
            
            // Keep only last 50 block times
            if (this.blockTimes.length > 50) {
                this.blockTimes.shift();
            }
        }
        this.lastBlockTime = currentTime;
    }

    // Start uptime counter
    startUptimeCounter() {
        this.uptimeInterval = setInterval(() => {
            // Uptime update logic
        }, 1000);
    }

    // Stop uptime counter
    stopUptimeCounter() {
        if (this.uptimeInterval) {
            clearInterval(this.uptimeInterval);
            this.uptimeInterval = null;
        }
    }

    // Unsubscribe from all subscriptions
    unsubscribeAll() {
        this.subscriptions.forEach((subscriptionId, messageId) => {
            this.sendMessage({
                id: messageId + 100,
                jsonrpc: "2.0",
                method: "eth_unsubscribe",
                params: [subscriptionId]
            });
        });
        this.subscriptions.clear();
        this.addLog('🔕 {yellow-fg}All subscriptions cancelled{/yellow-fg}');
    }

    // Enhanced exit with beautiful animation
    async exit() {
        console.clear();
        
        if (this.ws) {
            const spinner = ora({
                text: gradient(['#ff9f43', '#ffd93d'])('Closing connections...'),
                spinner: 'dots12',
                color: 'yellow'
            }).start();
            
            this.unsubscribeAll();
            this.ws.close();
            spinner.succeed();
        }

        if (this.screen) {
            this.screen.destroy();
        }

        if (this.dashboardInterval) {
            clearInterval(this.dashboardInterval);
        }

        // Beautiful exit animation
        const exitText = figlet.textSync('GOODBYE', { font: 'Small' });
        console.log(gradient(['#ff6b6b', '#ffd93d'])(exitText));
        
        console.log(boxen(
            gradient(['#00ff88', '#00d4ff'])('🚀 MONAD ULTRA CLI DASHBOARD 🚀\n') +
            chalk.white('Thank you for using Monad Ultra CLI!\n') +
            chalk.gray('Made with ❤️ for the Monad Community\n') +
            gradient(['#ff6b6b', '#4ecdc4'])('🌟 Keep building the future! 🌟'),
            {
                padding: 1,
                margin: 1,
                borderStyle: 'double',
                borderColor: 'cyan'
            }
        ));
        
        // Final animation
        const frames = ['✨', '🌟', '💫', '⭐'];
        let frameIndex = 0;
        const exitAnimation = setInterval(() => {
            process.stdout.write(`\r${frames[frameIndex]} Shutting down gracefully... ${frames[frameIndex]}`);
            frameIndex = (frameIndex + 1) % frames.length;
        }, 200);
        
        setTimeout(() => {
            clearInterval(exitAnimation);
            console.log('\n\n' + gradient(['#00ff88', '#ffd700'])('✅ Goodbye! See you next time! 🚀'));
            process.exit(0);
        }, 2000);
    }
}

// Start the main application
const dashboard = new MonadCLIDashboard();
dashboard.showBanner();

// Graceful shutdown handlers
process.on('SIGINT', () => {
    dashboard.exit();
});

process.on('SIGTERM', () => {
    dashboard.exit();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error(chalk.red('❌ Uncaught Exception:'), error);
    dashboard.exit();
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(chalk.red('❌ Unhandled Rejection at:'), promise, chalk.red('reason:'), reason);
    dashboard.exit();
});