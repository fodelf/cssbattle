###
 # @Description: 描述
 # @Author: 吴文周
 # @Github: https://github.com/fodelf
 # @Date: 2022-03-12 10:56:46
 # @LastEditors: 吴文周
 # @LastEditTime: 2022-03-12 10:59:43
### 


docker run -d --name cssbattleweb -p 80:80 -p 443:443 -p 9529:9529 fodelf/cssbattleweb

docker run -d -p 3478:3478/tcp -p 3478:3478/udp \
            --name cssbattleCoturn \
            instrumentisto/coturn \
            -n --log-file=stdout \
            --min-port=40000 --max-port=60000 \
            --lt-cred-mech --fingerprint \
            --no-multicast-peers --no-cli \
            --no-tlsv1 --no-tlsv1_1 \
            --listening-port=3478 \
            --external-ip=110.42.220.32 \
            --user=admin:123456


docker run -p 9567:9567  --name cssbattleAI    fodelf/cssbattle-ai

docker run --name cssbattleserver -p 9527:9527  -d fodelf/cssbattle-server

docker run -p 9528:9528 --name cssbattleIM  -d  fodelf/cssbattle-im

docker run -d \
    --name watchtower \
    --restart unless-stopped \
    -v /var/run/docker.sock:/var/run/docker.sock \
    containrrr/watchtower -c \
    --interval 30 \
    cssbattleweb  cssbattleAI  cssbattleserver cssbattleIM
