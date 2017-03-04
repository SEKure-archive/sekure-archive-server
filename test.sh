#!/bin/sh

docker build -f Dockerfile.test -t sekure-archive-server-test .
docker run -it sekure-archive-server-test
