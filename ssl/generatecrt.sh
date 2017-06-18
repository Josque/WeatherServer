#!/usr/bin/env bash
rm server.cert server.key
openssl req  \
    -nodes \
    -new \
    -x509 \
    -subj "/commonName=localhost" \
    -keyout server.key -out server.cert
