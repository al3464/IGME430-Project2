# 使用官方 Node.js 镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（它们在根目录）
COPY package*.json ./

# 安装生产依赖（如果开发依赖也需要，可以用 npm install）
RUN npm ci --only=production

# 如果你需要构建前端（client），取消下面两行的注释
# COPY client ./client
# RUN npm run build    # 前提是 package.json 里有 build 脚本

# 复制后端代码（server 文件夹）
COPY server ./server

# 如果还有 views 或 hosted 需要复制，也加上
COPY views ./views
COPY hosted ./hosted

# 暴露后端服务的端口（改成你项目实际用的端口，比如 3000）
EXPOSE 3000

# 启动命令：执行 server 文件夹下的 app.js
CMD ["node", "server/app.js"]