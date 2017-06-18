#!/usr/bin/env bash

openssl req  \
    -nodes \
    -new \
    -x509 \
    -subj "/" \
    -keyout server.key -out server.cert
