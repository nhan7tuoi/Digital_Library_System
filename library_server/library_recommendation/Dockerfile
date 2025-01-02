# Sử dụng Python base image
FROM python:3.10-slim

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép file requirements.txt vào container
COPY requirements.txt /app/

# Cài đặt các thư viện Python cần thiết
RUN pip install --no-cache-dir -r requirements.txt

# Sao chép file .env vào container
COPY .env /app/

# Sao chép toàn bộ mã nguồn vào container
COPY . /app/

# Thiết lập biến môi trường cho Flask
ENV FLASK_ENV=production

# Mở cổng 5000
EXPOSE 3001

# Chạy ứng dụng Flask
CMD ["flask", "run", "--host=0.0.0.0", "--port=3001"]
