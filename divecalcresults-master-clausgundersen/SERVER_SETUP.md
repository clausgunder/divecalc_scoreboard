# DiveCalc TCP Server Setup Guide for Mac Mini

This guide will help you set up and run the DiveCalc TCP server on a Mac Mini. The server receives data from DiveCalc software and forwards it to connected clients.

## System Requirements

- Mac Mini running macOS
- Node.js 16.x or later
- npm 8.x or later

## Installation Steps

### 1. Install Node.js and npm

If you don't have Node.js installed, download and install it from the official website:
https://nodejs.org/

You can verify the installation by running:

```bash
node --version
npm --version
```

### 2. Install DiveCalc TCP Server

```bash
npm install divecalc-tcp-server