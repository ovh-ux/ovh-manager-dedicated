#### SYSTEM COMMAND ####
NODE=node
YARN=yarn
GIT=git
CD=cd
ECHO=@echo
TAR=tar -zcf
DEL=rm -rf
MAKE=make
MV=mv
RSYNC=rsync -av --delete --exclude=".git"

#### FOLDERS ####
NODE_DIR=node_modules
DIST_DIR=dist
DIST_EU_DIR=dist-EU
DIST_CA_DIR=dist-CA
DIST_US_DIR=dist-US

#### FILES ####
DIST_TAR=dist.tar.gz
DIST_EU_TAR=dist-EU.tar.gz
DIST_CA_TAR=dist-CA.tar.gz
DIST_US_TAR=dist-US.tar.gz
DEPENDENCIES_FILES_LIST=Assets.js

#### MACRO ####
NAME=`grep -Po '(?<="name": ")[^"]*' package.json`

#### OTHER ####

help:
	$(ECHO) "_____________________________"
	$(ECHO) "$(NAME)"
	$(ECHO) "Copyright (c) OVH SAS."
	$(ECHO) "All rights reserved."
	$(ECHO) "_____________________________"
	$(ECHO) " -- AVAILABLE TARGETS --"
	$(ECHO) "make clean                                                         => clean the sources"
	$(ECHO) "make install                                                       => install deps"
	$(ECHO) "make dev                                                           => launch the project (development)"
	$(ECHO) "make prod                                                          => launch the project (production) - For testing purpose only"
	$(ECHO) "make test                                                          => launch the tests"
	$(ECHO) "make test-e2e suite=smoke|full browser=phantomjs|chrome|firefox    => launch the e2e tests"
	$(ECHO) "make coverage                                                      => launch the coverage"
	$(ECHO) "make build                                                         => build the project and generate dist"
	$(ECHO) "make release type=patch|minor|major                                => build the project, generate build folder, increment release and commit the source"
	$(ECHO) "_____________________________"

clean:
	$(DEL) $(NODE_DIR)
	$(DEL) $(DIST_DIR)
	$(DEL) $(DIST_TAR)
	$(DEL) $(DIST_EU_DIR)
	$(DEL) $(DIST_CA_DIR)
	$(DEL) $(DIST_US_DIR)
	$(DEL) $(DIST_EU_TAR)
	$(DEL) $(DIST_CA_TAR)
	$(DEL) $(DIST_US_TAR)

install:
	$(YARN) install

dev: deps
	$(YARN) start

build: build-eu build-ca build-us
	$(TAR) $(DIST_TAR) $(DIST_EU_TAR) $(DIST_CA_TAR) $(DIST_US_TAR)

build-eu:
	$(YARN) build:eu
	mkdir dist/client
	cd dist && ls -1 | grep -v ^client$ | xargs -I{} mv {} client && cd ..
	$(MV) $(DIST_DIR) $(DIST_EU_DIR)
	$(TAR) $(DIST_EU_TAR) $(DIST_EU_DIR)

build-ca:
	$(YARN) build:ca
	mkdir dist/client
	cd dist && ls -1 | grep -v ^client$ | xargs -I{} mv {} client && cd ..
	$(MV) $(DIST_DIR) $(DIST_CA_DIR)
	$(TAR) $(DIST_CA_TAR) $(DIST_CA_DIR)

build-us:
	$(YARN) build:us
	mkdir dist/client
	cd dist && ls -1 | grep -v ^client$ | xargs -I{} mv {} client && cd ..
	$(MV) $(DIST_DIR) $(DIST_US_DIR)
	$(TAR) $(DIST_US_TAR) $(DIST_US_DIR)

release:
	$(YARN) version --new-version $(type) --message "chore: release v%s"

###############
# Tests tasks #
###############

TEST_REPORTS=test-reports

test:
	$(ECHO) "TODO: fix unit tests"

coverage:
	$(ECHO) "TODO: fix coverage"

webdriver:
	$(YARN) run update-webdriver

test-e2e: webdriver
	$(ECHO) "TODO: fix e2e"

tar-test-reports:
	$(TAR) $(TEST_REPORTS).tar.gz $(TEST_REPORTS)


#############
# Sub tasks #
#############

$(NODE_DIR)/%:
	$(MAKE) install

clean-dist: $(GRUNT_DEP)
	$(GRUNT) clean
