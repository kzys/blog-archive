cwd=$(shell pwd)

hugo_bin=$(cwd)/tmp/hugo
hugo_version=0.71.1

ifeq ($(shell uname),Darwin)
hugo_url=https://github.com/gohugoio/hugo/releases/download/v$(hugo_version)/hugo_$(hugo_version)_macOS-64bit.tar.gz
else
hugo_url=https://github.com/gohugoio/hugo/releases/download/v$(hugo_version)/hugo_$(hugo_version)_Linux-64bit.tar.gz
endif

build: $(hugo_bin)
	cd v2 && $(hugo_bin)

upload:
	echo

server:
	cd v2 && $(hugo_bin) -wD server

$(hugo_bin):
	mkdir -p tmp
	curl --silent -L $(hugo_url) | tar -zx -C tmp -f -
