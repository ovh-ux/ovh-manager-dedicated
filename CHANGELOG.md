<a name="9.2.16"></a>
## [9.2.16](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.15...v9.2.16) (2018-05-03)


### Bug Fixes

* **modal:** remove aria-hidden and tab-index ([e48e50c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e48e50c))



<a name="9.2.15"></a>
## [9.2.15](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.14...v9.2.15) (2018-05-03)


### Bug Fixes

* **interventions:** add missing serviceName param ([b32d0fb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b32d0fb))



<a name="9.2.14"></a>
## [9.2.14](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.13...v9.2.14) (2018-04-26)


### Bug Fixes

* display pay debt button only when dueAmount is more than 0 in US ([7ddaf4f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7ddaf4f))
* display publicLabel when no description on payment method ([47c933c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/47c933c))
* fix after review ([954e4e6](https://github.com/ovh-ux/ovh-manager-dedicated/commit/954e4e6))
* fix and refactor billing history details view ([eb5ca18](https://github.com/ovh-ux/ovh-manager-dedicated/commit/eb5ca18))
* fix link to state for new payment method ([550da86](https://github.com/ovh-ux/ovh-manager-dedicated/commit/550da86))
* fix payment method label in select ([d63a331](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d63a331))
* fix some trads and remove EU link for US ([31a03bd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/31a03bd))
* package.json and remove unnecessary comments ([cee68a3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/cee68a3))
* pass payment method id in pay debt request ([52d8cdd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/52d8cdd))
* update DEBTACCOUNT_DEBT translation for US test ([2c00d62](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2c00d62))
* upgrade ovh-api-services version ([8c4b472](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8c4b472))


### Features

* **debtaccount:** manage debt for US customers ([431b3c8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/431b3c8))



<a name="9.2.13"></a>
## [9.2.13](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.12...v9.2.13) (2018-04-25)


### Bug Fixes

* display info to the enterprise customer concerning retail prices ([0290db9](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0290db9))
* rename services to v6 and v7 ([f216afd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f216afd)), closes [ovh-ux/ovh-api-services#68](https://github.com/ovh-ux/ovh-api-services/issues/68)
* use internal state definition instead of initial declaration ([e678a71](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e678a71))
* **billing confirm terminate:** add missing translation key for cpanel ([5ccc6c9](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5ccc6c9))
* **dedicated ml-subscribe:** fix _.some to indexOf ([2cd6665](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2cd6665))
* **dedicatedcloud:** fix after review ([aaf976b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/aaf976b))
* **dedicatedcloud:** fix ml subscribe modal display on user view ([b9a3e4c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b9a3e4c))
* **dedicatedcloud:** remove unecessary translation for ml subscribe ([34fbc7d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/34fbc7d))
* **dedicatedcloud ml subscribe:** fix after review ([43bf071](https://github.com/ovh-ux/ovh-manager-dedicated/commit/43bf071))
* **dedicatedcloud ml subscribe:** remove mock in modal ([67d44f8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/67d44f8))
* **housing tasks:** replace table with oui-datagrid ([c9cf573](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c9cf573))
* **ip:** improve ip organisation table to match ovh oui-kit style ([b87f61c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b87f61c))
* **layout modal:** fix toChilds detection ([deb092f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/deb092f))
* **me-alerts:** fix bad links to billing statements ([539f6ef](https://github.com/ovh-ux/ovh-manager-dedicated/commit/539f6ef))
* **modal layout:** fix unecessary child states applied to layout ([e675707](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e675707))
* **pcc datacenters:** replace table with oui-datagrid ([adae0dc](https://github.com/ovh-ux/ovh-manager-dedicated/commit/adae0dc))
* **pcc datacenters:** tooltip if has discount ([e76c1f4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e76c1f4))
* **server tasks:** replace table with oui-datagrid ([980a8bc](https://github.com/ovh-ux/ovh-manager-dedicated/commit/980a8bc))
* **sidebar:** users management section available in all targets ([c871e7a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c871e7a)), closes [#161](https://github.com/ovh-ux/ovh-manager-dedicated/issues/161)
* **uibmodal stateful:** update stateful modal closing methods ([d0e4c21](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d0e4c21))
* **yarn.lock:** fix ovh-utils-angular version ([64ee416](https://github.com/ovh-ux/ovh-manager-dedicated/commit/64ee416))
* fix after review ([c363375](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c363375))
* fix typo ([b3beaeb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b3beaeb))
* set link instead of button for .go('^') onClick ([c7900c0](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c7900c0))


### Features

* **dedicatedcloud:** subscribe to ML modal through ui-router ([4b788ce](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4b788ce))
* **dedicatedcloud:** wip - migrate modal to states ([5201f3f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5201f3f))
* handle roles in user tab ([eac1205](https://github.com/ovh-ux/ovh-manager-dedicated/commit/eac1205))



<a name="9.2.12"></a>
## [9.2.12](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.11...v9.2.12) (2018-04-19)


### Bug Fixes

* temporarily remove debt messages for US ([639c738](https://github.com/ovh-ux/ovh-manager-dedicated/commit/639c738))



<a name="9.2.11"></a>
## [9.2.11](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.10...v9.2.11) (2018-04-12)


### Bug Fixes

* **user contracts:** enhance modal layout ([5355502](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5355502))



<a name="9.2.10"></a>
## [9.2.10](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.9...v9.2.10) (2018-04-12)


### Bug Fixes

* **contracts:** closing modal on validate ([32b64a1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/32b64a1))



<a name="9.2.9"></a>
## [9.2.9](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.8...v9.2.9) (2018-04-12)


### Bug Fixes

* **contracts:** wrong modal id ([14140d7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/14140d7))



<a name="9.2.8"></a>
## [9.2.8](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.7...v9.2.8) (2018-04-10)


### Bug Fixes

* **license delete:** display message if already terminating ([4595cdd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4595cdd))



<a name="9.2.7"></a>
## [9.2.7](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.6...v9.2.7) (2018-04-10)


### Bug Fixes

* **bootstrap fonts path:** copy glyphicons font ([7f6659a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7f6659a))
* **dedicated server:** add HIL DC location ([a564239](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a564239))
* **license order:** replace deprecated loader to oui-spinner ([f023cb5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f023cb5))


### Features

* **billing:** improve add payment method view ([8166a1d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8166a1d))
* **i18n:** retrieve translations ([70df3bb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/70df3bb))



<a name="9.2.6"></a>
## [9.2.6](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.5...v9.2.6) (2018-04-09)


### Bug Fixes

* ui-kit font path ([e2b96e4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e2b96e4))



<a name="9.2.5"></a>
## [9.2.5](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.4...v9.2.5) (2018-04-09)


### Bug Fixes

* **account billing refunds:** fix payment type info unavailable ([d3f4ef3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d3f4ef3))
* **dedicated server:** add HIL DC location ([d184ea4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d184ea4))
* **dedicated server ipmi:** fix typo ([0e1e2b7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0e1e2b7))
* **dedicatedcloud resource upgrade:** migrate from bs2 to bs3 ([5504e8b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5504e8b))
* **firewall rule:** avoid errors and set null values to rule attributes ([dd4d184](https://github.com/ovh-ux/ovh-manager-dedicated/commit/dd4d184))
* **firewall rule:** fix after review ([83cffb1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/83cffb1))
* **firewall rule:** fix firewall rule creation ([d109bf4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d109bf4))
* **firewall rule:** fix trim on undefined error ([f4fbd98](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f4fbd98))
* **ipmi:** fix after review ([4112fd6](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4112fd6))
* **sso:** fix sso auth login for dev mode ([7675468](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7675468))


### Features

* **dedicated server ipmi:** add information of os installation in IPMI ([70d9e5c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/70d9e5c))
* **multi users:** add account id col ([cfa503a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/cfa503a))
* **users:** add explain message ([9977dcb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9977dcb))



<a name="9.2.4"></a>
## [9.2.4](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.3...v9.2.4) (2018-04-05)



<a name="9.2.3"></a>
## [9.2.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.2...v9.2.3) (2018-04-04)


### Bug Fixes

* **sidebar:** use User.getUrlOf for url retrieval ([333c452](https://github.com/ovh-ux/ovh-manager-dedicated/commit/333c452))



<a name="9.2.2"></a>
## [9.2.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.1...v9.2.2) (2018-04-03)


### Bug Fixes

* **ckeditor:** fix CKEDITOR_BASEPATH initialization ([d85c6c5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d85c6c5))
* **ip mitigation:** fix html ([b77c402](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b77c402))
* **ip mitigation:** use chart js to render mitigation stats ([0ce984a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0ce984a))



<a name="9.2.1"></a>
## [9.2.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.0...v9.2.1) (2018-03-27)


### Bug Fixes

* **dedicatedcloud hds:** fix step 3 validation ([e1981da](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e1981da))



<a name="9.2.0"></a>
# [9.2.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.1.2...v9.2.0) (2018-03-26)


### Bug Fixes

* improve some modals content ([30607e3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/30607e3))
* **account user contacts:** TypeError property ovhSubsidiary ([1b3dc8c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1b3dc8c))
* **dashboard:** hide PCC guides from US customers ([5113611](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5113611))
* **dedicated server ftp-backup access:** update confirm button text ([0b34881](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0b34881))
* **dedicatedcloud dashboard:** reduce icon size ([fed541a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/fed541a))
* **pcc datacenter:** code review ([5f37d6f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5f37d6f))
* **pcc order:** fix button href ([631bc21](https://github.com/ovh-ux/ovh-manager-dedicated/commit/631bc21))
* **pcc order:** fix quantity, fix order button location ([6d2a479](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6d2a479))
* **us pcc order:** FR translations ([245f197](https://github.com/ovh-ux/ovh-manager-dedicated/commit/245f197))


### Features

* **pcc datastore order:** add pcc datastore order for us target ([2e485ce](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2e485ce))
* **pcc host order:** add pcc host order for us target ([062efde](https://github.com/ovh-ux/ovh-manager-dedicated/commit/062efde))
* **pcc us order:** code review ([57c00f4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/57c00f4))
* **pcc us order:** code review) ([33586c3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/33586c3))
* **pcc us order:** filter filers ([e25233b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e25233b))
* **pcc us order:** fix trads ([6b065cb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6b065cb))



<a name="9.1.2"></a>
## [9.1.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.1.1...v9.1.2) (2018-03-22)


### Bug Fixes

* update route, /me/user has moved to /me/identity/user ([29af383](https://github.com/ovh-ux/ovh-manager-dedicated/commit/29af383))



<a name="9.1.1"></a>
## [9.1.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.1.0...v9.1.1) (2018-03-22)


### Bug Fixes

* **dedicated server firewall:** prevent multiple alert displaying ([f0f86d8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f0f86d8))
* **dedicatedcloud datacenters:** add dropdown-append-to-body ([f8867e7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f8867e7))
* **sso auth modal:** load translations from npm folder instead of bower ([1854628](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1854628))


### Features

* **multi users:** add link in sidebar menu ([6c3fc4f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6c3fc4f))



<a name="9.1.0"></a>
# [9.1.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.19...v9.1.0) (2018-03-21)


### Bug Fixes

* **cdn:** add tiles to statistics view for cdn & cdn domains ([503320f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/503320f))
* **dedicated cloud:** remove security options for US cust ([32ad0c8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/32ad0c8))
* **dedicatedcloud:** fix after quality check ([298ddbc](https://github.com/ovh-ux/ovh-manager-dedicated/commit/298ddbc))
* **dedicatedcloud:** fix old href to ui-sref ([de1ea01](https://github.com/ovh-ux/ovh-manager-dedicated/commit/de1ea01))
* **dedicatedcloud:** fix tabs display on resolution width 1200 ([97c5fb2](https://github.com/ovh-ux/ovh-manager-dedicated/commit/97c5fb2))
* **dedicatedcloud:** remove unecessary folder ([b446076](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b446076))
* **dedicatedcloud backup:** display button if dc has at least 1 host ([48eb1dd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/48eb1dd))
* **dedicatedcloud user:** add EN translations for test ([2bb0018](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2bb0018))
* **dedicatedcloud user:** fix after review ([562f10d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/562f10d))
* **dedicatedcloud user rights:** fix translations ([ca36231](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ca36231))
* **license:** add oui-datagrid, fix title ([b14870f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b14870f))
* **nas:** add oui-datagrid ([53fe190](https://github.com/ovh-ux/ovh-manager-dedicated/commit/53fe190))
* **nas:** code review ([79f68da](https://github.com/ovh-ux/ovh-manager-dedicated/commit/79f68da))
* **pcc:** hide compliante options for us customers until it is available ([dc58eff](https://github.com/ovh-ux/ovh-manager-dedicated/commit/dc58eff))
* **sd:** button design primary -> default ([386bcb7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/386bcb7))
* **server:** fix rtm link language detection ([77b1d6f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/77b1d6f))


### Features

* **dedicatedcloud:** add backup actions to ui-router ([9a2e40c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9a2e40c))
* **dedicatedcloud:** use ui-router in dedicatedCloud section ([0dba0de](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0dba0de))
* **dedicatedcloud user:** nsx user right edit ([6bfd54a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6bfd54a))



<a name="9.0.19"></a>
## [9.0.19](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.18...v9.0.19) (2018-03-20)



<a name="9.0.18"></a>
## [9.0.18](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.17...v9.0.18) (2018-03-20)


### Bug Fixes

* **license:** temporary fix spla license screen for us customers ([5933f41](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5933f41))



<a name="9.0.17"></a>
## [9.0.17](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.16...v9.0.17) (2018-03-15)


### Bug Fixes

* **cdn:** fix broken chart legend ([2fa86f1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2fa86f1))



<a name="9.0.16"></a>
## [9.0.16](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.15...v9.0.16) (2018-03-15)


### Bug Fixes

* **guide:** fix us monitoring guide ([e4e07b4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e4e07b4))



<a name="9.0.15"></a>
## [9.0.15](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.14...v9.0.15) (2018-03-14)


### Bug Fixes

* **codeowners:** set owners to the whole repository ([78e8893](https://github.com/ovh-ux/ovh-manager-dedicated/commit/78e8893))
* **double authentication:** remove backup code rejection ([6c98b04](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6c98b04))



<a name="9.0.14"></a>
## [9.0.14](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.13...v9.0.14) (2018-03-14)



<a name="9.0.13"></a>
## [9.0.13](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.12...v9.0.13) (2018-03-14)



<a name="9.0.12"></a>
## [9.0.12](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.11...v9.0.12) (2018-03-14)



<a name="9.0.11"></a>
## [9.0.11](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.10...v9.0.11) (2018-03-13)


### Bug Fixes

* **billing:** fix filter on service page ([ce0b6c8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ce0b6c8))
* **dedicatedserver:** fix template installation ([f53eb38](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f53eb38))



<a name="9.0.10"></a>
## [9.0.10](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.9...v9.0.10) (2018-03-12)


### Bug Fixes

* **autorenew:** fix activation modal ([4800f03](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4800f03))
* **otrs:** fix text not displaying ([a01442c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a01442c))
* **user:** add contact url redirection for legacy url ([25cda75](https://github.com/ovh-ux/ovh-manager-dedicated/commit/25cda75))



<a name="9.0.9"></a>
## [9.0.9](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.8...v9.0.9) (2018-03-09)


### Bug Fixes

* **installation:** fix custom template ([a1c3a3b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a1c3a3b))



<a name="9.0.8"></a>
## [9.0.8](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.7...v9.0.8) (2018-03-09)


### Bug Fixes

* **user:** manage legacy url for contact edition ([4706908](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4706908))



<a name="9.0.7"></a>
## [9.0.7](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.6...v9.0.7) (2018-03-09)


### Bug Fixes

* **user:** fix edit contact page ([0ba3048](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0ba3048))



<a name="9.0.6"></a>
## [9.0.6](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.5...v9.0.6) (2018-03-08)


### Bug Fixes

* **dedicatedCloud:** add token & action params ([ab9ae86](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ab9ae86))



<a name="9.0.5"></a>
## [9.0.5](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.4...v9.0.5) (2018-03-08)


### Bug Fixes

* **account:** fix image path ([36d34ce](https://github.com/ovh-ux/ovh-manager-dedicated/commit/36d34ce))
* **billing:** fix terminate confirmation ([e71dbce](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e71dbce))
* **dedicated:** fix user link in operation tab ([1fdad7c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1fdad7c))
* **dedicatedcloud:** fix progressbar style for operation in todo ([962827c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/962827c))
* **dedicatedcloud user:** display error in user edition ([e33de8b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e33de8b))



<a name="9.0.4"></a>
## [9.0.4](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.3...v9.0.4) (2018-03-08)


### Bug Fixes

* update responsive layout ([9ecc102](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9ecc102))
* **billing:** fix textual close button ([67a249f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/67a249f))
* **billing:** manager my service - fix actions menu for hosting item ([9f64c75](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9f64c75))
* **billing services:** change button location for web hosting domain ([dfb4d62](https://github.com/ovh-ux/ovh-manager-dedicated/commit/dfb4d62))
* **home:** change some links to guides for fr_FR ([3c5e5f1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3c5e5f1))
* **home:** fix and remove 2 mores guides ([e1c703c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e1c703c))
* **home:** fix guide urls on home page ([1b742f1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1b742f1))



<a name="9.0.3"></a>
## [9.0.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.2...v9.0.3) (2018-03-07)


### Bug Fixes

* **dedicated:** fix invalid contacts link ([76e4e69](https://github.com/ovh-ux/ovh-manager-dedicated/commit/76e4e69))
* **nas order:** fix final order modal ([9dbb566](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9dbb566))



<a name="9.0.2"></a>
## [9.0.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.1...v9.0.2) (2018-03-07)


### Bug Fixes

* minors fixes (images, invoice ...) ([7d72002](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7d72002))
* **pcc:** fix vmware vrealize order ([4d8b2cd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4d8b2cd))



<a name="9.0.1"></a>
## [9.0.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.0...v9.0.1) (2018-03-07)


### Bug Fixes

* **translations:** fix translations path ([11eefc5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/11eefc5))



<a name="9.0.0"></a>
# 9.0.0 (2018-03-07)



