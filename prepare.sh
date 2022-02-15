#!/bin/bash

prepareReleseWithVersion() 
{
    rm -rf example
}

usage()
{
    echo "This script is meant to be called by prepareRelase.sh"
    echo "Do not call it directly"
    echo "prepare [-v,--version 1.0.0]"
}

version=
if [ $# -gt 0 ]; then
    while [ "$1" != "" ]; do
        case $1 in
            -v | --version )        shift
                                    version=$1
                                    ;;
            -h | --help )           usage
                                    exit
                                    ;;
            * )                     usage
                                    exit 1
        esac
        shift
    done
fi

if [ -z "$version" ]; then
    usage
    exit 1
fi

prepareReleseWithVersion $version
