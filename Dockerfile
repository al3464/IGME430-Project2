# 使用官方 Node.js 运行时作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 先复制 package.json 和 package-lock.json（如果有）
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production


# 暴露应用端口（改成你项目里实际使用的端口，比如 3000）
EXPOSE 3000

# 启动应用（把 "app.js" 换成你的实际入口文件，比如 "server.js" 或 "bin/www"）
CMD ["node", "app.js"]