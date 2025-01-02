# Chọn image Node.js chính thức
FROM node:20
RUN npm install -g nodemon
# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json (nếu có) vào container
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Mở cổng mà ứng dụng của bạn sẽ chạy trên container
EXPOSE 3000

# Lệnh để chạy ứng dụng Node.js
CMD ["npm", "start"]
