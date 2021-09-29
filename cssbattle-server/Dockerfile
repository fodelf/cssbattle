FROM golang:latest

ENV GOPROXY=https://goproxy.cn,direct

WORKDIR $GOPATH/src/github.com/fodelf/cssbattle

COPY . $GOPATH/src/github.com/fodelf/cssbattle

RUN go build .

ENTRYPOINT ["./cssbattle"]