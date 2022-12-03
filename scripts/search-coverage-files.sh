#!/bin/bash

coverageFiles=$(find packages apps -type f -iname lcov.info)

if [ ! -z "$coverageFiles" ];
  then
    coverageFiles=$(echo $coverageFiles | tr " " ",")

    echo "$coverageFiles"
  else echo ""
fi
