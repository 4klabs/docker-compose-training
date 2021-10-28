#!/bin/sh

until curl -s -o /dev/null http://rabbitmq:15672; do
  sleep 1
done
  
exec "$@"
