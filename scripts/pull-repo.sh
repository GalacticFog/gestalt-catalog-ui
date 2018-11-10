#!/bin/sh

if [[ -z "$1" ]] || [[ -z "$2" ]] || [[ "$1" == "-h" ]]; then
  echo "Usage: `basename $0` [sourcegitrepo] [localrepo]"
  exit 0
fi

git clone "$1" "$2" 2> /dev/null || (cd "$2" ; git pull)
