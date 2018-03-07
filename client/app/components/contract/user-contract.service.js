class UserContractService {
    constructor ($q, OvhHttp) {
        this.$q = $q;
        this.OvhHttp = OvhHttp;
    }

    getAgreementsToValidate (predicate) {
        return this._getTodoAgreements().then((contracts) => contracts.filter(predicate));
    }

    acceptAgreements (agreements) {
        const promises = agreements.map((agreement) => this.acceptAgreement(agreement));
        return this.$q.all(promises);
    }

    acceptAgreement (agreement) {
        return this.OvhHttp.post(`/me/agreements/${agreement.id}/accept`, {
            rootPath: "apiv6"
        });
    }

    _getTodoAgreements () {
        return this.OvhHttp.get("/me/agreements", {
            rootPath: "apiv6",
            params: {
                agreed: "todo"
            }
        }).then((agreements) => {
            const promises = agreements.map((agreementId) => this._getAgreementsDetail(agreementId));
            return this.$q.all(promises);
        });
    }

    _getAgreementsDetail (agreementId) {
        return this.$q
            .all({
                contract: this._getContract(agreementId),
                agreement: this._getAgreement(agreementId)
            })
            .then((data) => ({
                id: agreementId,
                code: data.contract.name,
                pdf: data.contract.pdf,
                text: data.contract.text,
                contractId: data.agreement.contractId
            }));
    }

    _getContract (agreementId) {
        return this.OvhHttp.get(`/me/agreements/${agreementId}/contract`, {
            rootPath: "apiv6"
        });
    }

    _getAgreement (agreementId) {
        return this.OvhHttp.get(`/me/agreements/${agreementId}`, {
            rootPath: "apiv6"
        });
    }
}

angular.module("App").service("UserContractService", UserContractService);
