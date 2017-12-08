#!/bin/bash

cd /root/openart
ipfs daemon &
python -m SimpleHTTPServer 80 &
testrpc
