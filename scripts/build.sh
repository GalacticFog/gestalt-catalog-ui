#!/bin/sh

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
$parent_path/get-repo.js && $parent_path/compile-charts.js