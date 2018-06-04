angular.module("App").controller("OuiMessageAlerterCtrl", class OuiMessageAlerterCtrl {

    constructor ($state, ouiMessageAlerter) {
        // Dependencies injection
        this.$state = $state;
        this.ouiMessageAlerter = ouiMessageAlerter;

        this.messageTypes = ["error", "warning", "info", "success"]; // ordered by priority
    }

    /* =============================
    =            EVENTS            =
    ============================== */

    onMessageDismissed (message) {
        return this.ouiMessageAlerter.removeMessage(message);
    }

    /* -----  End of EVENTS  ------ */

    /* =====================================
    =            DISPLAY HELPER            =
    ====================================== */

    getMessagesByType (messageType) {
        return this.ouiMessageAlerter.getMessagesFiltered({
            type: messageType
        }).reverse();
    }

    /* -----  End of DISPLAY HELPER  ------ */

    /* =======================================
    =            CONTROLLER HOOKS            =
    ======================================== */

    $onChanges (bindingsChanged) {
        let deleteOtherContext = true;

        // if context change - remove all message that are not of the current context
        if (_.has(bindingsChanged, "context")) {
            // two solutions:
            if (_.isFunction(this.isSameContext())) {
                // 1) isSameContext callback is defined (used directly on component)
                deleteOtherContext = !this.isSameContext()(_.get(bindingsChanged, "context"));
            } else if (_.get(this.$state.$current, "layout.name") === "modal") {
                // 2) if modal state - check if previous state is the parent of current to avoid removing messages
                // @TODO : set it in a provider - if we want to reuse it in other manager
                const previousState = this.$state.get(_.get(bindingsChanged, "context.previousValue"));
                deleteOtherContext = previousState ? this.$state.$current.parent.name !== previousState.name : true;
            }
        }

        if (deleteOtherContext) {
            this.ouiMessageAlerter.removeMessagesByFilter((message) => message.context !== this.context);
        }
    }

    /* -----  End of CONTROLLER HOOKS  ------ */

});
