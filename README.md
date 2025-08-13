# 🚀 Monad Ultra CLI Dashboard

A beautiful, feature-rich terminal-based dashboard for monitoring the Monad Testnet in real-time. Experience the power of Monad's speculative execution with stunning animations and colorful output.

![Monad Ultra CLI](https://img.shields.io/badge/Monad-Ultra%20CLI-00d4ff?style=for-the-badge&logo=terminal)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-ff6b6b?style=for-the-badge)

## 📸 Screenshot

```
  __  __  ___  _  _   _   ___     _   _ _   _____ ___    _
 |  \/  |/ _ \| \| | /_\ |   \   | | | | | |_   _| _ \  /_\
 | |\/| | (_) | .` |/ _ \| |) |  | |_| | |__ | | |   / / _ \
 |_|  |_|\___/|_|\_/_/ \_\___/    \___/|____| |_|_|_\/_/ \_\
                                                              
   ___  _    ___
  / __|| |  |_ _|
 | (__ | |__ | |
  \___||____|___|
                 

   ╭───────────────╮
   │🟢 CONNECTED   │
   ╰───────────────╯

? 🎯 What would you like to do?
❯ 🔌 Connect to Monad Testnet
  🔒 Disconnect
  📊 Open Real-Time Dashboard
  ⚡ Speculative Monitoring
  📈 Show Statistics
  🔔 Manage Subscriptions
  🌐 Network Information
  ❌ Exit

Status: 🟢 CONNECTED | ⏰ Uptime: 2m 15s | 📦 Last Block: #1,234,567 | 🔔 Subscriptions: 2
```

## ✨ Features

### 🎨 Beautiful Interface
- **Animated ASCII banners** with rainbow gradients
- **Colorful terminal UI** with blessed.js
- **Real-time animations** and loading spinners
- **Gradient text effects** throughout the interface

### ⚡ Monad Blockchain Monitoring
- **Real-time block monitoring** (Standard & Speculative)
- **Event log streaming** with WebSocket connections
- **Speculative execution tracking** with commit states
- **Performance metrics** and statistics
- **Network information** display

### 🔔 Subscription Management
- **Standard newHeads** subscription
- **Monad newHeads** (Speculative) subscription
- **Standard logs** subscription
- **Monad logs** (Speculative) subscription
- **Easy subscription management** interface

### 📊 Advanced Analytics
- **Block time calculations** (Min/Max/Average)
- **Gas usage tracking** and percentages
- **Commit state statistics** (Proposed/Finalized)
- **Connection uptime** monitoring
- **Real-time performance metrics**

## 🛠️ Installation

### Prerequisites
- Node.js 18+ installed
- Terminal with color support
- Internet connection for Monad Testnet

### Quick Start

1. **Clone or download** the project files
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the application**:
   ```bash
   npm start
   ```
   or
   ```bash
   node index.js
   ```

## 🎮 Usage

### Main Menu Options

1. **🔌 Connect to Monad Testnet**
   - Establishes WebSocket connection to `wss://testnet-rpc.monad.xyz`
   - Shows animated connection progress
   - Tests basic connectivity

2. **📊 Open Real-Time Dashboard**
   - Full-screen terminal dashboard
   - Real-time log streaming
   - Live statistics panel
   - Status monitoring

3. **⚡ Speculative Monitoring**
   - Choose between different subscription types
   - Monitor Monad's speculative execution
   - Track commit states (Proposed/Finalized)

4. **📈 Show Statistics**
   - Detailed performance metrics
   - Block time analysis
   - Subscription counts
   - Connection uptime

5. **🔔 Manage Subscriptions**
   - View active subscriptions
   - Add new subscriptions
   - Cancel all subscriptions

6. **🌐 Network Information**
   - Monad Testnet details
   - Chain ID and consensus info
   - Supported methods

### Dashboard Controls

- **ESC**: Return to main menu
- **Q**: Quit application
- **S**: Open subscription management
- **R**: Refresh dashboard

## 🌐 Network Details

- **Network**: Monad Testnet
- **Endpoint**: `wss://testnet-rpc.monad.xyz`
- **Chain ID**: `10143`
- **Consensus**: MonadBFT
- **Block Time**: ~400ms
- **Speculative Advantage**: ~1s

## 📦 Dependencies

- **chalk**: Colorful terminal output
- **figlet**: ASCII art text generation
- **gradient-string**: Beautiful gradient text effects
- **inquirer**: Interactive command-line prompts
- **ws**: WebSocket client for real-time data
- **blessed**: Terminal UI framework
- **boxen**: Beautiful terminal boxes
- **ora**: Elegant terminal spinners

## 🎯 Supported Subscriptions

### Standard Ethereum Methods
- `newHeads` - Standard block headers
- `logs` - Standard event logs

### Monad-Specific Methods
- `monadNewHeads` - Speculative block headers with commit states
- `monadLogs` - Speculative event logs

## 🚀 Features Showcase

### Beautiful Animations
- Rainbow gradient banners
- Animated loading spinners
- Smooth transitions
- Colorful status indicators

### Real-time Monitoring
- Live block streaming
- Gas usage tracking
- Performance metrics
- Connection status

### Advanced Analytics
- Block time calculations
- Speculative execution tracking
- Commit state monitoring
- Network performance stats

## 🔧 Configuration

The application connects to Monad Testnet by default. No additional configuration is required.

### Environment Variables (Optional)
```bash
# Custom WebSocket endpoint (if needed)
MONAD_WS_URL=wss://your-custom-endpoint.com
```

## 📊 Statistics Tracked

- **Standard Blocks**: Regular blockchain blocks
- **Speculative Blocks**: Monad's speculative execution blocks
- **Event Logs**: Smart contract event logs
- **Proposed Blocks**: Blocks in proposed state
- **Finalized Blocks**: Blocks in finalized state
- **Block Times**: Min/Max/Average block processing times
- **Connection Uptime**: How long you've been connected

## 🎨 Visual Features

- **ASCII Art Headers**: Beautiful figlet-generated banners
- **Gradient Text**: Rainbow and custom gradient effects
- **Animated Spinners**: Custom loading animations
- **Colored Boxes**: Boxen-generated information panels
- **Status Indicators**: Real-time connection and subscription status
- **Progress Animations**: Visual feedback for all operations

## 🛡️ Error Handling

- Graceful WebSocket disconnection handling
- Automatic reconnection attempts
- User-friendly error messages
- Safe exit procedures

## 🤝 Contributing

Feel free to contribute to this project! Areas for improvement:
- Additional subscription types
- More detailed analytics
- Custom themes
- Export functionality

## 📄 License

MIT License - Feel free to use and modify as needed.

## 🌟 Acknowledgments

- **Monad Team** for the amazing blockchain technology
- **Node.js Community** for excellent packages
- **Terminal UI Libraries** for beautiful interfaces

---

**Made with ❤️ for the Monad Community**

🚀 **Keep building the future!** 🚀