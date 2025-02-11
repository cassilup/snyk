#!/usr/bin/env bash
set -e

mkdir binary-releases

# adds a file to identify a build as a standalone binary
echo '' >dist/STANDALONE

npx pkg . --compress Brotli -t node14-alpine-x64 -o binary-releases/snyk-alpine
npx pkg . --compress Brotli -t node14-linux-x64  -o binary-releases/snyk-linux
npx pkg . --compress Brotli -t node14-macos-x64  -o binary-releases/snyk-macos
npx pkg . --compress Brotli -t node14-win-x64    -o binary-releases/snyk-win-unsigned.exe

# build docker package
./release-scripts/docker-desktop-release.sh

# sign the windows binary
./release-scripts/sign-windows-binary.sh

# compute checksums
pushd binary-releases
shasum -a 256 snyk-alpine >snyk-alpine.sha256
shasum -a 256 snyk-linux >snyk-linux.sha256
shasum -a 256 snyk-macos >snyk-macos.sha256
# note: checksum for snyk-win.exe is generated by `sign-windows-binary.sh`
# note: checksum for docker-mac-signed-bundle is generated by `docker-desktop-release.sh`
popd

# removes the file we use to identify a build as a standalone binary
rm dist/STANDALONE

ls -la
