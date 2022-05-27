#!/bin/bash

RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
NC=$(tput sgr0) # No Color
BOLD=$(tput bold)
NORM=$(tput sgr0)

# make shell script work independent of where you invoke it from
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"       


prepareReleseWithVersion() 
{
    version="${1}"

    ./prepare.sh -v "${1}"
}

usage()
{
    echo "prepareRelease [-v,--version 1.0.0] [-p, --makepr]"
}

makePRwithVersion() 
{
    version="$1"
    releaseBranch="release/${1}"
    
    # original branch
    branch=$(git symbolic-ref -q HEAD)
    branch=${branch##refs/heads/}
    branch=${branch:-HEAD}
    
    if [[ "${branch}" != "develop" ]]; then
        response=
        read -p "Are you sure u want to start from ${branch}? Y/n > " response
        if [[ "${response}" == "n" ]]; then
            return
        fi
    fi
    
    git checkout -b "${releaseBranch}"
    git rm prepare.sh
    git rm prepare-release.sh 
    git rm RELEASE.md
    git add .
    git commit -am "prepare for release ${version}"
    git push --set-upstream origin "${releaseBranch}"
    git checkout "${branch}"

    GITHUBREPOSITORYURL=`git config --get remote.origin.url`
    GITHUBREPOSITORYURL=${GITHUBREPOSITORYURL%.git}

    echo -e "\nCompare and open Pull Request ${GREEN}${releaseBranch} -> MAIN${NC}:"
    echo -e "${BOLD}${GITHUBREPOSITORYURL}/compare/main...${releaseBranch}${NORM}"
	
    # automatically open url
    open "${GITHUBREPOSITORYURL}/compare/main...${releaseBranch}"
}


version=
makepr=false
if [ $# -gt 0 ]; then
    while [ "$1" != "" ]; do
        case $1 in
            -v | --version )        shift
                                    version=$1
                                    ;;
            -p | --makepr )         shift
                                    makepr=true
                                    ;;
            -h | --help )           usage
                                    exit
                                    ;;
            * )                     usage
                                    exit 1
        esac
        shift
    done
else
    response=
    read -p "Enter version  of this release (es 1.0.0) > " response
    if [ -n "${response}" ]; then
        version="${response}"
    fi

    read -p "Do you want to make a PR with release ${version}? Y/n > " response
    if [[ "${response}" != "n" ]]; then
        makepr=true
    fi
fi

if [ -z "$version" ]; then
    echo -e "Missing ${RED}-v | --version${NC}${NORM} option"
    usage
    exit 1
fi

if [[ -n $(git status -s) ]] 
then
    echo "You have uncommited changes."
    echo "Please commit your changes and launch 'prepare-release.sh' again "
    exit
fi

# DEBUG ONLY
prepareReleseWithVersion $version
if [ "${makepr}" = true ] ; then
    makePRwithVersion $version
fi
