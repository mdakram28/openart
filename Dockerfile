FROM mdakram28/openart:latest
EXPOSE 8545
EXPOSE 8080
EXPOSE 4001
EXPOSE 5001

ENTRYPOINT bash /root/openart/start.sh
