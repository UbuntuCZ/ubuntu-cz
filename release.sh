#!/bin/bash
git tag "$(git log -n1 --pretty=format:'%cd' --date=format:'%Y%m%d-%H%M')"
