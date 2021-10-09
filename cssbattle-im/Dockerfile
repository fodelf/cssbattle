FROM golang:latest

ENV GOPROXY=https://goproxy.cn,direct

WORKDIR $GOPATH/src/github.com/fodelf/cssbattle-im

COPY . $GOPATH/src/github.com/fodelf/cssbattle-im

RUN go build .

EXPOSE 9528

ENTRYPOINT ["./cssbattle-im"]