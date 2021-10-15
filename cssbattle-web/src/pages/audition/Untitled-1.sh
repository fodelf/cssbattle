docker run -d -p 3478:3478/tcp -p 3478:3478/udp \
            --name cssbattleCoturn \
            instrumentisto/coturn \
            -n --log-file=stdout \
            --realm=110.42.220.32 \
            --server-name=turnserver \
            --min-port=40000 --max-port=60000 \
            --lt-cred-mech --fingerprint \
            --no-multicast-peers --no-cli \
            --no-tlsv1 --no-tlsv1_1 \
            --listening-port=3478 \
            --external-ip=110.42.220.32 \
            --listening-ip=0.0.0.0 \
            --user=admin:123456