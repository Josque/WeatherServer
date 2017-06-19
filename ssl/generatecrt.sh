#!/usr/bin/env bash
if [ -f server.cert ]; then
    rm server.cert
fi
if [ -f server.key ]; then
    rm server.key
fi

openssl req  \
    -nodes \
    -new \
    -x509 \
    -subj "/commonName=localhost" \
    -keyout server.key -out server.cert
