#!/usr/bin/env bash
echo "Start to publish..."
cd ~/worksvn/zc/static && svn st | awk '{if ($1 == "?") {print $2} }' | xargs svn add && svn st | awk '{if ($1 == "!") {print $2}}' | xargs svn rm && svn commit -m '1'
echo "Success";
