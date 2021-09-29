# 基于镜像基础
FROM python:3.7

EXPOSE 9567

# RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
# RUN echo 'Asia/Shanghai' >/etc/timezone


# 设置代码文件夹工作目录 /app
WORKDIR /app
  
# 复制当前代码文件到容器中 /app
COPY . /app
# COPY . /
# COPY . /
# RUN apt-get -o Acquire::Max-FutureTime=86400 update
# RUN date -s "$(wget -qSO- --max-redirect=0 google.com 2>&1 | grep Date: | cut -d' ' -f5-8)Z"
# RUN apt update
# RUN systemctl start ntpd
RUN echo "Acquire::Check-Valid-Until \"false\";\nAcquire::Check-Date \"false\";" | cat > /etc/apt/apt.conf.d/10no--check-valid-until
RUN sed -i 's|security.debian.org/debian-security|mirrors.ustc.edu.cn/debian-security|g' /etc/apt/sources.list
RUN sed -i 's#http://deb.debian.org#https://mirrors.163.com#g' /etc/apt/sources.list

RUN apt-get clean

# RUN apt-get update -y && apt-get install -y chromium
RUN apt-get update -y && apt-get install -y icc-profiles-free
RUN apt-get update -y && apt-get install -y chromium


# CHROMIUM default flags for container environnement
# The --no-sandbox flag is needed by default since we execute chromium in a root environnement
RUN echo 'export CHROMIUM_FLAGS="$CHROMIUM_FLAGS --no-sandbox --disable-gpu"' >> /etc/chromium.d/default-flags
# RUN echo 'export CHROMIUM_FLAGS="$CHROMIUM_FLAGS --no-sandbox --force-color-profile=sRGB --disable-gpu --disable-software-rasterizer -ignore-gpu-blocklist --use-gl=desktop --headless --use-gl=swiftshader --disable-dev-shm-usage"' >> /etc/chromium.d/default-flags
# RUN echo 'export CHROMIUM_FLAGS="$CHROMIUM_FLAGS ' >> /etc/chromium.d/default-flags
# MOTD
RUN echo " \n =============HTML2IMAGE============= \n Welcome to the html2image CLI container ! \n Type html2image -h for help :)" >> /etc/motd
RUN echo "clear" >> /root/.bashrc
RUN echo "cat /etc/motd" >> /root/.bashrc




# RUN apt-get update && apt-get install -y wget 
# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
# RUN echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list
# RUN apt-get update
# RUN apt-get install -y google-chrome-stable xvfb
# ENV CHROME_BIN='/usr/bin/google-chrome-stable'


# Xvfb

# RUN apt-get update -qqy \
# 	&& apt-get -qqy install xvfb \
# 	&& rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# # Google Chrome

# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
# 	&& echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
# 	&& apt-get update -qqy \
# 	&& apt-get -qqy install google-chrome-stable \
# 	&& rm /etc/apt/sources.list.d/google-chrome.list \
# 	&& rm -rf /var/lib/apt/lists/* /var/cache/apt/* \
# 	&& sed -i 's/"$HERE\/chrome"/xvfb-run "$HERE\/chrome" --no-sandbox/g' /opt/google/chrome/google-chrome
# RUN apt-get update -y && apt-get install -y chromium-browser


# CHROMIUM default flags for container environnement
# The --no-sandbox flag is needed by default since we execute chromium in a root environnement
# RUN echo 'export CHROMIUM_FLAGS="$CHROMIUM_FLAGS --no-sandbox"' >> /etc/chromium.d/default-flags

# MOTD
# RUN echo " \n =============HTML2IMAGE============= \n Welcome to the html2image CLI container ! \n Type html2image -h for help :)" >> /etc/motd
# RUN echo "clear" >> /root/.bashrc
# RUN echo "cat /etc/motd" >> /root/.bashrc
# Add Chrome as a user
# RUN mkdir -p /usr/src/app \
#     && adduser -D chrome \
#     && chown -R chrome:chrome /usr/src/app
# Run Chrome as non-privileged
# USER chrome
# ENV CHROME_BIN=/usr/bin/chromium-browser \
#     CHROME_PATH=/usr/lib/chromium/
# RUN chromium-browser --headless --use-gl=swiftshader --disable-software-rasterizer --disable-dev-shm-usage
# RUN chromium-browser --no-sandbox --headless --autoplay-policy=no-user-gesture-required --no-first-run --disable-gpu --use-fake-ui-for-media-stream --use-fake-device-for-media-stream --disable-sync --remote-debugging-port=9222
# Install Chrome
# RUN apt-get update && apt-get install -y \
# 	apt-transport-https \
# 	ca-certificates \
# 	curl \
# 	gnupg \
# 	hicolor-icon-theme \
# 	libcanberra-gtk* \
# 	libgl1-mesa-dri \
# 	libgl1-mesa-glx \
# 	libpangox-1.0-0 \
# 	libpulse0 \
# 	libv4l-0 \
# 	fonts-symbola \
# 	--no-install-recommends 
# RUN curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
# 	&& echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
# 	&& apt-get update && apt-get install -y \
# 	chromium-browser \
# 	--no-install-recommends \
# 	&& apt-get purge --auto-remove -y curl \
# 	&& rm -rf /var/lib/apt/lists/*
# RUN apt update && apt install -y \ 
#   chromium
# RUN google-chrome-stable --no-sandbox --headless --autoplay-policy=no-user-gesture-required --no-first-run --disable-gpu 
# RUN chromium  --no-sandbox --headless --autoplay-policy=no-user-gesture-required --no-first-run --disable-gpu
# RUN /etc/init.d/dbus start
# RUN pip install opencv-python
# RUN apt-get update
# RUN apt-get install ca-certificates
# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub
# RUN apt-key add linux_signing_key.pub 
# RUN echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
# RUN apt-get update && apt-get install -y google-chrome-stable
# # RUN wget -O /tmp/chromedriver.zip http://chromedriver.storage.googleapis.com/`curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE`/chromedriver_linux64.zip
# # RUN unzip /tmp/chromedriver.zip chromedriver -d /usr/local/bin/
# RUN apt update && apt install -y \ 
#   chromium
# RUN apt-get update; apt-get clean
# # Install x11vnc.
# RUN apt-get install -y x11vnc
# # Install xvfb.
# RUN apt-get install -y xvfb
# # Install fluxbox.
# RUN apt-get install -y fluxbox
# # Install wget.
# RUN apt-get install -y wget
# # Install wmctrl.
# RUN apt-get install -y wmctrl

# RUN curl -LO https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
# RUN apt-get install -y ./google-chrome-stable_current_amd64.deb
# RUN rm google-chrome-stable_current_amd64.deb 

# RUN  pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

# # RUN apt-get update && apt-get install -y 
# RUN apt-get update && apt-get -y install apt-transport-https curl
# # RUN apt-get install -y apt-transport-https
# # RUN apt-get update
# RUN	apt-transport-https ca-certificates 
# RUN	curl gnupg  --no-install-recommends 
# RUN curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - 
# RUN echo "deb https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list 
# RUN apt-get update && apt-get install -y google-chrome-stable 






# RUN apt-get update && apt-get install -y python3-opencv
# RUN pip install opencv-python
# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
# RUN echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
# RUN apt-get update && apt-get install -y google-chrome-stable
# RUN wget -O /tmp/chromedriver.zip http://chromedriver.storage.googleapis.com/`curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE`/chromedriver_linux64.zip
# RUN unzip /tmp/chromedriver.zip chromedriver -d /usr/local/bin/
# RUN apt update && apt install -y \ 
#   chromium




# ENV CHROME_VERSION "google-chrome-stable"
# RUN apt-get install -y ca-certificates wget
# RUN sed -i -- 's&deb http://deb.debian.org/debian jessie-updates main&#deb http://deb.debian.org/debian jessie-updates main&g' /etc/apt/sources.list \
#   && apt-get update && apt-get install wget -
# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
#   && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list \
#   && apt-get update && apt-get -qqy install ${CHROME_VERSION:-google-chrome-stable}


# # Set the Chrome repo.
# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
#     && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
# # Install Chrome.
# RUN apt-get update && apt-get -y install google-chrome-stable
# RUN curl -s https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' | tee /etc/apt/sources.list.d/google-chrome.list && apt-get update && apt-get install -y google-chrome-stable
# RUN apt-get update && apt-get install -y wget 
# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub 
# RUN apt-key add nodesource.gpg.key
# RUN echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list
# # RUN apt-get update
# RUN apt-get install -y google-chrome-stable xvfb
# ENV CHROME_BIN='/usr/bin/google-chrome-stable'
# COPY ./wkhtml/ /data/

# RUN apt-get update && \
#       apt-get -y install sudo
# # # RUN sudo chmod -R 777 /data/
# RUN apt-get install yum
# RUN yum install google-chrome-stable_current_x86_64.rpm
# RUN sudo apt-get install -y openssl build-essential xorg libssl-dev xvfb
# RUN pip install coverage
# RUN wget https://hub.fastgit.org/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.4/wkhtmltox-0.12.4_linux-generic-amd64.tar.xz
# RUN tar xvJf wkhtmltox-0.12.4_linux-generic-amd64.tar.xz 

# RUN cp wkhtmltox/bin/wkhtmlto* /usr/bin/
# wget https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.4/wkhtmltox-0.12.4_linux-generic-amd64.tar.xz
# tar xvJf wkhtmltox-0.12.4_linux-generic-amd64.tar.xz 
# sudo cp wkhtmltox/bin/wkhtmlto* /usr/bin/
# RUN sudo chown root:root bin/wkhtmltopdf
# RUN sudo cp -r * /usr/
# Add chrome user
# RUN groupadd -r chrome && useradd -r -g chrome -G audio,video chrome \
#     && mkdir -p /home/chrome/Downloads && chown -R chrome:chrome /home/chrome

# # Run Chrome as non privileged user
# USER chrome

RUN  pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

# 安装所需的包
RUN pip install -r requirements.txt
  
# Run app.py when the container launches
CMD ["python", "run.py"]