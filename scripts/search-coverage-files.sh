#!/bin/bash

coverageFiles=$(find packages apps -type f -iname cobertura-coverage.xml)

if [ ! -z "$coverageFiles" ];
  then
    coverageFiles=$(echo "$coverageFiles" | tr '\n' ',')

    echo "$coverageFiles"
  else echo ""
fi
